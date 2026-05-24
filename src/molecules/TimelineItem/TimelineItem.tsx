import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Time } from "../../atoms/Time/index.js";
import { Heading, type HeadingLevel } from "../../atoms/Heading/index.js";
import { Text } from "../../atoms/Text/index.js";
import styles from "./TimelineItem.module.css";

export interface TimelineItemProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> {
  /** ISO 8601 date string — becomes `dateTime` attribute on the `<time>` element. Required. */
  date: string;
  /** Entry heading. Required. */
  title: ReactNode;
  /** Supporting copy. Optional — some milestone entries are title-only. */
  body?: ReactNode;
  /** Whether to render the downward connector stub. Pass `false` for the last item. */
  connector?: boolean;
  /** Semantic heading level for the title. Defaults to `"h3"`. */
  headingLevel?: HeadingLevel;
}

/**
 * TimelineItem — a single entry in a sequential chronological list.
 *
 * Renders a date, title, and optional body copy with a left-rail marker dot.
 * Must live inside a `<ol>` supplied by a parent `Timeline` organism.
 *
 * @example
 *   <ol>
 *     <TimelineItem date="2026-05-22" title="Series A closed" body="$12M led by Acme Ventures." />
 *     <TimelineItem date="2025-01-10" title="Company founded" connector={false} />
 *   </ol>
 */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { date, title, body, connector = true, headingLevel = "h3", className, ...rest },
  ref,
) {
  return (
    <li ref={ref} className={clsx(styles.root, connector && styles.connector, className)} {...rest}>
      <Time dateTime={date} className={styles.date}>
        {date}
      </Time>
      <Heading as={headingLevel} size={headingLevel} className={styles.title}>
        {title}
      </Heading>
      {body !== undefined ? (
        <Text size="body" tone="muted" className={styles.body}>
          {body}
        </Text>
      ) : null}
    </li>
  );
});

TimelineItem.displayName = "TimelineItem";
