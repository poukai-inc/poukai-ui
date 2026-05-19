import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import clsx from "clsx";
import styles from "./Pull.module.css";

export interface PullProps extends Omit<HTMLAttributes<HTMLElement>, "cite"> {
  /**
   * Root element semantics.
   * - `"blockquote"` (default) — use for literal quotations from an external source.
   * - `"aside"` — use when Pull is an extracted editorial accent, not a direct quote.
   */
  as?: "blockquote" | "aside";
  /**
   * URL of the quoted source. Mapped to the HTML `cite` attribute on `<blockquote>`.
   * Machine-readable only (not rendered visibly). Silently ignored when `as="aside"`.
   */
  cite?: string;
  /**
   * Visible trailing attribution line.
   * Renders as `<footer>` when `as="blockquote"`, as `<p>` when `as="aside"`.
   * Accepts ReactNode for inline markup (`<cite>`, `<em>`, etc.).
   */
  attribution?: ReactNode;
  /**
   * Typographic register for the body text.
   * - `"serif"` (default) — Instrument Serif italic. Editorial long-form register.
   * - `"sans"` — Geist roman weight 400. Technical / operator-grade content.
   */
  variant?: "serif" | "sans";
}

export const Pull = forwardRef<HTMLElement, PullProps>(function Pull(
  { as: As = "blockquote", cite, attribution, variant = "serif", className, children, ...rest },
  ref,
) {
  const rootClassName = clsx(styles.root, variant === "sans" && styles.variantSans, className);

  // Attribution tag: <footer> inside <blockquote> per HTML5 spec (scoped, not contentinfo).
  // <p> inside <aside> to avoid landmark hierarchy noise.
  const AttributionTag = As === "blockquote" ? "footer" : "p";

  const inner = (
    <>
      {children}
      {attribution !== undefined && (
        <AttributionTag className={styles.attribution}>{attribution}</AttributionTag>
      )}
    </>
  );

  if (As === "aside") {
    return (
      <aside
        ref={ref as Ref<HTMLElement>}
        className={rootClassName}
        // cite is not a valid attribute on <aside> — silently drop it
        {...(rest as ComponentPropsWithoutRef<"aside">)}
      >
        {inner}
      </aside>
    );
  }

  // Default: "blockquote"
  return (
    <blockquote
      ref={ref as Ref<HTMLQuoteElement>}
      className={rootClassName}
      cite={cite}
      {...(rest as ComponentPropsWithoutRef<"blockquote">)}
    >
      {inner}
    </blockquote>
  );
});

Pull.displayName = "Pull";
