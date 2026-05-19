import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./FieldNote.module.css";

export interface FieldNoteProps extends ComponentPropsWithoutRef<"aside"> {
  /**
   * Optional label rendered above the body text.
   * Displays in the Eyebrow register (--fs-meta, --fg-muted, uppercase, tracked).
   * When omitted, no label element is rendered.
   * Example values: "Note", "Caveat", "Aside", "Data point".
   */
  label?: string;
  /**
   * The aside body text. Required.
   * Accepts ReactNode to support inline <strong>, <em>, and <a>.
   * No block-level elements — no <h2>, <ul>, <p>, <div>, etc.
   * Children are rendered inside a <p> element.
   */
  children: ReactNode;
}

export const FieldNote = forwardRef<HTMLElement, FieldNoteProps>(function FieldNote(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <aside ref={ref} className={clsx(styles.root, className)} {...rest}>
      {label !== undefined && <p className={styles.label}>{label}</p>}
      <p className={styles.body}>{children}</p>
    </aside>
  );
});

FieldNote.displayName = "FieldNote";
