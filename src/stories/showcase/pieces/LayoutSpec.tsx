import clsx from "clsx";
import styles from "../Showcase.module.css";

interface LayoutRow {
  name: string;
  value: string;
  /** Which bar variant to render. */
  variant: "hatched" | "solid" | "hero";
}

const ROWS: LayoutRow[] = [
  { name: "--page-pad", value: "clamp(24 → 48 px)", variant: "hatched" },
  { name: "--content-max", value: "64 rem · 1024 px", variant: "solid" },
  { name: "--hero-max", value: "38 rem · 608 px", variant: "hero" },
];

/** Three container-width visualisations: --page-pad, --content-max, --hero-max. */
export function LayoutSpec() {
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>Layout containers</p>
      <div className={styles.layoutColumn}>
        {ROWS.map((r) => (
          <div key={r.name}>
            <div
              className={clsx(
                r.variant === "hatched" && [styles.layoutBar, styles.layoutBarHatched],
                r.variant === "solid" && [styles.layoutBar, styles.layoutBarSolid],
                r.variant === "hero" && styles.layoutBarHero,
              )}
            />
            <div className={styles.typeSpecRow}>
              <span className={styles.typeSpecName}>{r.name}</span>
              <span className={styles.typeSpecValue}>{r.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
