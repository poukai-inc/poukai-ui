import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type ComponentPropsWithoutRef,
} from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import { EmailLink } from "../../atoms/EmailLink";
import styles from "./ContactBlock.module.css";

export interface ContactBlockProps extends HTMLAttributes<HTMLElement> {
  /**
   * The contact email address. Passed to `<EmailLink>` which computes
   * `href="mailto:${email}"`. Required.
   */
  email: string;
  /**
   * Optional visible label for the EmailLink (e.g. `"Say hello"`).
   * When absent the raw email address renders as the link text.
   */
  emailLabel?: string;
  /**
   * Optional short heading above the email (e.g. `"Get in touch"`).
   * Renders at `--fs-h2` in Instrument Serif when provided.
   * When present, the section is labelled via `aria-labelledby`.
   */
  heading?: string;
  /**
   * `StatusBadge` slot. Renders above the EmailLink when present.
   * When absent the status row is omitted entirely.
   */
  status?: ReactNode;
  /**
   * CTA Button(s). Renders below the EmailLink when present.
   * When absent the actions row is omitted.
   */
  actions?: ReactNode;
  /**
   * Root element. Passed to the underlying `Section`.
   * Default `"section"`.
   */
  as?: "section" | "article" | "div";
}

/**
 * End-of-page contact organism.
 *
 * Composes `Section` + `EmailLink` + optional `StatusBadge` slot + optional
 * CTA actions slot into a centered, editorial contact moment.
 *
 * @example Minimal
 *   <ContactBlock email="hello@pouk.ai" />
 *
 * @example Full composition
 *   <ContactBlock
 *     heading="Get in touch"
 *     email="hello@pouk.ai"
 *     emailLabel="Say hello"
 *     status={<StatusBadge status="available">Open for projects.</StatusBadge>}
 *     actions={<Button asChild><a href="/book">Book a call</a></Button>}
 *   />
 */
export const ContactBlock = forwardRef<HTMLElement, ContactBlockProps>(function ContactBlock(
  { email, emailLabel, heading, status, actions, as: As = "section", className, ...rest },
  ref,
) {
  const generatedId = useId();
  const headingId = `${generatedId}-heading`;

  // Only wire aria-labelledby when heading is present and element is a landmark.
  const isLandmark = As === "section" || As === "article";
  const labelledBy = isLandmark && heading !== undefined ? headingId : undefined;

  const inner = (
    <div className={styles.inner}>
      {status !== undefined && <div className={styles.statusRow}>{status}</div>}
      {heading !== undefined && (
        <h2 id={headingId} className={styles.heading}>
          {heading}
        </h2>
      )}
      <EmailLink
        email={email}
        {...(emailLabel !== undefined && { label: emailLabel })}
        className={styles.emailLink}
      />
      {actions !== undefined && <div className={styles.actionsRow}>{actions}</div>}
    </div>
  );

  const rootClassName = clsx(styles.root, className);

  if (As === "article") {
    return (
      <article
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"article">)}
      >
        {inner}
      </article>
    );
  }

  if (As === "div") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        {inner}
      </div>
    );
  }

  // Default: "section"
  return (
    <section
      ref={ref as Ref<HTMLElement>}
      className={rootClassName}
      aria-labelledby={labelledBy}
      {...(rest as ComponentPropsWithoutRef<"section">)}
    >
      {inner}
    </section>
  );
});

ContactBlock.displayName = "ContactBlock";

// Re-export Section for consumers who want to wrap ContactBlock
export { Section };
