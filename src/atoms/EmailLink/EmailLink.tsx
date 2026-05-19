import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./EmailLink.module.css";

export type EmailLinkVariant = "default" | "muted";

export interface EmailLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  /**
   * The email address. Computes `href="mailto:${email}"` — consumers never
   * construct or pass `href` directly. The atom owns the `mailto:` protocol.
   */
  email: string;
  /**
   * Visible link text. Defaults to the `email` string when omitted.
   * When provided and different from `email`, the label is the accessible name
   * and the email is the href target only.
   */
  label?: string;
  /**
   * Optional leading icon (ReactNode). When present the root shifts to
   * `inline-flex` for optical icon–text alignment. When absent the root is
   * a plain inline anchor.
   *
   * Pass decorative icons with `aria-hidden="true"`:
   * @example
   *   icon={<Mail size={14} aria-hidden="true" />}
   */
  icon?: React.ReactNode;
  /**
   * Optional trailing role qualifier rendered as ` (qualifier)` in a muted
   * `<span>` inside the anchor. Pass the bare name/role without parentheses —
   * the component wraps it.
   * @example
   *   qualifier="Arian"  → renders "founder@pouk.ai (Arian)"
   */
  qualifier?: string;
  /**
   * Color register.
   * - `default` (default) — `--fg` → `--accent` on hover. Full-contrast CTA contexts.
   * - `muted` — `--fg-muted` → `--fg` on hover. Footer, caption, metadata contexts.
   */
  variant?: EmailLinkVariant;
}

/**
 * Canonical `mailto:` affordance atom.
 *
 * `href` is always computed as `mailto:${email}` — consumers pass the address
 * string, never a raw href. This prevents the `href="email@domain.com"` class
 * of bug and makes the atom's register contract explicit: this is a contact
 * link, not a navigation link.
 *
 * @example
 *   <EmailLink email="hello@pouk.ai" />
 *   <EmailLink email="hello@pouk.ai" icon={<Mail size={14} aria-hidden="true" />} />
 *   <EmailLink email="founder@pouk.ai" qualifier="Arian" />
 *   <EmailLink email="hello@pouk.ai" variant="muted" />
 */
export const EmailLink = forwardRef<HTMLAnchorElement, EmailLinkProps>(function EmailLink(
  { email, label, icon, qualifier, variant = "default", className, children: _children, ...rest },
  ref,
) {
  const visibleLabel = label ?? email;
  const hasIcon = icon !== undefined && icon !== null;

  return (
    <a
      ref={ref}
      href={`mailto:${email}`}
      className={clsx(
        styles.root,
        variant === "muted" && styles.muted,
        hasIcon && styles.withIcon,
        className,
      )}
      {...rest}
    >
      {hasIcon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{visibleLabel}</span>
      {qualifier !== undefined && qualifier !== "" && (
        <span className={styles.qualifier}>&nbsp;({qualifier})</span>
      )}
    </a>
  );
});

EmailLink.displayName = "EmailLink";
