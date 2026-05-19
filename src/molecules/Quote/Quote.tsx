import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Quote.module.css";

export interface QuoteProps extends ComponentPropsWithoutRef<"figure"> {
  /**
   * The quoted body text. Required.
   * Accepts ReactNode to support inline <em> or <strong> within the passage.
   * No block-level elements — no headings, lists, or nested paragraphs.
   * Rendered as the direct child of <blockquote>.
   */
  quote: ReactNode;
  /**
   * The attributed person's name. Required.
   * Plain string. Rendered at --fs-meta, font-weight 500, --fg.
   */
  name: string;
  /**
   * The attributed person's role or title. Optional.
   * Plain string. Example: "VP Engineering, Acme Corp".
   * Rendered at --fs-meta, font-weight 400, --fg-muted.
   * When omitted, no role element is rendered.
   */
  role?: string;
  /**
   * Avatar slot. Optional. Accepts any ReactNode.
   * Consumers pass <img>, an Avatar component from another library,
   * or a <div> with initials. The DS does not ship an Avatar atom.
   * When present, rendered as the leftmost element of the attribution row.
   * When omitted, the attribution row contains only the name/role column.
   *
   * Convention: size your avatar element to 40×40px and clip to a circle
   * (e.g. `style={{ borderRadius: "50%", display: "block" }}`).
   * The DS does not enforce sizing or shape — the consumer is responsible.
   * If passing an <img>, set `alt=""` (decorative) because the name already
   * provides the text alternative.
   */
  avatar?: ReactNode;
}

export const Quote = forwardRef<HTMLElement, QuoteProps>(function Quote(
  { quote, name, role, avatar, className, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={clsx(styles.root, className)} {...rest}>
      <blockquote className={styles.blockquote}>{quote}</blockquote>
      <figcaption className={styles.figcaption}>
        {avatar !== undefined && <div className={styles.avatarSlot}>{avatar}</div>}
        <div className={styles.nameRole}>
          <p className={styles.name}>{name}</p>
          {role !== undefined && <p className={styles.role}>{role}</p>}
        </div>
      </figcaption>
    </figure>
  );
});

Quote.displayName = "Quote";
