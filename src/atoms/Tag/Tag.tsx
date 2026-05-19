import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Tag.module.css";

export interface TagProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * The label content. Typically a plain string.
   * ReactNode is accepted to accommodate rare inline `<strong>` emphasis.
   * Required.
   */
  children: ReactNode;

  /**
   * Optional leading icon slot.
   * Accepts any ReactNode — idiomatic usage is a lucide-react icon at size={12}.
   * When present, the root shifts to `inline-flex` for optical alignment.
   * Pass decorative icons with `aria-hidden="true"`.
   *
   * @example
   *   icon={<Sparkles size={12} aria-hidden="true" />}
   *
   * @remarks Recommended icon size: 12px for standard Tags (proportional inside a 14px-text pill).
   */
  icon?: ReactNode;

  /**
   * Visual tone.
   * - `"default"` (default) — subtle surface fill (`--surface`), full fg text.
   *   Use for primary categorical labels in cards and content.
   * - `"muted"` — transparent background, hairline border, muted fg text.
   *   Use for secondary tags, draft labels, or where the tag must recede further.
   */
  tone?: "default" | "muted";
}

/**
 * Inline categorical pill — communicates type, category, topic, or metadata
 * classification of adjacent content.
 *
 * Root is always `<span>` (non-polymorphic). Non-interactive — no hover, focus,
 * or active states. Tags do not receive keyboard focus.
 *
 * @example
 *   <Tag>Engineering</Tag>
 *   <Tag tone="muted">Draft</Tag>
 *   <Tag icon={<Sparkles size={12} aria-hidden="true" />}>Featured</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "default", icon, className, children, ...rest },
  ref,
) {
  const hasIcon = icon !== undefined;

  return (
    <span
      ref={ref}
      className={clsx(
        styles.root,
        tone === "default" && styles.toneDefault,
        tone === "muted" && styles.toneMuted,
        hasIcon && styles.withIcon,
        className,
      )}
      {...rest}
    >
      {hasIcon && icon}
      {children}
    </span>
  );
});

Tag.displayName = "Tag";
