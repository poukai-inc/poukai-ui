import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Wordmark.module.css";
import { WORDMARK_INNER_SVG, WORDMARK_VIEWBOX } from "./wordmark-geometry";

export interface WordmarkProps extends ComponentPropsWithoutRef<"span"> {
  /** Rendered SVG height in pixels. Width scales proportionally. */
  height?: number;
  /** Accessible label. Defaults to "Poukai". Hidden visually. */
  label?: string;
}

/**
 * Full POUKAI wordmark + isotype lockup. Inherits color via `currentColor`.
 *
 * Geometry is inlined from `wordmark-geometry.ts` (generated from
 * `brand/poukai-logo.svg`). Self-contained — no `<symbol>` sprite required
 * from the consumer.
 *
 * The mark is purely decorative (`aria-hidden`); a visually-hidden label
 * is announced to assistive tech.
 */
export const Wordmark = forwardRef<HTMLSpanElement, WordmarkProps>(function Wordmark(
  { height = 64, label = "Poukai", className, style, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={clsx(styles.root, className)} style={style} {...rest}>
      <svg
        viewBox={WORDMARK_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={styles.svg}
        style={{ height }}
        dangerouslySetInnerHTML={{ __html: WORDMARK_INNER_SVG }}
      />
      <span className={styles.sr}>{label}</span>
    </span>
  );
});
