import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Caption.module.css";

type CaptionAs = "figcaption" | "p" | "span";

type PolymorphicProps<T extends CaptionAs> = Omit<ComponentPropsWithoutRef<T>, "as"> & {
  /**
   * Root element. Use `"figcaption"` (default) when nested inside a `<figure>` —
   * the browser natively associates it with the figure content, no ARIA needed.
   * Use `"p"` for standalone caption outside a figure.
   * Use `"span"` for inline contexts (rare).
   */
  as?: T;
  /** The caption text. Plain string is idiomatic; ReactNode accepted. */
  children: ReactNode;
  /** Merged via clsx onto the root element. */
  className?: string;
};

export type CaptionProps = PolymorphicProps<CaptionAs>;

/**
 * Caption — muted micro-tracked label for supplementary attribution or
 * contextual annotation beneath a visual or content block.
 *
 * Renders `<figcaption>` by default (semantic inside `<figure>`).
 * Pass `as="p"` for standalone use outside a figure.
 *
 * @see meta/design/Caption.md
 */
export const Caption = forwardRef<HTMLElement, CaptionProps>(function Caption(
  { as, className, children, ...rest },
  ref,
) {
  const Root = (as ?? "figcaption") as ElementType;
  return (
    <Root ref={ref} className={clsx(styles.root, className)} {...rest}>
      {children}
    </Root>
  );
});

Caption.displayName = "Caption";
