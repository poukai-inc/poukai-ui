import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerTone = "default" | "muted";

export interface DividerProps {
  /**
   * Orientation of the separator rule.
   * - `"horizontal"` (default): full-width top-border rule. Root defaults to `<hr>`.
   * - `"vertical"`: 1px column rule. Root defaults to `<div>`. Requires a flex or grid
   *   parent to stretch — in block flow, a vertical Divider renders 1px × 0px (invisible).
   */
  orientation?: DividerOrientation;

  /**
   * Visual tone.
   * - `"default"` (default): `--hairline` — standard structural separator.
   * - `"muted"`: `--hairline-soft` — quieter decorative separator.
   */
  tone?: DividerTone;

  /**
   * Root element override.
   * - `"hr"` (default for `orientation="horizontal"`): semantic thematic-break,
   *   implicit `role="separator"`. Do NOT add `role` or `aria-orientation` — they
   *   are implicit and re-adding them causes double-announcement in some readers.
   * - `"div"` (default for `orientation="vertical"`): block element with explicit
   *   `role="separator"` and `aria-orientation` applied automatically.
   *
   * Closed polymorphic — only `"hr"` and `"div"` are valid.
   */
  as?: "hr" | "div";

  /** Additional CSS class merged with internal classes. */
  className?: string;
}

// Conditional prop union so TypeScript narrows the correct HTML element attribute set.
type HrProps = DividerProps & ComponentPropsWithoutRef<"hr"> & { as?: "hr" };
type DivProps = DividerProps & ComponentPropsWithoutRef<"div"> & { as: "div" };

/**
 * `<Divider>` — the single source of truth for hairline separator rules.
 *
 * Horizontal separators default to `<hr>` (implicit `role="separator"`).
 * Vertical separators default to `<div role="separator" aria-orientation="vertical">`.
 *
 * Zero self-margin by design. Parent layout (flex `gap`, padding) controls spacing.
 *
 * @example Horizontal (default)
 *   <Divider />
 *
 * @example Muted horizontal
 *   <Divider tone="muted" />
 *
 * @example Vertical (inside a flex row)
 *   <div style={{ display: "flex", height: "2rem" }}>
 *     <span>Left</span>
 *     <Divider orientation="vertical" />
 *     <span>Right</span>
 *   </div>
 */
export const Divider = forwardRef<HTMLHRElement | HTMLDivElement, HrProps | DivProps>(
  function Divider({ orientation = "horizontal", tone = "default", as, className, ...rest }, ref) {
    const resolvedAs = as ?? (orientation === "vertical" ? "div" : "hr");
    const isHr = resolvedAs === "hr";

    const rootClass = clsx(
      styles.root,
      orientation === "horizontal" ? styles.horizontal : styles.vertical,
      tone === "muted" ? styles.toneMuted : styles.toneDefault,
      className,
    );

    if (isHr) {
      return (
        <hr
          ref={ref as React.Ref<HTMLHRElement>}
          className={rootClass}
          {...(rest as ComponentPropsWithoutRef<"hr">)}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="separator"
        aria-orientation={orientation}
        className={rootClass}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      />
    );
  },
);

Divider.displayName = "Divider";
