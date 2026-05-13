import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./RoleCard.module.css";

export interface RoleCardProps extends ComponentPropsWithoutRef<"article"> {
  /** Tiny uppercase label above the title — e.g. "Role 01". */
  eyebrow: ReactNode;
  /** The role title — e.g. "Builder". */
  title: ReactNode;
  /** Descriptive body copy. */
  body: ReactNode;
  /**
   * Footer line — typically a short list of companies that hire this role.
   * Lives in the muted footer rule of the card.
   */
  hiredBy?: ReactNode;
  /**
   * Decorative icon slot. The DS does NOT import `lucide-react`; consumers
   * pass in their own icon (`<Builder size={28} />` etc). Rendered with
   * `aria-hidden` around it.
   */
  icon?: ReactNode;
}

/**
 * Role card — the recipe used on `/roles`. Surface + hairline + radius-3 card,
 * editorial typography, icon as a slot.
 *
 * The icon slot is deliberately content-agnostic — pass a Lucide glyph, a
 * branded SVG, or `null`. The card composes the layout; the consumer picks
 * the symbol.
 *
 * @example
 *   <RoleCard
 *     icon={<Hammer aria-hidden size={28} />}
 *     eyebrow="Role 01"
 *     title="Builder"
 *     body="Ships production systems end-to-end."
 *     hiredBy="Anthropic · Vercel · Stripe"
 *   />
 */
export const RoleCard = forwardRef<HTMLElement, RoleCardProps>(function RoleCard(
  { eyebrow, title, body, hiredBy, icon, className, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={clsx(styles.root, className)} {...rest}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      {hiredBy ? <p className={styles.hiredBy}>{hiredBy}</p> : null}
    </article>
  );
});
