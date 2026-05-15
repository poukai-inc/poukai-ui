import styles from "../Showcase.module.css";

interface SpaceRow {
  name: string;
  px: number;
}

const SPACING: SpaceRow[] = [
  { name: "--space-1", px: 4 },
  { name: "--space-2", px: 8 },
  { name: "--space-3", px: 12 },
  { name: "--space-4", px: 16 },
  { name: "--space-6", px: 24 },
  { name: "--space-8", px: 32 },
  { name: "--space-12", px: 48 },
  { name: "--space-16", px: 64 },
  { name: "--space-24", px: 96 },
  { name: "--space-32", px: 128 },
];

const MAX_PX = SPACING[SPACING.length - 1]!.px;

/**
 * 4-px base spacing scale — name + width-proportional bar + px value.
 * The token set excludes --space-10 (not in tokens.css).
 */
export function SpacingScale() {
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>4 px base · clamp-free scale</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {SPACING.map((s) => (
          <div className={styles.spaceRow} key={s.name}>
            <span className={styles.spaceRowName}>{s.name}</span>
            <span className={styles.spaceRowBar} style={{ width: `${(s.px / MAX_PX) * 100}%` }} />
            <span className={styles.spaceRowPx}>{s.px}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}
