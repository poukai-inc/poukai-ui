import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./FailureMode.module.css";

export interface FailureModeProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * Sequence number — rendered zero-padded to two digits (`1` → `"01"`).
   * Pass an explicit string via `indexLabel` to override the format.
   */
  index: number;
  /** Override the rendered index label (e.g. `"A1"`, `"§ 1"`). */
  indexLabel?: string;
  /** Failure-mode title. */
  title: ReactNode;
  /** Body copy — paragraphs, lists, callouts. */
  children: ReactNode;
}

function defaultIndexLabel(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Numbered failure-mode block — `/why-ai` page recipe. Visually distinct
 * from `Principle`: index is large and sans-serif (the failure is the
 * subject), sits above the title rather than in the margin.
 *
 * @example
 *   <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
 *     <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
 *   </FailureMode>
 */
export const FailureMode = forwardRef<HTMLElement, FailureModeProps>(function FailureMode(
  { index, indexLabel, title, children, className, ...rest },
  ref,
) {
  const label = indexLabel ?? defaultIndexLabel(index);
  return (
    <section ref={ref} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.index} aria-hidden="true">
        {label}
      </span>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </section>
  );
});
