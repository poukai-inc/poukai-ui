import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./NavLink.module.css";

export interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Destination URL. Required — a nav link without an href is not a link. */
  href: string;
  /**
   * Drives `aria-current="page"` and the active bottom-border indicator.
   * Consumer computes this from routing context (e.g. pathname.startsWith(href)).
   * Defaults to false.
   */
  active?: boolean;
  /** The visible label. Short plain string is idiomatic. */
  children: ReactNode;
}

/**
 * NavLink — top-nav anchor with active state.
 *
 * Renders a semantic `<a>` styled for primary navigation chrome.
 * At rest the label is `--fg-muted`; on hover it shifts to `--fg` with an
 * accent underline growing via background-size transition (matches the global
 * `<a>` mechanic in tokens.css). When `active` is true, `aria-current="page"`
 * is set and a 2px `--accent` border-bottom is always visible.
 *
 * NavLink does not own the `<nav>` landmark — the parent organism wraps the
 * NavLink set in `<nav aria-label="Primary">`.
 *
 * @example
 *   <NavLink href="/about">About</NavLink>
 *   <NavLink href="/work" active>Work</NavLink>
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { href, active = false, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(styles.root, active && styles.active, className)}
      {...rest}
    >
      {children}
    </a>
  );
});

NavLink.displayName = "NavLink";
