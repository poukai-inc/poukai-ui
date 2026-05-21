import { forwardRef, type ComponentPropsWithoutRef, type Ref } from "react";
import clsx from "clsx";
import styles from "./Heading.module.css";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends Omit<ComponentPropsWithoutRef<"h2">, "as"> {
  /**
   * Rendered HTML element — drives the document outline and accessibility.
   * Default: `"h2"`. An explicit H1 should be deliberate, so the default does
   * not auto-promote to H1.
   */
  as?: HeadingLevel;
  /**
   * Visual rank — drives the type styling. Defaults to the same value as `as`,
   * so the common case (`<Heading>Foo</Heading>` = an H2 styled at H2 rank)
   * needs only one prop. Decoupled from `as` so consumers can render an `<h1>`
   * styled at H3 rank without breaking the document outline.
   */
  size?: HeadingLevel;
}

const sizeClass: Record<HeadingLevel, string> = {
  h1: styles.sizeH1!,
  h2: styles.sizeH2!,
  h3: styles.sizeH3!,
  h4: styles.sizeH4!,
  h5: styles.sizeH5!,
  h6: styles.sizeH6!,
};

/**
 * Canonical heading atom — owns the H1 → H6 type ramp.
 *
 * `as` picks the semantic level (rendered element). `size` picks the visual
 * rank. They are independent: an H1 can be styled at H3 rank, and vice versa.
 *
 * @example
 *   <Heading>Why we build</Heading>
 *   <Heading as="h1" size="h2">Field notes</Heading>
 *   <Heading as="h3" size="h5" id="updated">Last updated</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as: As = "h2", size, className, children, ...rest },
  ref,
) {
  const rank = size ?? As;
  const rootClassName = clsx(styles.root, sizeClass[rank], className);

  switch (As) {
    case "h1":
      return (
        <h1
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h1">)}
        >
          {children}
        </h1>
      );
    case "h3":
      return (
        <h3
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h3">)}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h4">)}
        >
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h5">)}
        >
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h6">)}
        >
          {children}
        </h6>
      );
    default:
      return (
        <h2
          ref={ref as Ref<HTMLHeadingElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"h2">)}
        >
          {children}
        </h2>
      );
  }
});

Heading.displayName = "Heading";
