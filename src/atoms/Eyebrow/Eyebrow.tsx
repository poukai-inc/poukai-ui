import { forwardRef, type ComponentPropsWithoutRef, type Ref } from "react";
import clsx from "clsx";
import styles from "./Eyebrow.module.css";

export type EyebrowVariant = "muted" | "solid" | "numbered";

export interface EyebrowProps extends Omit<ComponentPropsWithoutRef<"span">, "as"> {
  /**
   * Color + structural variant.
   * - `muted` (default) — `--fg-muted`; standard section/category label register.
   * - `solid` — `--fg`; full-contrast when the label needs more weight.
   * - `numbered` — `--fg-muted` + activates the inline numeral slot; requires `numeral`.
   */
  variant?: EyebrowVariant;
  /**
   * Leading index string rendered before the text content with `--space-2` gap.
   * Activating `variant="numbered"` is recommended when using this prop.
   * e.g. `"01"`, `"FM-03"`, `"01 ·"`
   */
  numeral?: string;
  /**
   * Root element. Defaults to `<span>`.
   * Common overrides: `"p"`, `"div"`, `"dt"`, `"h2"`, `"h3"`.
   */
  as?: "span" | "p" | "div" | "dt" | "h2" | "h3" | "h4" | "h5" | "h6" | "li";
}

const variantClass: Record<EyebrowVariant, string> = {
  muted: styles.variantMuted!,
  solid: styles.variantSolid!,
  numbered: styles.variantMuted!, // numbered is structurally distinct but same color as muted
};

/**
 * Canonical micro-label atom — uppercase, tracked, sans-serif.
 *
 * Resolves the three independent eyebrow patterns in `RoleCard`, `FailureMode`,
 * and the global `.micro` utility into one shape: `--tracking-eyebrow: 0.06em`,
 * `--fs-meta: 14px`, `--font-sans`.
 *
 * @example
 *   <Eyebrow>Role 01</Eyebrow>
 *   <Eyebrow variant="solid">Engineering</Eyebrow>
 *   <Eyebrow variant="numbered" numeral="01 ·">Principle</Eyebrow>
 *   <Eyebrow as="h2">Section Label</Eyebrow>
 */
export const Eyebrow = forwardRef<HTMLElement, EyebrowProps>(function Eyebrow(
  { variant = "muted", numeral, as: As = "span", className, children, ...rest },
  ref,
) {
  const hasNumeral = numeral !== undefined && numeral !== "";
  const rootClassName = clsx(
    styles.root,
    variantClass[variant],
    hasNumeral && styles.withNumeral,
    className,
  );

  const content = (
    <>
      {hasNumeral && <span className={styles.numeral}>{numeral}</span>}
      <span className={styles.text}>{children}</span>
    </>
  );

  // Each branch casts the ref to the concrete element type so TypeScript is
  // satisfied without a single-branch cast. The runtime behaviour is identical.
  switch (As) {
    case "p":
      return (
        <p
          ref={ref as Ref<HTMLParagraphElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"p">)}
        >
          {content}
        </p>
      );
    case "div":
      return (
        <div
          ref={ref as Ref<HTMLDivElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"div">)}
        >
          {content}
        </div>
      );
    case "dt":
      return (
        <dt
          ref={ref as Ref<HTMLElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"dt">)}
        >
          {content}
        </dt>
      );
    case "h2":
      return (
        <h2
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h2">)}
        >
          {content}
        </h2>
      );
    case "h3":
      return (
        <h3
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h3">)}
        >
          {content}
        </h3>
      );
    case "h4":
      return (
        <h4
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h4">)}
        >
          {content}
        </h4>
      );
    case "h5":
      return (
        <h5
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h5">)}
        >
          {content}
        </h5>
      );
    case "h6":
      return (
        <h6
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h6">)}
        >
          {content}
        </h6>
      );
    case "li":
      return (
        <li
          ref={ref as Ref<HTMLLIElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"li">)}
        >
          {content}
        </li>
      );
    default:
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"span">)}
        >
          {content}
        </span>
      );
  }
});

Eyebrow.displayName = "Eyebrow";
