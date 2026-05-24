import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./MetaList.module.css";

export interface MetaListItem {
  /** The term/key — rendered in a `<dt>`. */
  label: ReactNode;
  /** The definition/value — rendered in a `<dd>`. */
  value: ReactNode;
}

export interface MetaListProps extends ComponentPropsWithoutRef<"dl"> {
  /** Label/value pairs to render. Each becomes a `<div><dt>…</dt><dd>…</dd></div>` row. */
  items: MetaListItem[];
  /**
   * Layout orientation.
   * - `"stacked"` (default): dt above dd — suits narrow sidebars.
   * - `"horizontal"`: dt inline with dd — suits wider panels.
   */
  orientation?: "stacked" | "horizontal";
  /**
   * When `true`, each row gets a hairline `border-top` divider.
   * Defaults to `false` — quiet by default.
   */
  dividers?: boolean;
  /**
   * CSS value for the dt column width in horizontal mode (e.g. `"8rem"`).
   * Consumer-controlled; no token default to avoid speculating on label lengths.
   * Has no effect when `orientation="stacked"`.
   */
  labelWidth?: string;
}

/**
 * MetaList — a semantic `<dl>` of label/value pairs.
 *
 * Use for structured metadata at a glance: article sidebars, project spec panels,
 * pricing detail blocks. The system's canonical answer to the "key: value, stacked"
 * pattern.
 *
 * @example
 *   <MetaList
 *     items={[
 *       { label: "Published", value: "2026-05-22" },
 *       { label: "Reading time", value: "6 min" },
 *     ]}
 *   />
 *
 * @example
 *   <MetaList
 *     orientation="horizontal"
 *     labelWidth="8rem"
 *     dividers
 *     items={[
 *       { label: "Version", value: "2.1.0" },
 *       { label: "License", value: "MIT" },
 *     ]}
 *   />
 */
export const MetaList = forwardRef<HTMLDListElement, MetaListProps>(function MetaList(
  { items, orientation = "stacked", dividers = false, labelWidth, className, style, ...rest },
  ref,
) {
  const rootStyle =
    orientation === "horizontal" && labelWidth
      ? { "--meta-list-label-w": labelWidth, ...style }
      : style;

  return (
    <dl
      ref={ref}
      className={clsx(
        styles.root,
        orientation === "horizontal" && styles.horizontal,
        dividers && styles.dividers,
        className,
      )}
      style={rootStyle as React.CSSProperties}
      {...rest}
    >
      {items.map((item, index) => (
        <div key={index} className={styles.row}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
});

MetaList.displayName = "MetaList";
