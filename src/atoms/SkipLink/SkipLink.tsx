import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "./SkipLink.module.css";

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Fragment target for the skip link (e.g. "#main", "#content", "#docs-content").
   * Required — the DS does not compute or default this value; different layouts
   * use different IDs.
   */
  href: string;
  /**
   * Link label. Defaults to "Skip to content".
   * Override with a more specific label when the layout has multiple navigable
   * regions (e.g. "Skip to documentation").
   */
  children?: ReactNode;
  /** Merged with the internal CSS Module class via clsx. */
  className?: string;
}

/**
 * Keyboard skip-to-content anchor atom.
 *
 * Visually hidden at rest (canonical sr-only clip pattern). Becomes a
 * fixed-position high-contrast pill when it receives keyboard focus.
 *
 * Must be placed as the first focusable element in any layout shell — before
 * any nav, header, logo, or interactive chrome. The target element referenced
 * by `href` must exist in the DOM and carry the matching `id`.
 *
 * @example
 *   // Placed as first child of SiteShell
 *   <SkipLink href="#main" />
 *   <SkipLink href="#docs-content">Skip to documentation</SkipLink>
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href, children = "Skip to content", className, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={href} className={clsx(styles.root, className)} {...rest}>
      {children}
    </a>
  );
});

SkipLink.displayName = "SkipLink";
