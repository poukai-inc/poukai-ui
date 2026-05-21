import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./VisuallyHidden.module.css";

type VisuallyHiddenElement = "span" | "div";

export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Root element to render. Defaults to `"span"` for inline contexts (inside
   * buttons, links, icon labels). Use `"div"` only for block-level contexts
   * where a `<span>` would be invalid HTML (e.g. a visually-hidden landmark
   * label wrapping block children).
   *
   * Closed union — no other elements are accepted.
   */
  as?: VisuallyHiddenElement;
}

/**
 * Canonical sr-only primitive. Renders children in the accessibility tree
 * (readable by screen readers, announced by assistive technology) while
 * keeping the element completely invisible to sighted users via the WCAG
 * clip pattern.
 *
 * This component is invariant — one shape, no variants, no tokens, no motion.
 * It is always visually hidden; conditional visibility is the caller's concern.
 *
 * Use `...rest` to forward `id` (for `aria-labelledby`/`aria-describedby`
 * associations) or `aria-live` (for live-region announcements).
 *
 * @example
 *   // Icon button — accessible name without visible text
 *   <button aria-label="Close">
 *     <CloseIcon aria-hidden="true" />
 *     <VisuallyHidden>Close dialog</VisuallyHidden>
 *   </button>
 *
 * @example
 *   // Live-region carousel announcement
 *   <VisuallyHidden aria-live="polite">Slide 2 of 5</VisuallyHidden>
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden(
  { as = "span", className, children, ...rest },
  ref,
) {
  const Root = as as VisuallyHiddenElement;
  return (
    <Root
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      className={clsx(styles.root, className)}
      {...rest}
    >
      {children}
    </Root>
  );
});

VisuallyHidden.displayName = "VisuallyHidden";
