import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import styles from "./TestimonialBlock.module.css";

export type TestimonialBlockOrientation = "stacked" | "horizontal";
export type TestimonialBlockAlign = "start" | "center";

export interface TestimonialBlockProps extends HTMLAttributes<HTMLElement> {
  /**
   * The testimonial text. Required.
   * ReactNode to allow <em> emphasis within the quote string.
   * Rendered inside a <blockquote>.
   */
  quote: ReactNode;
  /**
   * Attribution row. Required — an unattributed quote is not a testimonial.
   * Pass a <Byline name="…" role="…" /> instance.
   */
  byline: ReactNode;
  /**
   * Optional portrait slot. Accepts a <Portrait> or any ReactNode.
   * When absent, layout collapses to quote + byline only.
   * Decorative use: pass alt="" or aria-hidden="true" on the portrait
   * when the Byline already names the person.
   */
  portrait?: ReactNode;
  /**
   * Portrait placement when portrait is present.
   * - "stacked" (default): portrait centered above the quote.
   * - "horizontal": portrait left-aligned beside the byline, below the quote.
   */
  orientation?: TestimonialBlockOrientation;
  /**
   * Text alignment within the column.
   * - "center" (default): editorial default for an isolated testimonial.
   * - "start": left-rail or card-adjacent contexts.
   */
  align?: TestimonialBlockAlign;
}

/**
 * Single-testimonial editorial organism.
 *
 * Composes a Quote (<blockquote>) + Byline attribution row inside a
 * recessed section band. An optional Portrait slot places an avatar
 * above (stacked) or beside the byline (horizontal).
 *
 * One voice per block — do not stack multiple TestimonialBlock instances
 * back to back. Use TestimonialCarousel or TestimonialGrid for multi-voice
 * surfaces.
 *
 * @example Default (stacked, centered, no portrait)
 *   <TestimonialBlock
 *     quote="Changed how our team ships."
 *     byline={<Byline name="Jane Doe" role="Head of Design, Acme" />}
 *   />
 *
 * @example With portrait (stacked)
 *   <TestimonialBlock
 *     quote={<>"Changed how our team ships."</>}
 *     byline={<Byline name="Jane Doe" role="Head of Design, Acme" />}
 *     portrait={
 *       <Portrait src="…" alt="" aspect="1:1" width={120} />
 *     }
 *   />
 *
 * @example Horizontal orientation, start-aligned
 *   <TestimonialBlock
 *     orientation="horizontal"
 *     align="start"
 *     quote="Accelerated our roadmap by a quarter."
 *     byline={<Byline name="Alex Kim" role="CTO, Startupco" />}
 *     portrait={<Portrait src="…" alt="" aspect="1:1" width={120} />}
 *   />
 */
export const TestimonialBlock = forwardRef<HTMLElement, TestimonialBlockProps>(
  function TestimonialBlock(
    { quote, byline, portrait, orientation = "stacked", align = "center", className, ...rest },
    ref,
  ) {
    const rootClassName = clsx(
      styles.root,
      orientation === "horizontal" && styles.orientationHorizontal,
      align === "start" && styles.alignStart,
      className,
    );

    const portraitNode =
      portrait !== undefined ? <div className={styles.portraitSlot}>{portrait}</div> : null;

    // In stacked orientation the portrait sits above the quote.
    // In horizontal orientation the portrait sits beside the byline (below the quote).
    const inner =
      orientation === "horizontal" ? (
        <div className={styles.container}>
          <blockquote className={styles.blockquote}>{quote}</blockquote>
          <div className={styles.bylineRow}>
            {portraitNode}
            <div className={styles.bylineSlot}>{byline}</div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          {portraitNode}
          <blockquote className={styles.blockquote}>{quote}</blockquote>
          <div className={styles.bylineSlot}>{byline}</div>
        </div>
      );

    return (
      <section ref={ref as Ref<HTMLElement>} className={rootClassName} {...rest}>
        {inner}
      </section>
    );
  },
);

TestimonialBlock.displayName = "TestimonialBlock";
