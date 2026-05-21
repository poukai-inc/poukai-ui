import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import styles from "./Prose.module.css";

export type ProseWidth = "full" | "reading";

export interface ProseProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Reading-column constraint.
   * - `"full"` (default) — no max-width; Prose inherits its column from the parent layout.
   * - `"reading"` — caps at `64ch` and centers horizontally; canonical editorial body.
   */
  width?: ProseWidth;

  /**
   * Render DS styles on a child element (e.g. `<article>`, `<section>`).
   * When `true`, renders a Radix `<Slot>` and merges all props onto the single child.
   * The consumer is responsible for passing exactly one child.
   */
  asChild?: boolean;
}

const widthClass: Record<ProseWidth, string> = {
  full: styles.widthFull!,
  reading: styles.widthReading!,
};

/**
 * Typographic context wrapper for long-form HTML.
 *
 * Drop arbitrary `<h1>`–`<h6>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`,
 * `<code>`, `<pre>`, `<hr>`, `<figure>`, `<table>` markup inside and the
 * DS type contract applies via low-specificity `:where(...)` descendant
 * rules. Consumer overrides win.
 *
 * Use `width="reading"` for standalone editorial pages where Prose should
 * own its own column. Default `width="full"` lets Prose inherit the column
 * from a parent `<Section>` or page layout.
 *
 * @example
 *   <Prose width="reading" asChild>
 *     <article>
 *       <h1>The case for AI fluency</h1>
 *       <p className="lede">Why every leader needs a working model.</p>
 *       <p>Long-form body copy…</p>
 *     </article>
 *   </Prose>
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { width = "full", asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={clsx(styles.root, widthClass[width], className)} {...rest} />;
});

Prose.displayName = "Prose";
