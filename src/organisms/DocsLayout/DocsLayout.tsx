import {
  forwardRef,
  useState,
  useId,
  createContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import clsx from "clsx";
import styles from "./DocsLayout.module.css";

/**
 * Context consumed by Sidebar to suppress its own <aside> wrapper when it is
 * already rendered inside a complementary landmark provided by the parent
 * layout (e.g. DocsLayout). This prevents the axe
 * landmark-complementary-is-top-level violation caused by nested <aside>s.
 *
 * @internal — not part of the public API surface.
 */
export const SidebarLandmarkContext = createContext(false);

export interface DocsLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Sidebar organism (left column). Required.
   * At >= 768px (--bp-md) rendered as a sticky left column.
   * Below --bp-md hidden from flow; accessible via the mobile menu trigger.
   */
  sidebar: ReactNode;

  /**
   * TableOfContents molecule or any ReactNode (right column). Optional.
   * When omitted the right rail is suppressed entirely — grid reflows to two columns.
   */
  toc?: ReactNode;

  /**
   * aria-label for the mobile Sheet trigger button and the mobile nav landmark.
   * Consumers should localise this string.
   * Default: "Menu".
   */
  sidebarLabel?: string;

  /**
   * Center content slot. Typically <ArticleLayout> with as="div".
   */
  children: ReactNode;
}

/**
 * DocsLayout — three-column page template for documentation surfaces.
 *
 * Composes:
 *  - Sidebar (left, sticky, collapses to drawer at mobile)
 *  - children (center, flex 1 1 auto — typically ArticleLayout)
 *  - toc (right, sticky, hidden below lg breakpoint)
 *
 * The layout shell is a CSS grid container with named template areas
 * (`sidebar`, `content`, `toc`). Column widths, gap rhythm, and responsive
 * collapse rules live here. Content inside each column is the consumer's
 * responsibility.
 *
 * @example Typical docs page
 *   <DocsLayout
 *     sidebar={
 *       <Sidebar>
 *         <Sidebar.Group heading="Getting started">
 *           <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
 *         </Sidebar.Group>
 *       </Sidebar>
 *     }
 *     toc={<nav aria-label="On this page"><ul><li><a href="#intro">Intro</a></li></ul></nav>}
 *   >
 *     <ArticleLayout as="div">
 *       <p>Page content</p>
 *     </ArticleLayout>
 *   </DocsLayout>
 *
 * @example Without TOC (two-column layout)
 *   <DocsLayout sidebar={<Sidebar>…</Sidebar>}>
 *     <ArticleLayout as="div">…</ArticleLayout>
 *   </DocsLayout>
 */
export const DocsLayout = forwardRef<HTMLDivElement, DocsLayoutProps>(function DocsLayout(
  { sidebar, toc, sidebarLabel = "Menu", children, className, ...rest },
  ref,
) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerId = useId();

  return (
    <div ref={ref} className={clsx(styles.root, toc == null && styles.noToc, className)} {...rest}>
      {/* Mobile sidebar trigger — visible only below --bp-md */}
      <div className={styles.mobileBar}>
        <button
          type="button"
          aria-label={sidebarLabel}
          aria-expanded={mobileOpen}
          aria-controls={drawerId}
          className={styles.menuButton}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className={styles.overlay} aria-hidden="true" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer — always in DOM for CSS transition, hidden from AT when closed */}
      <div
        id={drawerId}
        className={clsx(styles.drawer, mobileOpen && styles.drawerOpen)}
        aria-label={sidebarLabel}
        role="dialog"
        aria-modal={mobileOpen ? "true" : undefined}
        // `inert` disables focus on hidden children and removes the subtree from
        // the accessibility tree (so axe's landmark-unique rule ignores the
        // drawer's nav landmark while it is hidden). React's prop serialization
        // for `inert` varies between major versions (string `""` works on 18
        // but is dropped on 19; `true` works on 19 but is unknown to React 18
        // typed JSX). Imperatively setting the attribute via ref sidesteps the
        // version difference entirely.
        ref={(node) => {
          if (!node) return;
          if (mobileOpen) {
            node.removeAttribute("inert");
          } else {
            node.setAttribute("inert", "");
          }
        }}
      >
        <div className={styles.drawerInner}>{sidebar}</div>
      </div>

      {/* Desktop sidebar column — hidden at mobile */}
      {/* SidebarLandmarkContext tells the Sidebar organism to skip its own
          <aside> wrapper so we don't nest two complementary landmarks, which
          would trigger the axe landmark-complementary-is-top-level rule. */}
      <div className={styles.sidebarCol} data-area="sidebar">
        <aside aria-label="Sidebar navigation" className={styles.sidebarAside}>
          <SidebarLandmarkContext.Provider value={true}>{sidebar}</SidebarLandmarkContext.Provider>
        </aside>
      </div>

      {/* Center content column */}
      <div className={styles.contentCol} data-area="content">
        {children}
      </div>

      {/* Right TOC column — only rendered when toc is provided */}
      {toc != null && (
        <div className={styles.tocCol} data-area="toc">
          <aside aria-label="On this page" className={styles.tocAside}>
            {toc}
          </aside>
        </div>
      )}
    </div>
  );
});

DocsLayout.displayName = "DocsLayout";
