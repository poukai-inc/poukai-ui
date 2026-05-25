/**
 * FAQSection — Section-framed Accordion of FAQItem children.
 *
 * Composes a `Section` molecule (heading, eyebrow, lede) with an
 * `Accordion.Root` containing one or more `FAQItem` children. The
 * Section landmark is named by the title, giving the FAQ block proper
 * region semantics on marketing and pricing pages.
 *
 * @example Basic usage
 *   <FAQSection title="Frequently asked questions" eyebrow="FAQ">
 *     <FAQItem value="q1" question="What is Poukai?">
 *       <p>A senior-only AI consulting practice.</p>
 *     </FAQItem>
 *     <FAQItem value="q2" question="Who do you work with?">
 *       <p>Founders and platform teams.</p>
 *     </FAQItem>
 *   </FAQSection>
 *
 * @example Multiple-open accordion
 *   <FAQSection title="FAQ" type="multiple">
 *     <FAQItem value="q1" question="What is Poukai?"><p>...</p></FAQItem>
 *   </FAQSection>
 *
 * @see meta/design/FAQSection.md
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import { Accordion } from "../../molecules/Accordion";
import styles from "./FAQSection.module.css";

export interface FAQSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Optional eyebrow above the title — e.g. `"FAQ"`.
   * Passed through to `Section`.
   */
  eyebrow?: string | ReactNode;
  /**
   * Section heading content.
   * @default "Frequently asked questions"
   */
  title?: ReactNode;
  /**
   * Heading element for the section title.
   * Override to `"h3"` when nested below another `h2`.
   * @default "h2"
   */
  titleAs?: "h1" | "h2" | "h3";
  /** Optional supporting copy below the title. */
  lede?: ReactNode;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` (64px) top + bottom.
   * - `"tight"` — `--space-12` (48px) top + bottom.
   * @default "default"
   */
  size?: "default" | "tight";
  /**
   * Passed to `Accordion.Root`. `"single"` collapses siblings on open;
   * `"multiple"` allows concurrent open items.
   * @default "single"
   */
  type?: "single" | "multiple";
  /**
   * Pre-opened item value(s). Passed to `Accordion.Root`.
   * Use a string for `type="single"`, an array for `type="multiple"`.
   */
  defaultValue?: string | string[];
  /**
   * One or more `<FAQItem>` elements. Required.
   */
  children: ReactNode;
}

/**
 * FAQSection — marketing-page FAQ block.
 *
 * Wraps `Section` + `Accordion.Root` + `FAQItem` children into a single
 * named landmark region with consistent vertical rhythm and collapsible
 * question/answer rows.
 */
export const FAQSection = forwardRef<HTMLElement, FAQSectionProps>(function FAQSection(
  {
    eyebrow,
    title = "Frequently asked questions",
    titleAs = "h2",
    lede,
    size = "default",
    type = "single",
    defaultValue,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Section
      ref={ref}
      eyebrow={eyebrow}
      title={title}
      titleAs={titleAs}
      lede={lede}
      size={size}
      className={clsx(styles.root, className)}
      {...rest}
    >
      {type === "multiple" ? (
        <Accordion.Root
          type="multiple"
          className={styles.accordion!}
          {...(defaultValue !== undefined && { defaultValue: defaultValue as string[] })}
        >
          {children}
        </Accordion.Root>
      ) : (
        <Accordion.Root
          type="single"
          collapsible={true}
          className={styles.accordion!}
          {...(defaultValue !== undefined && { defaultValue: defaultValue as string })}
        >
          {children}
        </Accordion.Root>
      )}
    </Section>
  );
});

FAQSection.displayName = "FAQSection";
