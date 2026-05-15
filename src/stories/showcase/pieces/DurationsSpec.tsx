import { Fragment } from "react";
import styles from "../Showcase.module.css";

interface DurationRow {
  name: string;
  value: string;
  caption: string;
}

const DURATIONS: DurationRow[] = [
  { name: "--dur-fast", value: "180ms", caption: "muted-link color, button bg." },
  { name: "--dur-mid", value: "240ms", caption: "Link underline grow." },
  { name: "--dur-slow", value: "600ms", caption: "Editorial entrance." },
];

/** Motion-duration table — token · use · ms. */
export function DurationsSpec() {
  return (
    <div className={styles.spec}>
      <p className={styles.specCaption}>Durations</p>
      <div className={styles.tokenGrid}>
        {DURATIONS.map((d) => (
          <Fragment key={d.name}>
            <span className={styles.tokenGridName}>{d.name}</span>
            <span className={styles.tokenGridDesc}>{d.caption}</span>
            <span className={styles.tokenGridValue}>{d.value}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
