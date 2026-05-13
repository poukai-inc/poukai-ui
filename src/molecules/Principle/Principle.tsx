import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Principle.module.css";

export interface PrincipleProps extends ComponentPropsWithoutRef<"section"> {
  /**
   * Margin numeral — lowercase Roman by convention (`"i."`, `"ii."`, ...).
   * Free-form string; the consumer owns the format so we can swap to Arabic
   * (`"01."`) on a different surface without a prop explosion.
   */
  numeral: string;
  /** Principle title. */
  title: ReactNode;
  /** Body copy — paragraphs, lists, whatever fits. */
  children: ReactNode;
}

/**
 * Editorial principle block — used on `/principles`. A small numeral sits
 * in the left margin on desktop and inline above the title on mobile;
 * title + body run in the main column.
 *
 * @example
 *   <Principle numeral="i." title="Ship the smallest real thing.">
 *     <p>Pilots fail because they're rehearsals. Production is the only proving ground.</p>
 *   </Principle>
 */
export const Principle = forwardRef<HTMLElement, PrincipleProps>(function Principle(
  { numeral, title, children, className, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={clsx(styles.root, className)} {...rest}>
      <span className={styles.numeral} aria-hidden="true">
        {numeral}
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
});
