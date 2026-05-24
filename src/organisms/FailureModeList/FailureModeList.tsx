import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Section } from "../../molecules/Section";
import styles from "./FailureModeList.module.css";

export interface FailureModeListProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /**
   * Section heading — maps to `Section`'s `title` prop. Named `heading` to avoid
   * collision with `FailureMode`'s own `title` prop at the call site.
   */
  heading?: ReactNode;
  /** Eyebrow slot — passed through to `Section`. */
  eyebrow?: string | ReactNode;
  /** Supporting copy below the heading — passed through to `Section`. */
  lede?: ReactNode;
  /**
   * Block padding variant.
   * - `"default"` — `--space-16` top + bottom.
   * - `"tight"` — `--space-12` top + bottom.
   */
  size?: "default" | "tight";
  /**
   * Heading element for the section title.
   * Default `"h2"`. Pass `"h1"` when the list is the first heading on the page.
   */
  titleAs?: "h1" | "h2" | "h3";
  /** `<FailureMode>` nodes. Required — an empty list renders nothing useful. */
  children: ReactNode;
}

/**
 * Section-framed organism that collects `FailureMode` molecules into a coherent
 * catalog block. Owns the outer editorial frame (eyebrow + heading + lede + the
 * vertical container) so callers never re-roll that scaffolding per page.
 *
 * @example
 *   <FailureModeList
 *     eyebrow="Where things break"
 *     heading="How this breaks"
 *     lede="The most common failure modes we see in AI product teams."
 *   >
 *     <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
 *       <p>Most teams stop here.</p>
 *     </FailureMode>
 *     <FailureMode index={2} title="Evals as afterthought.">
 *       <p>Shipped without a measurement loop.</p>
 *     </FailureMode>
 *   </FailureModeList>
 */
export const FailureModeList = forwardRef<HTMLElement, FailureModeListProps>(
  function FailureModeList(
    { heading, eyebrow, lede, size = "default", titleAs = "h2", className, children, ...rest },
    ref,
  ) {
    return (
      <Section
        ref={ref}
        title={heading}
        eyebrow={eyebrow}
        lede={lede}
        size={size}
        titleAs={titleAs}
        className={clsx(styles.root, className)}
        {...(rest as ComponentPropsWithoutRef<"section">)}
      >
        <div className={styles.list}>{children}</div>
      </Section>
    );
  },
);

FailureModeList.displayName = "FailureModeList";
