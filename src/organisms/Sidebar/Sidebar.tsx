import React, {
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Heading } from "../../atoms/Heading/Heading";
import { LinkList } from "../../molecules/LinkList/LinkList";
import { Disclosure } from "../../molecules/Disclosure/Disclosure";
import { SidebarLandmarkContext } from "../../organisms/DocsLayout/DocsLayout";
import styles from "./Sidebar.module.css";

/* ---------- Sidebar.Group ---------- */

export interface SidebarGroupProps extends ComponentPropsWithoutRef<"section"> {
  /** Optional group label. When omitted no heading element is rendered. */
  heading?: string;
  /**
   * When true, wraps the group's LinkList in a Disclosure (details/summary)
   * collapse affordance.
   * Default: false.
   */
  collapsible?: boolean;
  /**
   * Initial open state when collapsible is true.
   * Default: true.
   */
  defaultOpen?: boolean;
  /** LinkList.Item elements. */
  children: ReactNode;
}

const SidebarGroup = forwardRef<HTMLElement, SidebarGroupProps>(function SidebarGroup(
  { heading, collapsible = false, defaultOpen = true, className, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={clsx(styles.group, className)} {...rest}>
      {heading !== undefined && (
        <Heading as="h3" size="h3" className={styles.groupHeading}>
          {heading}
        </Heading>
      )}
      {collapsible ? (
        <Disclosure
          summary={heading ?? "Links"}
          defaultOpen={defaultOpen}
          className={styles.collapsibleDisclosure}
        >
          <LinkList className={styles.linkList}>{children}</LinkList>
        </Disclosure>
      ) : (
        <LinkList className={styles.linkList}>{children}</LinkList>
      )}
    </section>
  );
});

SidebarGroup.displayName = "Sidebar.Group";

/* ---------- Sidebar root ---------- */

export interface SidebarProps extends ComponentPropsWithoutRef<"aside"> {
  /**
   * aria-label for both the <aside> and the inner <nav>.
   * Override for locale or multi-sidebar pages.
   * Default: "Sidebar".
   */
  label?: string;
  /**
   * Enables position: sticky; top: var(--space-12).
   * Disable for app shells where the sidebar lives in a fixed-height scroll container.
   * Default: true.
   */
  sticky?: boolean;
  /** One or more Sidebar.Group elements. */
  children: ReactNode;
}

/**
 * Sidebar — vertical navigation surface for docs layouts and app shells.
 *
 * Composes Heading + LinkList into a semantic <aside> + <nav> structure.
 * Groups are created with the Sidebar.Group sub-component.
 *
 * @example
 *   <Sidebar>
 *     <Sidebar.Group heading="Getting started">
 *       <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
 *       <LinkList.Item href="/docs/install">Installation</LinkList.Item>
 *     </Sidebar.Group>
 *     <Sidebar.Group heading="Components">
 *       <LinkList.Item href="/docs/button" current>Button</LinkList.Item>
 *       <LinkList.Item href="/docs/heading">Heading</LinkList.Item>
 *     </Sidebar.Group>
 *   </Sidebar>
 */
export const SidebarRoot = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { label = "Sidebar", sticky = true, className, children, ...rest },
  ref,
) {
  // When Sidebar is rendered inside DocsLayout's complementary landmark
  // (<aside aria-label="Sidebar navigation">), skip the outer <aside> wrapper
  // to avoid nesting two complementary landmarks — which axe flags as
  // landmark-complementary-is-top-level. The nav landmark is always rendered.
  const insideComplementaryLandmark = useContext(SidebarLandmarkContext);

  const nav = (
    <nav aria-label={label} className={styles.nav}>
      {children}
    </nav>
  );

  if (insideComplementaryLandmark) {
    // Render only the nav; the parent <aside> provides the landmark.
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={clsx(styles.root, sticky && styles.sticky, className)}
        {...rest}
      >
        {nav}
      </div>
    );
  }

  return (
    <aside
      ref={ref}
      aria-label={label}
      className={clsx(styles.root, sticky && styles.sticky, className)}
      {...rest}
    >
      {nav}
    </aside>
  );
});

SidebarRoot.displayName = "Sidebar";

/* ---------- Compound export ---------- */

export const Sidebar = Object.assign(SidebarRoot, {
  Group: SidebarGroup,
});
