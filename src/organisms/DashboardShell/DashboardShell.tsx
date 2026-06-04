import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Wordmark } from "../../atoms/Wordmark";
import styles from "./DashboardShell.module.css";

/* ─── Route types ──────────────────────────────────────────────── */

export interface DashboardShellRoute {
  /** Required href — all nav items are direct route links. */
  href: string;
  /** Visible nav label. */
  label: ReactNode;
  /** Optional icon slot — accepts any ReactNode (lucide-react icon, custom SVG). */
  icon?: ReactNode;
}

/* ─── Props ────────────────────────────────────────────────────── */

export interface DashboardShellProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The route currently being viewed — matched against `routes[i].href` via
   * strict string equality to apply `aria-current="page"` and the accent mark.
   */
  currentRoute?: string;
  /** Vertical nav items. Omit (or pass an empty array) to suppress the nav. */
  routes?: DashboardShellRoute[];
  /**
   * Footer slot — pinned to the bottom of the rail via `margin-top: auto`.
   * Canonical usage: identity row (avatar + name) + server-action sign-out form.
   * Omit to suppress the footer container entirely.
   */
  footer?: ReactNode;
  /**
   * Optional slot rendered between the Wordmark and the nav.
   * Intended for workspace selectors, environment badges, account switchers.
   */
  rail?: ReactNode;
  /** Override the home href used by the Wordmark link. Defaults to `"/"`. */
  homeHref?: string;
  /** Accessible label for `<nav>`. Defaults to `"Sidebar"`. */
  navLabel?: string;
  /** Accessible label for `<aside>`. Defaults to `"Navigation"`. */
  railLabel?: string;
  /**
   * Accessible label for the hamburger button when the mobile panel is closed.
   * @default "Open navigation"
   */
  mobileMenuLabel?: string;
  /**
   * Accessible label for the close button when the mobile panel is open.
   * @default "Close navigation"
   */
  mobileCloseLabel?: string;
  /** Page content — rendered inside `<main>`. Required. */
  children: ReactNode;
}

/* ─── Inline SVG icons ─────────────────────────────────────────── */

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    focusable={false}
  >
    <line x1="3" y1="5" x2="17" y2="5" />
    <line x1="3" y1="10" x2="17" y2="10" />
    <line x1="3" y1="15" x2="17" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    focusable={false}
  >
    <line x1="5" y1="5" x2="15" y2="15" />
    <line x1="15" y1="5" x2="5" y2="15" />
  </svg>
);

/* ─── DashboardShell ───────────────────────────────────────────── */

/**
 * Full-page layout organism for authenticated ops and admin surfaces.
 *
 * Desktop: flex-row layout — fixed 14rem rail (aside) on the left, scrollable
 * `<main>` on the right. Rail contains: Wordmark home link, optional `rail` slot,
 * vertical nav list, and a bottom-anchored `footer` slot.
 *
 * Mobile (below `--bp-md`): sticky top bar (hamburger + Wordmark) and an
 * off-canvas panel that slides in from the left with a semi-transparent backdrop.
 *
 * **No router awareness.** Emits plain `<a href>` for all nav links. Framework
 * router consumers handle link interception at the application level.
 *
 * **No auth logic.** Pass identity content via the `footer` slot. DashboardShell
 * is purely compositional with respect to auth.
 *
 * @example
 *   <DashboardShell
 *     currentRoute="/dashboard/jobs"
 *     routes={[
 *       { href: "/dashboard", label: "Overview" },
 *       { href: "/dashboard/jobs", label: "Jobs" },
 *     ]}
 *     footer={<div>Identity row</div>}
 *   >
 *     <h1>Jobs</h1>
 *   </DashboardShell>
 */
export const DashboardShell = forwardRef<HTMLDivElement, DashboardShellProps>(
  function DashboardShell(
    {
      currentRoute,
      routes = [],
      footer,
      rail,
      homeHref = "/",
      navLabel = "Sidebar",
      railLabel = "Navigation",
      mobileMenuLabel = "Open navigation",
      mobileCloseLabel = "Close navigation",
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    const hasRoutes = routes.length > 0;

    // Focus management: move focus into panel on open
    useEffect(() => {
      if (mobileOpen) {
        const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
          "a[href], button:not([disabled])",
        );
        firstFocusable?.focus();
      }
    }, [mobileOpen]);

    // Close on Escape key
    useEffect(() => {
      if (!mobileOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileOpen(false);
          hamburgerRef.current?.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [mobileOpen]);

    const closeMobilePanel = () => {
      setMobileOpen(false);
      hamburgerRef.current?.focus();
    };

    /* ── Rail inner content (shared by desktop aside + mobile panel) ── */

    const railContent = (
      <div className={styles.railInner}>
        {/* Wordmark home link */}
        <a href={homeHref} className={styles.brand} aria-label="Poukai — home">
          <Wordmark height={40} />
        </a>

        {/* Optional rail slot (workspace selector, environment badge, etc.) */}
        {rail !== undefined ? <div className={styles.railSlot}>{rail}</div> : null}

        {/* Nav — only rendered when routes exist */}
        {hasRoutes ? (
          <nav className={styles.nav} aria-label={navLabel}>
            <ul className={styles.navList}>
              {routes.map((route) => {
                const isActive = route.href === currentRoute;
                return (
                  <li key={route.href}>
                    <a
                      href={route.href}
                      className={styles.navLink}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {route.icon !== undefined ? (
                        <span className={styles.navIcon} aria-hidden="true">
                          {route.icon}
                        </span>
                      ) : null}
                      {route.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        {/* Footer slot — pinned to bottom via margin-top: auto */}
        {footer !== undefined ? <div className={styles.railFooter}>{footer}</div> : null}
      </div>
    );

    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        {/* ── Mobile top bar (hidden on desktop) ──────────────────── */}
        {/* Use <header> so the content is inside the `banner` landmark (axe region rule). */}
        <header className={styles.topBar}>
          <button
            ref={hamburgerRef}
            type="button"
            className={styles.hamburger}
            aria-expanded={mobileOpen}
            aria-controls="dashboardshell-rail-panel"
            aria-label={mobileMenuLabel}
            onClick={() => setMobileOpen(true)}
          >
            <HamburgerIcon />
          </button>

          <a href={homeHref} className={styles.brand} aria-label="Poukai — home">
            <Wordmark height={32} />
          </a>
        </header>

        {/* ── Backdrop (mobile, behind panel, in front of top bar via DOM order) */}
        {/* Rendered after top bar in DOM so same z-index: 100 wins by paint order */}
        <div
          className={styles.backdrop}
          data-state={mobileOpen ? "open" : "closed"}
          aria-hidden="true"
          tabIndex={-1}
          onClick={closeMobilePanel}
        />

        {/* ── Off-canvas rail panel (mobile) ──────────────────────── */}
        <aside
          ref={panelRef}
          id="dashboardshell-rail-panel"
          className={styles.railMobile}
          data-state={mobileOpen ? "open" : "closed"}
          aria-label={railLabel}
        >
          {/* Close button at top of panel — dedicated X button so the panel
              content (Wordmark, nav) does not overlap the mobile top bar hamburger */}
          <button
            type="button"
            className={styles.panelClose}
            aria-expanded={mobileOpen}
            aria-controls="dashboardshell-rail-panel"
            aria-label={mobileCloseLabel}
            onClick={closeMobilePanel}
          >
            <CloseIcon />
          </button>
          {railContent}
        </aside>

        {/* ── Desktop rail (sticky aside, hidden on mobile) ────────── */}
        <aside className={styles.rail} aria-label={railLabel}>
          {railContent}
        </aside>

        {/* ── Main content column ──────────────────────────────────── */}
        <main className={styles.main}>{children}</main>
      </div>
    );
  },
);

DashboardShell.displayName = "DashboardShell";
