import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./NewsletterSection.module.css";

export interface NewsletterSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Root element. Controls landmark semantics.
   * - `"section"` (default) — region landmark named by the heading.
   * - `"article"` — independently distributable content.
   * - `"div"` — no landmark semantics.
   */
  as?: "section" | "article" | "div";
  /**
   * Required. The subscription moment's primary label — the h2 text.
   * e.g. "Get monthly updates".
   */
  heading: string;
  /**
   * Optional supporting copy. String auto-wrapped in a lede paragraph.
   * One sentence maximum in the brand register.
   */
  body?: string | ReactNode;
  /**
   * Optional eyebrow slot. Passed through to Section.
   * Rarely needed; available for editorial pages using eyebrow numeral rhythm.
   */
  eyebrow?: string | ReactNode;
  /**
   * Required. A `<NewsletterField>` instance. NewsletterSection does not proxy
   * NewsletterField props — keep concerns separated.
   */
  field: ReactNode;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom.
   * @default "default"
   */
  size?: "default" | "tight";
  /**
   * When `true`, applies `background: var(--surface-section)` to the root.
   * @default false
   */
  surface?: boolean;
  /**
   * Heading level for the section title.
   * Use `"h3"` when nested below an existing `h2` surface.
   * @default "h2"
   */
  titleAs?: "h2" | "h3";
}

/**
 * Section-framed email signup surface for pouk.ai editorial and marketing pages.
 *
 * Frames a `NewsletterField` molecule with a heading and optional supporting body
 * copy, producing the canonical "end-of-post / footer signup" moment.
 *
 * The `<section>` root is a region landmark named via `aria-labelledby` pointing
 * at the heading (wired automatically by the `Section` molecule).
 *
 * @example Default
 *   <NewsletterSection
 *     heading="Get monthly updates"
 *     body="One email a month. No spam."
 *     field={<NewsletterField action="/api/subscribe" />}
 *   />
 *
 * @example Footer signup with tight spacing
 *   <NewsletterSection
 *     heading="Stay in the loop"
 *     size="tight"
 *     field={<NewsletterField action="/api/subscribe" size="compact" />}
 *   />
 */
export const NewsletterSection = forwardRef<HTMLElement, NewsletterSectionProps>(
  function NewsletterSection(
    {
      as = "section",
      heading,
      body,
      eyebrow,
      field,
      size = "default",
      surface = false,
      titleAs = "h2",
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Section
        ref={ref}
        as={as}
        title={heading}
        titleAs={titleAs}
        lede={body}
        eyebrow={eyebrow}
        size={size}
        className={clsx(surface && styles.surface, className)}
        {...rest}
      >
        {field}
      </Section>
    );
  },
);

NewsletterSection.displayName = "NewsletterSection";
