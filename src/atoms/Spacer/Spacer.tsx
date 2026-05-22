import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Spacer.module.css";

export type SpacerSize = "1" | "2" | "3" | "4" | "6" | "8" | "10";
export type SpacerAxis = "block" | "inline";
export type SpacerAs = "div" | "span";

export interface SpacerProps {
  /**
   * Required. Spacing amount resolved to a DS space token.
   * Closed union — only atom-tier steps. Layout-tier values (12, 16, 24, 32)
   * are intentionally excluded; those decisions belong to the template layer.
   */
  size: SpacerSize;

  /**
   * Layout axis.
   * - `"block"` (default): `height = var(--space-N)`, `width = 100%`.
   * - `"inline"`: `width = var(--space-N)`, `display = inline-block`, `height = 1em`.
   */
  axis?: SpacerAxis;

  /**
   * Root element override.
   * - `"div"` (default): block-level element. Correct for `axis="block"`.
   * - `"span"`: inline element. Correct for `axis="inline"` inside Prose or inline flow.
   *
   * Closed union — no other elements permitted.
   */
  as?: SpacerAs;

  /** Additional CSS class merged with the size+axis class. */
  className?: string;
}

type DivProps = SpacerProps & Omit<ComponentPropsWithoutRef<"div">, "aria-hidden"> & { as?: "div" };
type SpanProps = SpacerProps &
  Omit<ComponentPropsWithoutRef<"span">, "aria-hidden"> & { as: "span" };

const SIZE_AXIS_CLASS = {
  "1": { block: styles.size1Block, inline: styles.size1Inline },
  "2": { block: styles.size2Block, inline: styles.size2Inline },
  "3": { block: styles.size3Block, inline: styles.size3Inline },
  "4": { block: styles.size4Block, inline: styles.size4Inline },
  "6": { block: styles.size6Block, inline: styles.size6Inline },
  "8": { block: styles.size8Block, inline: styles.size8Inline },
  "10": { block: styles.size10Block, inline: styles.size10Inline },
} as Record<SpacerSize, Record<SpacerAxis, string>>;

/**
 * `<Spacer>` — explicit-gap atom for contexts where flex/grid `gap` cannot reach.
 *
 * Renders an invisible, `aria-hidden` element whose sole dimension is a single
 * spacing token. No background, no border, no content. Not a general-purpose
 * spacing utility — use `gap` or padding tokens in flex/grid layouts.
 *
 * Canonical use: inside `<Prose>` long-form HTML flow, or between conditionally
 * rendered siblings where a stable spacer slot is needed.
 *
 * @example Block spacer between Prose segments
 *   <Spacer size="8" />
 *
 * @example Inline spacer between inline clusters
 *   <Spacer as="span" axis="inline" size="3" />
 *
 * @example Conditional sibling with stable spacer
 *   {showCallout && (
 *     <>
 *       <Spacer size="4" />
 *       <Callout>…</Callout>
 *     </>
 *   )}
 */
export const Spacer = forwardRef<HTMLDivElement | HTMLSpanElement, DivProps | SpanProps>(
  function Spacer(
    {
      size,
      axis = "block",
      as = "div",
      className,
      // aria-hidden is unconditionally applied by this component; omitted from prop types.
      ...rest
    },
    ref,
  ) {
    if (process.env.NODE_ENV !== "production") {
      // Dev-mode warnings per spec §16.5
      const children = (rest as { children?: unknown }).children;
      if (children !== undefined && children !== null) {
        console.warn(
          "[Spacer] Children were passed to <Spacer>. Spacer has no content slot — " +
            "any children will be hidden from the accessibility tree via aria-hidden.",
        );
      }
      if (as === "div" && axis === "inline") {
        console.warn(
          '[Spacer] as="div" + axis="inline" produces a block-in-inline context. ' +
            'Use as="span" for inline flow.',
        );
      }
    }

    const sizeAxisClass = SIZE_AXIS_CLASS[size][axis];
    const rootClass = clsx(sizeAxisClass, className);

    if (as === "span") {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          aria-hidden="true"
          className={rootClass}
          {...(rest as ComponentPropsWithoutRef<"span">)}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        aria-hidden="true"
        className={rootClass}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      />
    );
  },
);

Spacer.displayName = "Spacer";
