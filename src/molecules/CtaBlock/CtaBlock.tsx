import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./CtaBlock.module.css";

export type CtaBlockOrientation = "stacked" | "horizontal";
export type CtaBlockAlign = "start" | "center";
export type CtaBlockHeadingAs = "h1" | "h2" | "h3";

export interface CtaBlockProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Primary CTA heading text. Required.
   * Rendered as the element specified by `headingAs`.
   */
  heading: ReactNode;
  /**
   * Semantic heading level for the heading.
   * Default: `"h2"` — correct when CtaBlock sits below a Hero h1.
   * Override for nested contexts (e.g. `"h3"` inside a section with its own h2).
   */
  headingAs?: CtaBlockHeadingAs;
  /**
   * Optional supporting paragraph. When absent the heading jumps directly
   * to the actions row with `--space-8` gap instead of `--space-6`.
   */
  body?: ReactNode;
  /**
   * Required actions slot. Consumer composes `<Button>` instance(s).
   * CtaBlock provides the container and spacing; button composition is caller-owned.
   */
  actions: ReactNode;
  /**
   * Layout orientation.
   * - `"stacked"` (default): heading, body, and actions stack vertically.
   * - `"horizontal"`: heading + body on the left, actions aligned to the trailing edge.
   *   Collapses to stacked below `--bp-md` (768px).
   */
  orientation?: CtaBlockOrientation;
  /**
   * Inline alignment of the content block.
   * - `"start"` (default): left-aligned, matches brand's restrained register.
   * - `"center"`: centered — use for symmetrical moments (e.g. full-bleed CTASection).
   */
  align?: CtaBlockAlign;
}

/**
 * CtaBlock — heading + body + action row molecule.
 *
 * The reusable CTA pattern for inline conversion moments: "Ready to start? [Get a demo]".
 * Serves marketing pages, end-of-feature sections, and any content moment that closes
 * with a call to action.
 *
 * NOT a page section — no `<section>` wrapper, no block padding, no surface of its own.
 * For end-of-page placement, compose inside `CTASection` (organism).
 *
 * @example
 *   // Stacked (default)
 *   <CtaBlock
 *     heading="Ready to start?"
 *     body="We work with senior-only teams who'd rather ship than speculate."
 *     actions={<Button variant="primary">Get a demo</Button>}
 *   />
 *
 *   // Horizontal — heading + body left, action right
 *   <CtaBlock
 *     orientation="horizontal"
 *     heading="Ready to start?"
 *     body="Senior-only teams. No hand-offs."
 *     actions={<Button variant="primary">Get a demo</Button>}
 *   />
 */
export const CtaBlock = forwardRef<HTMLDivElement, CtaBlockProps>(function CtaBlock(
  {
    heading,
    headingAs: HeadingEl = "h2",
    body,
    actions,
    orientation = "stacked",
    align = "start",
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        styles.root,
        styles[orientation],
        align === "center" && styles.alignCenter,
        className,
      )}
      {...rest}
    >
      <div className={styles.copy}>
        <HeadingEl className={styles.heading}>{heading}</HeadingEl>
        {body !== undefined && <p className={styles.body}>{body}</p>}
      </div>
      <div className={clsx(styles.actions, body === undefined && styles.actionsNoBody)}>
        {actions}
      </div>
    </div>
  );
});

CtaBlock.displayName = "CtaBlock";
