import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { CtaBlock } from "../../molecules/CtaBlock";
import styles from "./CTASection.module.css";

export type CTASectionSurface = "default" | "recessed";
export type CTASectionSize = "default" | "tight";
export type CTASectionAlign = "center" | "start";
export type CTASectionHeadingAs = "h2" | "h3";

export interface CTASectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Root element. Controls landmark semantics.
   * - `"section"` (default) — region landmark, named by the heading.
   * - `"div"` — no landmark semantics (avoid unless nesting inside an existing landmark).
   */
  as?: "section" | "div";
  /**
   * The conversion headline. Required.
   * Keep to ~60 characters — the centered h2 reads well as a short declarative phrase.
   */
  heading: string;
  /**
   * Semantic heading level. Default `"h2"` — correct when CTASection sits below a Hero h1.
   * Override to `"h3"` for editorial surfaces where a section h2 owns the heading hierarchy.
   */
  headingAs?: CTASectionHeadingAs;
  /**
   * Supporting copy below the heading. Optional.
   */
  body?: ReactNode;
  /**
   * Required actions slot. One or two `<Button>` instances.
   * DS does not prescribe Button variant — consumer chooses.
   */
  actions: ReactNode;
  /**
   * Surface variant.
   * - `"default"` — page `--bg`, no background override.
   * - `"recessed"` — `--surface-section` band with hairline rule on top.
   */
  surface?: CTASectionSurface;
  /**
   * Block padding variant. Maps to Section size conventions.
   * - `"default"` — `--space-16` top + bottom.
   * - `"tight"` — `--space-12` top + bottom.
   */
  size?: CTASectionSize;
  /**
   * Content alignment.
   * - `"center"` (default) — bilateral symmetry; the brand-correct default for end-of-page CTA.
   * - `"start"` — left-aligned; for editorial surfaces wanting left-aligned rhythm continuity.
   */
  align?: CTASectionAlign;
}

/**
 * CTASection — full-width end-of-page conversion organism.
 *
 * Wraps a `CtaBlock` molecule in a landmark `<section>` with optional bleed-band
 * surface, creating the page-closing conversion moment. Distinct from inline
 * `CtaBlock` use: this organism owns the Section framing, the bleed-band surface,
 * and the centered layout mode that signals "this is the conclusion."
 *
 * Use on marketing pages (landing, features, pricing) and blog/article footers.
 * Do NOT use CTASection mid-page — for inline conversion prompts, use `CtaBlock`
 * directly inside a `Section`.
 *
 * @example Default
 *   <CTASection
 *     heading="Ready to start?"
 *     body="Spin up your first project in minutes."
 *     actions={<Button>Get a demo</Button>}
 *   />
 *
 * @example Recessed surface (end of page)
 *   <CTASection
 *     surface="recessed"
 *     heading="Ready to start?"
 *     actions={<Button>Get a demo</Button>}
 *   />
 */
export const CTASection = forwardRef<HTMLElement, CTASectionProps>(function CTASection(
  {
    as: As = "section",
    heading,
    headingAs = "h2",
    body,
    actions,
    surface = "default",
    size = "default",
    align = "center",
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  const rootClassName = clsx(
    styles.root,
    surface === "recessed" && styles.surfaceRecessed,
    size === "tight" && styles.sizeTight,
    className,
  );

  const ctaBlock = (
    <CtaBlock
      heading={heading}
      headingAs={headingAs}
      body={body}
      actions={actions}
      orientation="stacked"
      align={align}
      id={titleId}
    />
  );

  const inner = <div className={styles.inner}>{ctaBlock}</div>;

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
      aria-labelledby={titleId}
      {...(rest as ComponentPropsWithoutRef<"section">)}
    >
      {inner}
    </section>
  );
});

CTASection.displayName = "CTASection";
