import { forwardRef, Children, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Tag } from "../../atoms/Tag/index.js";
import styles from "./TagList.module.css";

export interface TagListProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * One or more `<Tag>` atoms. TagList does not enforce child type — the
   * expected child is `<Tag>`. Passing other element types breaks the visual
   * contract of the pill row and the `max` overflow logic.
   */
  children: ReactNode;

  /**
   * When set, renders only the first `max` children; surplus Tags collapse
   * into a single `<Tag tone="muted">+{N}</Tag>` overflow pill. Omit to
   * show all Tags.
   */
  max?: number;

  /**
   * Gap between Tag pills (inline and block axis).
   * - `"md"` (default) — `--space-2` (8px). Canonical editorial tag row.
   * - `"sm"` — `--space-1` (4px). Dense surfaces: table cells, compact card footers.
   */
  gap?: "sm" | "md";
}

/**
 * Canonical wrapper for a collection of `<Tag>` atoms.
 *
 * Owns the flex-wrap layout and gap rhythm that a raw flex container would
 * otherwise require every call-site to re-specify. Enforces a consistent
 * overflow strategy via the optional `max` prop — collapsing surplus Tags
 * into a single `+N` muted overflow pill.
 *
 * Root is `<div>`. Non-interactive — no hover, click, focus, or drag semantics.
 *
 * @example
 *   <TagList>
 *     <Tag>Engineering</Tag>
 *     <Tag>Design Systems</Tag>
 *     <Tag>A11y</Tag>
 *   </TagList>
 *
 * @example
 *   // Collapse after 3 visible Tags
 *   <TagList max={3}>
 *     <Tag>One</Tag>
 *     <Tag>Two</Tag>
 *     <Tag>Three</Tag>
 *     <Tag>Four</Tag>
 *     <Tag>Five</Tag>
 *   </TagList>
 */
export const TagList = forwardRef<HTMLDivElement, TagListProps>(function TagList(
  { children, max, gap = "md", className, ...rest },
  ref,
) {
  const allChildren = Children.toArray(children);
  const overflowCount =
    max !== undefined && allChildren.length > max ? allChildren.length - max : 0;
  const visibleChildren = overflowCount > 0 ? allChildren.slice(0, max) : allChildren;

  return (
    <div ref={ref} className={clsx(styles.root, gap === "sm" && styles.gapSm, className)} {...rest}>
      {visibleChildren}
      {overflowCount > 0 && <Tag tone="muted">+{overflowCount}</Tag>}
    </div>
  );
});

TagList.displayName = "TagList";
