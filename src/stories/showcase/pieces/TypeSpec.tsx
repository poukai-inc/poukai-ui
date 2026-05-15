import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import styles from "../Showcase.module.css";

export interface TypeFamily {
  /** Token name — e.g. "--font-serif". */
  name: string;
  /** Role description — e.g. "Display — one moment per page". */
  role: string;
  /** Full CSS font-family stack, shown beneath the row. */
  stack: string;
  /** Type sample rendered with the family's styling. */
  sample: ReactNode;
  /** Type-sample styling (size, family, weight, tracking). */
  style: CSSProperties;
}

export interface TypeSpecProps {
  family: TypeFamily;
}

/**
 * One font-family card — display sample, token-name + role row, full stack.
 * Pure display; no @poukai/ui imports.
 */
export function TypeSpec({ family }: TypeSpecProps) {
  return (
    <div className={clsx(styles.spec)}>
      <div className={styles.typeSpec}>
        <div className={styles.typeSpecSample} style={family.style}>
          {family.sample}
        </div>
        <div className={styles.typeSpecRow}>
          <span className={styles.typeSpecName}>{family.name}</span>
          <span className={styles.typeSpecValue}>{family.role}</span>
        </div>
        <div className={styles.typeSpecStack}>{family.stack}</div>
      </div>
    </div>
  );
}
