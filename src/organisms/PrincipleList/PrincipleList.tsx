import { forwardRef, Children, type ReactNode } from "react";
import clsx from "clsx";
import { Section, type SectionProps } from "../../molecules/Section";
import styles from "./PrincipleList.module.css";

export interface PrincipleListProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Section heading — passed through to `Section`'s `title` slot.
   * Required in practice: an unlabeled PrincipleList has no accessible region name.
   */
  heading?: ReactNode;
  /**
   * Optional eyebrow label — passed through to `Section`'s `eyebrow` slot.
   */
  eyebrow?: string | ReactNode;
  /**
   * Optional supporting copy — passed through to `Section`'s `lede` slot.
   */
  lede?: ReactNode;
  /**
   * Block padding variant. Passed through to `Section`.
   * - `"default"` — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom.
   */
  size?: SectionProps["size"];
  /**
   * The `Principle` molecule instances. Each child is wrapped in a `<li>`.
   * Minimum two children — a single-item list has no sequential meaning.
   */
  children: ReactNode;
}

/**
 * Canonical organism for presenting a sequenced set of editorial principles.
 *
 * Frames a `Section` header (heading + optional eyebrow / lede) above a
 * vertical ordered list of `Principle` molecules. Dividers between items and
 * inter-item spacing are enforced here — consumers do not need to apply gap
 * or border-top values manually.
 *
 * @example
 *   <PrincipleList
 *     eyebrow="01 · Approach"
 *     heading="The rules we ship by."
 *     lede="Seven principles that define how we work."
 *   >
 *     <Principle numeral="i." title="Ship the smallest real thing.">
 *       <p>Production is the only proving ground.</p>
 *     </Principle>
 *     <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
 *       <p>No PMs translating, no juniors carrying.</p>
 *     </Principle>
 *   </PrincipleList>
 */
export const PrincipleList = forwardRef<HTMLElement, PrincipleListProps>(function PrincipleList(
  { heading, eyebrow, lede, size = "default", className, children, ...rest },
  ref,
) {
  const items = Children.toArray(children);

  return (
    <Section
      ref={ref}
      title={heading}
      eyebrow={eyebrow}
      lede={lede}
      size={size}
      className={clsx(styles.root, className)}
      {...rest}
    >
      <ol className={styles.list}>
        {items.map((child, index) => (
          <li key={index} className={clsx(styles.item, index > 0 && styles.itemDivider)}>
            {child}
          </li>
        ))}
      </ol>
    </Section>
  );
});

PrincipleList.displayName = "PrincipleList";
