import { forwardRef } from "react";
import clsx from "clsx";
import { EmailLink } from "../../atoms/EmailLink";
import styles from "./Footer.module.css";

export interface FooterLink {
  href: string;
  label: string;
  /** When true, adds `target="_blank" rel="noopener noreferrer"`. */
  external?: boolean;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Root element. Default `"div"` — correct when Footer is slotted into
   * SiteShell's `footer` prop (SiteShell already emits the `<footer>` landmark).
   * Pass `"footer"` for standalone use on surfaces without SiteShell.
   * See spec §3 for the full double-`<footer>` rationale.
   */
  as?: "div" | "footer";
  /**
   * Copyright string. e.g. `"© Pouk AI INC 2026"`. Required. Consumer is
   * responsible for the year — the DS never auto-inserts `new Date()`.
   */
  copyright: string;
  /**
   * Email address passed to `<EmailLink variant="muted">`.
   * Footer owns no `mailto:` logic — that is EmailLink's contract.
   */
  email: string;
  /**
   * Visible label override for EmailLink. When omitted, defaults to the raw
   * email address as visible text (e.g. `hello@pouk.ai`).
   */
  emailLabel?: string;
  /**
   * Secondary nav links. Omit (or pass an empty array) to suppress the `<nav>`.
   * Each item: `{ href, label, external? }`. Order is the consumer's responsibility.
   */
  links?: FooterLink[];
  /**
   * `aria-label` for the secondary nav. Default `"Footer"`.
   * Override when the page uses a different naming convention.
   */
  linksLabel?: string;
}

/**
 * Canonical site-footer content block.
 *
 * Composes copyright + email + optional secondary link row. Does not own
 * the hairline rule or outer padding — SiteShell provides those. When used
 * standalone (`as="footer"`), Footer adds them itself to mirror SiteShell.
 *
 * @example
 *   // Inside SiteShell (default, as="div"):
 *   <SiteShell footer={<Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />}>
 *     {children}
 *   </SiteShell>
 *
 * @example
 *   // Standalone:
 *   <Footer
 *     as="footer"
 *     copyright="© Pouk AI INC 2026"
 *     email="hello@pouk.ai"
 *     links={[{ href: "/privacy", label: "Privacy" }]}
 *   />
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { as = "div", copyright, email, emailLabel, links, linksLabel = "Footer", className, ...rest },
  ref,
) {
  if (import.meta.env.DEV && copyright === "") {
    console.error("[Footer] `copyright` must not be an empty string.");
  }

  const Root = as;
  const isStandalone = as === "footer";
  const hasLinks = links !== undefined && links.length > 0;

  return (
    <Root
      ref={ref as React.Ref<HTMLDivElement>}
      className={clsx(styles.root, className)}
      data-standalone={isStandalone ? "true" : undefined}
      {...rest}
    >
      <div className={styles.layout}>
        {/* Left group: copyright · email */}
        <div className={styles.left}>
          <span className={styles.copyright}>{copyright}</span>
          <span aria-hidden="true" className={styles.separator}>
            &middot;
          </span>
          <EmailLink
            email={email}
            variant="muted"
            {...(emailLabel !== undefined ? { label: emailLabel } : undefined)}
          />
        </div>

        {/* Right group: optional secondary nav */}
        {hasLinks && (
          <nav className={styles.nav} aria-label={linksLabel}>
            <ul className={styles.navList}>
              {links!.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={clsx(styles.navLink, "muted-link")}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : undefined)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </Root>
  );
});

Footer.displayName = "Footer";
