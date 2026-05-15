import clsx from "clsx";
import styles from "../Showcase.module.css";

export interface SwatchProps {
  /** Token name, rendered in mono. */
  name: string;
  /** Hex value applied as the chip background. */
  hex: string;
  /** Caption beneath the chip — "where it's used". */
  caption: string;
  /**
   * Hint that the chip is dark enough to read as its own edge — the chip then
   * borrows its own color for the border (rather than the global hairline).
   */
  dark?: boolean;
}

/**
 * One color swatch card — chip + token name + hex + caption.
 * Pure display; no @poukai/ui imports.
 */
export function Swatch({ name, hex, caption, dark = false }: SwatchProps) {
  return (
    <div className={clsx(styles.spec, styles.swatch)}>
      <div
        className={styles.swatchChip}
        style={{ background: hex, borderColor: dark ? hex : undefined }}
      />
      <div className={styles.swatchMeta}>
        <span className={styles.swatchName}>{name}</span>
        <span className={styles.swatchHex}>{hex}</span>
      </div>
      <p className={styles.swatchCaption}>{caption}</p>
    </div>
  );
}
