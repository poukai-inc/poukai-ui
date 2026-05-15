import clsx from "clsx";
import { Stat } from "../../../atoms/Stat";
import styles from "../Showcase.module.css";

/** Two stats side-by-side, end-aligned right column — the /why-ai PairedRow shape. */
export function StatPair() {
  return (
    <div className={styles.spec}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-12)",
        }}
      >
        <Stat value="85%" caption="of AI pilots never reach production." source="MIT Sloan, 2025" />
        <Stat
          value="$300B"
          caption="annual spend on initiatives that stall at proof-of-concept."
          source="IDC, 2025"
          align="end"
        />
      </div>
    </div>
  );
}

/** Stat at the large display size. */
export function StatLarge() {
  return (
    <div className={styles.spec}>
      <Stat
        size="lg"
        value="3.2×"
        caption="faster delivery once a working dev loop replaces handoff theatre."
      />
    </div>
  );
}

/** Stat inverted on the dark spec card. The card re-defines --fg / --fg-muted. */
export function StatInverted() {
  return (
    <div className={clsx(styles.spec, styles.specDark)} style={{ padding: "var(--space-12)" }}>
      <Stat value="85%" caption="of AI pilots never reach production." source="MIT Sloan, 2025" />
    </div>
  );
}
