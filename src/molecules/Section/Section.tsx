import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { Eyebrow } from "../../atoms/Eyebrow";
import styles from "./Section.module.css";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Root element. Controls landmark semantics.
   * - `"section"` (default) — region landmark when titled.
   * - `"article"` — independently distributable content.
   * - `"aside"` — tangential or supplementary content.
   * - `"div"` — no landmark (use when a landmark would be noise).
   */
  as?: "section" | "article" | "aside" | "div";
  /**
   * Eyebrow slot. String values are automatically wrapped in `<Eyebrow>`.
   * ReactNode values are rendered as-is — use this for custom Eyebrow configuration.
   */
  eyebrow?: string | ReactNode;
  /** Section heading content. Rendered as `titleAs` element (default `h2`). */
  title?: ReactNode;
  /**
   * Heading element to render the title as. Default `h2`.
   * Override with `h1` when Section is at the top of a page without a Hero;
   * override with `h3` for nested subdivision contexts.
   */
  titleAs?: "h1" | "h2" | "h3";
  /**
   * Supporting copy below the title. String values are wrapped in `<p className="lede">`.
   * ReactNode values are rendered as-is.
   */
  lede?: ReactNode;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` (64px) top + bottom. Editorial register.
   * - `"tight"` — `--space-12` (48px) top + bottom. Dense/utility surfaces.
   */
  size?: "default" | "tight";
}

/** Landmark `as` values — `aria-labelledby` is only meaningful for these. */
const LANDMARK_ELEMENTS = new Set(["section", "article", "aside"]);

/**
 * Canonical page-section wrapper. Owns the vertical rhythm around a section's
 * header block (eyebrow + title + lede) and exposes a children slot for body content.
 *
 * Every titled Section is a properly named landmark region via `aria-labelledby`.
 * Untitled Sections degrade gracefully to a generic container — pass `as="div"` or
 * `aria-label` via spread props when the landmark semantics would be noise.
 *
 * @example Standard section
 *   <Section eyebrow="01 · Approach" title="The rules we ship by." lede="Supporting copy.">
 *     <Principle ... />
 *   </Section>
 *
 * @example Custom Eyebrow (ReactNode form)
 *   <Section
 *     eyebrow={<Eyebrow numeral="01" variant="solid">Approach</Eyebrow>}
 *     title="The rules we ship by."
 *   />
 *
 * @example Polymorphic + tight
 *   <Section as="article" size="tight" title="Press mention">
 *     <p>Body content.</p>
 *   </Section>
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    as: As = "section",
    eyebrow,
    title,
    titleAs = "h2",
    lede,
    size = "default",
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  const hasHeader = Boolean(eyebrow !== undefined || title !== undefined || lede !== undefined);
  const isLandmark = LANDMARK_ELEMENTS.has(As);
  const labelledBy = isLandmark && title !== undefined ? titleId : undefined;

  const rootClassName = clsx(styles.root, size === "tight" && styles.sizeTight, className);

  const TitleTag = titleAs;

  const eyebrowNode =
    eyebrow === undefined ? null : typeof eyebrow === "string" ? (
      <Eyebrow>{eyebrow}</Eyebrow>
    ) : (
      eyebrow
    );

  const ledeNode =
    lede === undefined ? null : typeof lede === "string" ? (
      <p className={clsx(styles.lede, "lede")}>{lede}</p>
    ) : (
      lede
    );

  const header = hasHeader ? (
    <div className={styles.header}>
      {eyebrowNode !== null && <div className={styles.eyebrowSlot}>{eyebrowNode}</div>}
      {title !== undefined && (
        <TitleTag id={titleId} className={styles.title}>
          {title}
        </TitleTag>
      )}
      {ledeNode !== null && ledeNode}
    </div>
  ) : null;

  const bodyContent = (
    <>
      {header}
      {children !== undefined && (
        <div className={clsx(styles.body, hasHeader && styles.bodyWithHeader)}>{children}</div>
      )}
    </>
  );

  // Per-branch cast pattern from Statement/Eyebrow — satisfies TypeScript without
  // a single-branch cast while keeping identical runtime behaviour.
  if (As === "article") {
    return (
      <article
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"article">)}
      >
        {bodyContent}
      </article>
    );
  }

  if (As === "aside") {
    return (
      <aside
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        aria-labelledby={labelledBy}
        {...(rest as ComponentPropsWithoutRef<"aside">)}
      >
        {bodyContent}
      </aside>
    );
  }

  if (As === "div") {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={rootClassName}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        {bodyContent}
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
      {bodyContent}
    </section>
  );
});

Section.displayName = "Section";
