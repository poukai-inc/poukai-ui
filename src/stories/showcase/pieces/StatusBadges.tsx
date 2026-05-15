import { StatusBadge } from "../../../atoms/StatusBadge";
import styles from "../Showcase.module.css";

/** All three StatusBadge states stacked. "available" is the only one that pulses. */
export function StatusBadges() {
  return (
    <div className={styles.spec} style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <StatusBadge status="available">Taking conversations for Q3.</StatusBadge>
        <StatusBadge status="idle">Reviewing scope — next intake in two weeks.</StatusBadge>
        <StatusBadge status="closed">Booked through end of year.</StatusBadge>
      </div>
      <hr style={{ borderTop: "1px solid var(--hairline)", margin: 0, border: 0 }} />
      <p className="micro">status · &ldquo;available&rdquo; pulses</p>
    </div>
  );
}
