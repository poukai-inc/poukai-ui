/**
 * FAQItem — collapsible question + answer row.
 *
 * Thin opinionated wrapper around Accordion.Item + Accordion.Trigger +
 * Accordion.Content. Must be placed inside an `<Accordion.Root>` wrapper
 * so that Radix's keyboard model and open/closed state management function
 * correctly.
 *
 * @example
 *   <Accordion.Root type="single" collapsible>
 *     <FAQItem value="q1" question="What is Poukai?">
 *       <p>A senior-only AI consulting practice.</p>
 *     </FAQItem>
 *   </Accordion.Root>
 *
 * @see meta/design/FAQItem.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Accordion } from "../Accordion";
import styles from "./FAQItem.module.css";

export type FAQItemQuestionAs = "h2" | "h3" | "h4";

export interface FAQItemProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** The question text. Rendered as a heading inside the trigger button. Required. */
  question: string;
  /** Unique key for Accordion state (Radix requirement). Required. */
  value: string;
  /**
   * Heading level for the question. h3 is correct when FAQItem sits inside a
   * Section with an h2 title; override to h2 for a standalone FAQ with no
   * parent heading.
   * @default "h3"
   */
  questionAs?: FAQItemQuestionAs;
  /** Answer content. Consumers pass `<Prose>` or a plain paragraph. Required. */
  children: ReactNode;
}

/**
 * FAQItem — single collapsible question-and-answer row.
 *
 * Must be placed inside an `<Accordion.Root>` wrapper. The parent Root owns
 * `type`, `defaultValue`, and keyboard navigation.
 */
export const FAQItem = forwardRef<HTMLDivElement, FAQItemProps>(function FAQItem(
  { question, value, questionAs: QuestionAs = "h3", className, children, ...rest },
  ref,
) {
  return (
    <Accordion.Item ref={ref} value={value} className={clsx(styles.item, className)} {...rest}>
      <Accordion.Trigger className={styles.trigger}>
        <QuestionAs className={styles.question}>{question}</QuestionAs>
      </Accordion.Trigger>
      <Accordion.Content className={styles.content}>{children}</Accordion.Content>
    </Accordion.Item>
  );
});

FAQItem.displayName = "FAQItem";
