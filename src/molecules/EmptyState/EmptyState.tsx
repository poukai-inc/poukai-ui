import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./EmptyState.module.css";

export type EmptyStateTone = "default" | "subtle";

export interface EmptyStateProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Required primary message. Short, scannable, present tense.
   * Example: "No scheduled posts"
   */
  title: string;
  /**
   * Optional decorative icon slot. Lucide icon at --icon-lg (24px) is idiomatic.
   * Do not pass text or heading nodes — the slot is aria-hidden.
   */
  icon?: ReactNode;
  /**
   * Optional supporting sentence. Accepts ReactNode to allow inline <a> / <strong>.
   */
  description?: ReactNode;
  /**
   * Optional CTA slot. Consumer owns the Button variant and handler.
   */
  action?: ReactNode;
  /**
   * Visual register of the container.
   * - `default` (default): transparent background — sits on any parent surface.
   * - `subtle`: --surface fill + --radius-3 — use inside card or panel contexts.
   */
  tone?: EmptyStateTone;
}

/**
 * EmptyState — zero-data placeholder molecule.
 *
 * Composes an optional icon slot, a required title, an optional description,
 * and an optional action slot into a centered vertical stack.
 *
 * A11y:
 *   - Root is a plain <div>. Not role="alert" — empty states are not urgent.
 *   - Icon wrapper uses aria-hidden="true" — always decorative.
 *   - Title is a <p> (not a heading) so it doesn't pollute the document outline.
 *   - Description ReactNode may contain inline links with standard focus rings.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, icon, description, action, tone = "default", className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(styles.root, tone === "subtle" && styles.subtle, className)}
      {...rest}
    >
      {icon !== undefined && (
        <span className={styles.iconWrap} aria-hidden="true">
          {icon}
        </span>
      )}
      <p className={styles.title}>{title}</p>
      {description !== undefined && <p className={styles.description}>{description}</p>}
      {action !== undefined && <div className={styles.actionWrap}>{action}</div>}
    </div>
  );
});

EmptyState.displayName = "EmptyState";
