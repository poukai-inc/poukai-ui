import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Stat.module.css";

export type StatAlign = "start" | "end";
export type StatSize = "md" | "lg";

export interface StatProps extends ComponentPropsWithoutRef<"div"> {
  /** The numeral — e.g. "85%", "$300B", "3.2×". Rendered in display serif. */
  value: ReactNode;
  /** Short caption beneath the numeral. */
  caption: ReactNode;
  /** Optional provenance line in the micro/uppercase meta style. */
  source?: ReactNode;
  /** Horizontal alignment of the column. Defaults to `"start"`. */
  align?: StatAlign;
  /** Numeral size — `"lg"` bumps to `--fs-stat-large`. */
  size?: StatSize;
}

const alignClass: Record<StatAlign, string> = {
  start: styles.alignStart!,
  end: styles.alignEnd!,
};

const sizeClass: Record<StatSize, string> = {
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

/**
 * Editorial statistic — display numeral on top, caption beneath, optional
 * provenance line in uppercase micro. Pure typography; no chart, no animation.
 *
 * @example
 *   <Stat value="85%" caption="of teams adopting AI plateau at pilot." source="MIT Sloan, 2025" />
 */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  {
    value,
    caption,
    source,
    align = "start",
    size = "md",
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(styles.root, alignClass[align], sizeClass[size], className)}
      {...rest}
    >
      <span className={styles.value}>{value}</span>
      <span className={styles.caption}>{caption}</span>
      {source ? <span className={styles.source}>{source}</span> : null}
    </div>
  );
});
