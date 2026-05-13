import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Wordmark } from "../../atoms/Wordmark";
import styles from "./SiteShell.module.css";

export interface SiteShellRoute {
  /** Plain href — e.g. `"/why-ai"`. The shell emits a plain `<a>`. */
  href: string;
  /** Visible label. */
  label: ReactNode;
}

export interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The route currently being viewed — matched against `routes[i].href` to
   * apply the active style. Optional; the shell is happy as a plain chrome.
   */
  currentRoute?: string;
  /** Primary nav items. Omit (or pass an empty array) to render a chrome-less hero shell. */
  routes?: SiteShellRoute[];
  /**
   * Footer slot. Lives beneath a hairline rule, in the muted tone. Typically
   * a `<p>` with a copyright line and a few muted links. The shell stays
   * agnostic about contents.
   */
  footer?: ReactNode;
  /** Override the home href used by the wordmark link. Defaults to `"/"`. */
  homeHref?: string;
  /** Accessible label for the primary nav. Defaults to `"Primary"`. */
  navLabel?: string;
  /** Page content. */
  children: ReactNode;
}

/**
 * Site chrome — top nav (wordmark + route labels), main slot, hairline footer.
 *
 * **No router awareness.** The shell emits plain `<a href>`. Consumers using
 * a framework router (Next, Astro, Remix) pass their own anchor component via
 * a parent that swaps `<a>` for `<Link>` if required. This keeps the DS
 * framework-agnostic.
 *
 * @example
 *   <SiteShell
 *     currentRoute="/why-ai"
 *     routes={[
 *       { href: "/why-ai", label: "Why AI" },
 *       { href: "/roles", label: "Roles" },
 *       { href: "/principles", label: "Principles" },
 *     ]}
 *     footer={<p>© Pouk AI INC 2026 · <a href="mailto:hello@pouk.ai">hello@pouk.ai</a></p>}
 *   >
 *     {pageContent}
 *   </SiteShell>
 */
export const SiteShell = forwardRef<HTMLDivElement, SiteShellProps>(function SiteShell(
  {
    currentRoute,
    routes = [],
    footer,
    homeHref = "/",
    navLabel = "Primary",
    children,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      <header className={styles.header}>
        <a href={homeHref} className={styles.brand} aria-label="Poukai — home">
          <Wordmark height={28} />
        </a>
        {routes.length > 0 ? (
          <nav className={styles.nav} aria-label={navLabel}>
            <ul className={styles.navList}>
              {routes.map((r) => {
                const isActive = currentRoute === r.href;
                return (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      className={clsx(
                        styles.navLink,
                        "muted-link",
                        isActive && styles.navLinkActive,
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {r.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>

      <main className={styles.main}>{children}</main>

      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </div>
  );
});
