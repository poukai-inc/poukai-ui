import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Section } from "../../molecules/Section";
import { Stepper, type StepDef } from "../../molecules/Stepper";
import styles from "./StepsSection.module.css";

export interface StepsSectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * Section heading. Rendered as an `<h2>` by the Section molecule.
   * Required — establishes the landmark label for the `<section>` region.
   */
  heading: string;
  /**
   * Optional eyebrow above the heading.
   * String values are auto-wrapped in `<Eyebrow>` by Section.
   * Pass a ReactNode for custom Eyebrow configuration.
   */
  eyebrow?: string | ReactNode;
  /**
   * Optional supporting copy below the heading.
   * String values are auto-wrapped in `<p className="lede">` by Section.
   */
  lede?: string | ReactNode;
  /**
   * Ordered step definitions forwarded to `Stepper`.
   * Each step carries a `label` and an optional `body` description string
   * for the marketing / process-explainer context.
   * Required — at least one step must be provided.
   */
  steps: StepDef[];
  /**
   * Block padding variant forwarded to `Section`.
   * - `"default"` (default) — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom. Use when embedded in a denser page.
   */
  size?: "default" | "tight";
}

/**
 * Marketing / editorial process-explainer organism.
 *
 * Frames a `Stepper` molecule inside a `Section` wrapper. The canonical
 * "how it works" three-step pattern. No step is active in this context —
 * the Stepper renders with `current={-1}` and `orientation="vertical"` so
 * each step's body description reads clearly at all viewport widths.
 *
 * This organism is a **static process explainer**, not a progress indicator.
 * For live step-tracking (step 2 of 4), use `Stepper` directly with a
 * meaningful `current` value.
 *
 * @example Standard "How it works" section
 *   <StepsSection
 *     eyebrow="01 · Process"
 *     heading="How it works"
 *     lede="Three steps from first conversation to shipped product."
 *     steps={[
 *       { label: "Share context", body: "Tell us where you are and where you want to go." },
 *       { label: "We map the gap", body: "Arian diagnoses the delta between current and target." },
 *       { label: "Ship together", body: "Embedded pair programming until the loop is closed." },
 *     ]}
 *   />
 *
 * @example Tight variant (inside a denser page)
 *   <StepsSection
 *     heading="Our process"
 *     steps={[{ label: "Discover" }, { label: "Design" }, { label: "Deliver" }]}
 *     size="tight"
 *   />
 */
export const StepsSection = forwardRef<HTMLElement, StepsSectionProps>(function StepsSection(
  { heading, eyebrow, lede, steps, size = "default", className, ...rest },
  ref,
) {
  return (
    <Section
      ref={ref}
      eyebrow={eyebrow}
      title={heading}
      lede={lede}
      size={size}
      className={className}
      {...rest}
    >
      <Stepper steps={steps} current={-1} orientation="vertical" className={styles.stepper} />
    </Section>
  );
});

StepsSection.displayName = "StepsSection";
