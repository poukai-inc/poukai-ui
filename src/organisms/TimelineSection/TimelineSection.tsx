import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./TimelineSection.module.css";

export interface TimelineSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Eyebrow slot. Delegated to Section's eyebrow prop.
   * String values are automatically wrapped in `<Eyebrow>` by Section.
   */
  eyebrow?: string | ReactNode;
  /**
   * Section heading. Delegated to Section's title prop.
   * Rendered as the element specified by `headingAs` (default `h2`).
   */
  heading?: ReactNode;
  /**
   * Semantic heading level for the heading. Defaults to `"h2"`.
   * Override with `"h1"` when no Hero precedes this section;
   * `"h3"` for subdivisions.
   */
  headingAs?: "h1" | "h2" | "h3";
  /**
   * Supporting copy below the heading. Delegated to Section's lede prop.
   */
  lede?: ReactNode;
  /**
   * Block padding variant. Delegated to Section's size prop.
   * - `"default"` — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom.
   */
  size?: "default" | "tight";
  /**
   * One or more `TimelineItem` elements. Rendered inside the `<ol>` track.
   * Required — a lone item is a `TimelineItem` in a `Section`, not a `TimelineSection`.
   */
  children: ReactNode;
  /**
   * When `true`, renders the list with the HTML `<ol reversed>` attribute —
   * newest-first display without changing source order. Consumers pass items
   * oldest-first; `reversed` flips display. Screen readers receive the correct
   * reversed numbering via the native attribute.
   */
  reversed?: boolean;
}

/**
 * `TimelineSection` — Section-framed vertical list of `TimelineItem` molecules.
 *
 * Provides the `Section` header (eyebrow, heading, lede) and the `<ol>` track
 * that supplies left-rail rhythm for changelog, company-milestone, and
 * process-explainer surfaces.
 *
 * Static organism — no interactive states. Tab order follows natural DOM sequence
 * through any interactive children inside `TimelineItem` bodies.
 *
 * @example Default — "Our story" milestones
 *   <TimelineSection
 *     eyebrow="History"
 *     heading="Our story"
 *     lede="From side project to production-grade consulting practice."
 *   >
 *     <TimelineItem date="2024-01" title="Side project begins" connector />
 *     <TimelineItem date="2024-09" title="First client" connector />
 *     <TimelineItem date="2025-03" title="Poukai Inc. incorporated" connector={false} />
 *   </TimelineSection>
 *
 * @example Reversed (newest-first)
 *   <TimelineSection heading="Changelog" reversed>
 *     <TimelineItem date="2024-01" title="v1 launch" connector />
 *     <TimelineItem date="2025-06" title="v2 launch" connector={false} />
 *   </TimelineSection>
 */
export const TimelineSection = forwardRef<HTMLElement, TimelineSectionProps>(
  function TimelineSection(
    {
      eyebrow,
      heading,
      headingAs = "h2",
      lede,
      size = "default",
      children,
      reversed = false,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Section
        ref={ref as Ref<HTMLElement>}
        eyebrow={eyebrow}
        title={heading}
        titleAs={headingAs}
        lede={lede}
        size={size}
        className={clsx(styles.root, className)}
        {...(rest as ComponentPropsWithoutRef<"section">)}
      >
        <ol className={styles.track} reversed={reversed || undefined}>
          {children}
        </ol>
      </Section>
    );
  },
);

TimelineSection.displayName = "TimelineSection";
