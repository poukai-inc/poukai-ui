import styles from "../Showcase.module.css";

interface RadiusRow {
  name: string;
  px: number;
  use: string;
  bar?: boolean;
}

const RADII: RadiusRow[] = [
  { name: "--radius-1", px: 2, use: "Focus ring radius." },
  { name: "--radius-2", px: 4, use: "Button, icon tiles." },
  { name: "--radius-3", px: 8, use: "Cards, RoleCard." },
  { name: "--hairline-w", px: 1, use: "All 1-px rules.", bar: true },
];

/** Radii & rules — 2 / 4 / 8 px chips plus the 1-px hairline rule. */
export function RadiiSpec() {
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>Radii &amp; rules</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {RADII.map((r) => (
          <div className={styles.radiusRow} key={r.name}>
            <div
              className={r.bar ? styles.radiusChipBar : styles.radiusChip}
              style={r.bar ? undefined : { borderRadius: r.px }}
            />
            <div className={styles.radiusMeta}>
              <div className={styles.radiusName}>{r.name}</div>
              <div className={styles.radiusUse}>{r.use}</div>
            </div>
            <div className={styles.radiusPx}>{r.px} px</div>
          </div>
        ))}
      </div>
    </div>
  );
}
