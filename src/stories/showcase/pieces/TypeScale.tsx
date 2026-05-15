import { Fragment } from "react";
import styles from "../Showcase.module.css";

interface ScaleRow {
  name: string;
  desc: string;
  value: string;
}

const TYPE_SCALE: ScaleRow[] = [
  { name: "--fs-tagline", desc: "Display headline — h1", value: "clamp(36 → 68 px)" },
  { name: "--fs-stat-large", desc: "Display numeral — Stat lg", value: "clamp(56 → 96 px)" },
  { name: "--fs-stat", desc: "Display numeral — Stat md", value: "clamp(44 → 72 px)" },
  { name: "h2", desc: "Editorial h2", value: "clamp(28 → 40 px)" },
  {
    name: "RoleCard / Principle / FailureMode title",
    desc: "Molecule titles",
    value: "clamp(24 → 32 px)",
  },
  { name: "--fs-wordmark", desc: "Lockup label", value: "clamp(17 → 20 px)" },
  { name: "--fs-body", desc: "Body copy", value: "clamp(17 → 19 px)" },
  { name: "h3", desc: "Section headings", value: "18 px / 500" },
  { name: "--fs-meta", desc: "Captions, nav, footer", value: "14 px" },
  { name: "--fs-micro", desc: "Uppercase eyebrows, sources", value: "12 px" },
];

/** Type-scale specification table — token name · role · clamp range. */
export function TypeScale() {
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>Type scale</p>
      <div className={styles.tokenGrid}>
        {TYPE_SCALE.map((t) => (
          <Fragment key={t.name}>
            <span className={styles.tokenGridName}>{t.name}</span>
            <span className={styles.tokenGridDesc}>{t.desc}</span>
            <span className={styles.tokenGridValue}>{t.value}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
