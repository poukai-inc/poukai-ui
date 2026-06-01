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
import { DropdownMenu } from "../../atoms/DropdownMenu";
import styles from "./SiteShell.module.css";

/* ─── Route types ──────────────────────────────────────────────── */

export interface SiteShellRoute {
  /** Plain href — e.g. `"/why-ai"`. Optional: group labels have no href. */
  href?: string;
  /** Visible label. */
  label: ReactNode;
  /** Child routes — renders a dropdown on desktop, inline disclosure on mobile. One level deep only. */
  items?: SiteShellRoute[];
}

/* ─── Props ────────────────────────────────────────────────────── */

export interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The route currently being viewed — matched against `routes[i].href` to
   * apply the active style.
   */
  currentRoute?: string;
  /** Primary nav items. Omit (or pass an empty array) to render a chrome-less shell. */
  routes?: SiteShellRoute[];
  /**
   * Footer slot. Lives beneath a hairline rule, in the muted tone.
   */
  footer?: ReactNode;
  /** Override the home href used by the wordmark link. Defaults to `"/"`. */
  homeHref?: string;
  /** Accessible label for the primary nav. Defaults to `"Primary"`. */
  navLabel?: string;
  /**
   * Makes the header sticky (position: sticky; top: 0).
   * Adds a hairline border-bottom and reduces block padding to --space-4.
   * Default false — non-sticky preserves current marketing shell behavior exactly.
   */
  sticky?: boolean;
  /**
   * Slot for consumer-supplied controls at the right edge of the header.
   * SiteShell does not own auth state — the consumer decides what renders here.
   */
  end?: ReactNode;
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
  /** Page content. */
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

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable={false}
  >
    <polyline points="2,4 6,8 10,4" />
  </svg>
);

/* ─── Mobile disclosure item ───────────────────────────────────── */

interface MobileDisclosureProps {
  route: SiteShellRoute;
  currentRoute?: string | undefined;
  onLinkClick: () => void;
}

function MobileDisclosure({ route, currentRoute, onLinkClick }: MobileDisclosureProps) {
  const [open, setOpen] = useState(false);
  const items = route.items ?? [];

  return (
    <div className={styles.mobileDisclosure}>
      <button
        type="button"
        className={clsx(styles.mobileDisclosureToggle, "muted-link")}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {route.label}
        <span className={clsx(styles.chevron, open && styles.chevronOpen)}>
          <ChevronDownIcon />
        </span>
      </button>
      {open ? (
        <ul className={styles.mobileDisclosureList}>
          {items.map((child, idx) => {
            const isActive = child.href !== undefined && currentRoute === child.href;
            return (
              <li key={child.href ?? idx}>
                {child.href !== undefined ? (
                  <a
                    href={child.href}
                    className={clsx(
                      styles.mobileNavLink,
                      "muted-link",
                      isActive && styles.navLinkActive,
                    )}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onLinkClick}
                  >
                    {child.label}
                  </a>
                ) : (
                  <span className={clsx(styles.mobileNavLink, "muted-link")}>{child.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/* ─── SiteShell ────────────────────────────────────────────────── */

/**
 * Site chrome — sticky-capable top nav (wordmark + route labels + optional end slot),
 * main slot, hairline footer. Supports nested dropdown nav items (desktop) and
 * hamburger mobile panel (below --bp-md).
 *
 * **No router awareness.** The shell emits plain `<a href>`. Framework router consumers
 * handle link interception at the application level.
 *
 * **No auth logic.** Pass different `routes` and `end` for authenticated vs marketing usage.
 * SiteShell is purely compositional with respect to auth.
 *
 * @example Marketing shell (unchanged pattern)
 *   <SiteShell
 *     currentRoute="/why-ai"
 *     routes={[
 *       { href: "/why-ai", label: "Why AI" },
 *       { href: "/roles", label: "Roles" },
 *     ]}
 *     footer={<p>© Pouk AI INC 2026</p>}
 *   >
 *     {pageContent}
 *   </SiteShell>
 *
 * @example App shell (sticky, end slot, nested items)
 *   <SiteShell
 *     sticky
 *     currentRoute="/dashboard"
 *     routes={[
 *       { href: "/dashboard", label: "Dashboard" },
 *       { label: "More", items: [{ href: "/settings", label: "Settings" }] },
 *     ]}
 *     end={<Avatar name="Arian" />}
 *   >
 *     {appContent}
 *   </SiteShell>
 */
export const SiteShell = forwardRef<HTMLDivElement, SiteShellProps>(function SiteShell(
  {
    currentRoute,
    routes = [],
    footer,
    homeHref = "/",
    navLabel = "Primary",
    sticky = false,
    end,
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
  const panelRef = useRef<HTMLDivElement>(null);
  const hasRoutes = routes.length > 0;

  // Focus management: move focus into panel on open, return to hamburger on close
  useEffect(() => {
    if (mobileOpen) {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      firstFocusable?.focus();
    } else {
      // Only return focus if panel was open before (avoid focus steal on initial render)
      // We use a ref so this only fires on transition from open→closed, not on mount
    }
  }, [mobileOpen]);

  // Close on Escape
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

  return (
    <div ref={ref} className={clsx(styles.root, sticky && styles.rootSticky, className)} {...rest}>
      <header className={clsx(styles.header, sticky && styles.headerSticky)}>
        <a href={homeHref} className={styles.brand} aria-label="Poukai — home">
          <Wordmark height={56} />
        </a>

        {/* Desktop nav — hidden below --bp-md */}
        {hasRoutes ? (
          <nav className={styles.nav} aria-label={navLabel}>
            <ul className={styles.navList}>
              {routes.map((route, idx) => {
                if (route.items && route.items.length > 0) {
                  // Dropdown item
                  return (
                    <li key={route.href ?? `group-${idx}`}>
                      <DropdownMenu.Root modal={false}>
                        <DropdownMenu.Trigger asChild>
                          <button
                            type="button"
                            className={clsx(
                              styles.navLink,
                              styles.navDropdownTrigger,
                              "muted-link",
                            )}
                          >
                            {route.label}
                            <span className={styles.chevron}>
                              <ChevronDownIcon />
                            </span>
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="start">
                          {route.items.map((child, childIdx) => (
                            <DropdownMenu.Item
                              key={child.href ?? `child-${childIdx}`}
                              onSelect={() => {
                                if (child.href) {
                                  window.location.href = child.href;
                                }
                              }}
                            >
                              {child.label}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </li>
                  );
                }

                // Flat link item
                const isActive = route.href !== undefined && currentRoute === route.href;
                return (
                  <li key={route.href ?? `flat-${idx}`}>
                    <a
                      href={route.href}
                      className={clsx(
                        styles.navLink,
                        "muted-link",
                        isActive && styles.navLinkActive,
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {route.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        {/* End slot — desktop only; also appears in mobile panel */}
        {end !== undefined ? <div className={styles.end}>{end}</div> : null}

        {/* Hamburger — shown only below --bp-md when routes exist */}
        {hasRoutes ? (
          <button
            ref={hamburgerRef}
            type="button"
            className={styles.hamburger}
            aria-expanded={mobileOpen}
            aria-controls="siteshell-mobile-panel"
            aria-label={mobileOpen ? mobileCloseLabel : mobileMenuLabel}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        ) : null}
      </header>

      {/* Mobile panel */}
      {hasRoutes ? (
        <div
          ref={panelRef}
          id="siteshell-mobile-panel"
          className={clsx(styles.mobilePanel, mobileOpen && styles.mobilePanelOpen)}
          aria-hidden={!mobileOpen}
        >
          {/* Wrap in <nav> so panel contents are inside a landmark (axe region rule) */}
          <nav aria-label={navLabel}>
            <ul className={styles.mobilePanelList}>
              {routes.map((route, idx) => {
                if (route.items && route.items.length > 0) {
                  return (
                    <li key={route.href ?? `mobile-group-${idx}`}>
                      <MobileDisclosure
                        route={route}
                        currentRoute={currentRoute}
                        onLinkClick={closeMobilePanel}
                      />
                    </li>
                  );
                }

                const isActive = route.href !== undefined && currentRoute === route.href;
                return (
                  <li key={route.href ?? `mobile-flat-${idx}`}>
                    <a
                      href={route.href}
                      className={clsx(
                        styles.mobileNavLink,
                        "muted-link",
                        isActive && styles.navLinkActive,
                      )}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeMobilePanel}
                    >
                      {route.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {end !== undefined ? (
            <>
              <div className={styles.mobilePanelEndSep} aria-hidden="true" />
              <div className={styles.mobilePanelEnd}>{end}</div>
            </>
          ) : null}
        </div>
      ) : null}

      <main className={styles.main}>{children}</main>

      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </div>
  );
});

SiteShell.displayName = "SiteShell";
