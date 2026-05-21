import { forwardRef, type ComponentPropsWithoutRef, type Ref } from "react";
import clsx from "clsx";
import styles from "./Text.module.css";

export type TextSize = "body" | "lede" | "caption" | "micro";
export type TextTone = "default" | "muted" | "on-warm" | "on-warm-muted";

export interface TextProps extends Omit<ComponentPropsWithoutRef<"p">, "as"> {
  /**
   * Typographic register.
   * - `body` (default) — `--fs-body` + `--lh-body`. Standard running copy.
   * - `lede` — `--fs-body` + `--lh-body-relaxed` + `max-inline-size: 36rem`. Lede paragraph register.
   * - `caption` — `--fs-meta` + `--lh-meta`. Captions, helper text.
   * - `micro` — `--fs-micro` + `--lh-meta`. Footnote scale. **Not** uppercase — see `<Eyebrow>` for that.
   */
  size?: TextSize;
  /**
   * Color register.
   * - `default` (default) — `--fg`.
   * - `muted` — `--fg-muted`.
   * - `on-warm` — `--fg-on-warm`. For use inside the warm editorial band.
   * - `on-warm-muted` — `--fg-on-warm-muted`. Supporting text inside the warm band.
   */
  tone?: TextTone;
  /**
   * Root element. Defaults to `<p>`.
   * Closed union — no heading elements (use `<Heading>` or a semantic `<h*>` for those).
   */
  as?: "p" | "span" | "div" | "dt" | "dd" | "li";
}

const sizeClass: Record<TextSize, string> = {
  body: styles.sizeBody!,
  lede: styles.sizeLede!,
  caption: styles.sizeCaption!,
  micro: styles.sizeMicro!,
};

const toneClass: Record<TextTone, string> = {
  default: styles.toneDefault!,
  muted: styles.toneMuted!,
  "on-warm": styles.toneOnWarm!,
  "on-warm-muted": styles.toneOnWarmMuted!,
};

/**
 * Canonical paragraph atom — resolves raw `<p>`, `.lede`, and inline muted
 * `<p style>` patterns into one component with orthogonal `size` and `tone` axes.
 *
 * @example
 *   <Text>Standard paragraph.</Text>
 *   <Text size="lede" tone="muted">Lede paragraph after a heading.</Text>
 *   <Text size="caption" tone="muted">Caption beneath an image.</Text>
 *   <Text as="span">Inline body fragment.</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { size = "body", tone = "default", as: As = "p", className, children, ...rest },
  ref,
) {
  const rootClassName = clsx(styles.root, sizeClass[size], toneClass[tone], className);

  switch (As) {
    case "span":
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"span">)}
        >
          {children}
        </span>
      );
    case "div":
      return (
        <div
          ref={ref as Ref<HTMLDivElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"div">)}
        >
          {children}
        </div>
      );
    case "dt":
      return (
        <dt
          ref={ref as Ref<HTMLElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"dt">)}
        >
          {children}
        </dt>
      );
    case "dd":
      return (
        <dd
          ref={ref as Ref<HTMLElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"dd">)}
        >
          {children}
        </dd>
      );
    case "li":
      return (
        <li
          ref={ref as Ref<HTMLLIElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"li">)}
        >
          {children}
        </li>
      );
    default:
      return (
        <p
          ref={ref as Ref<HTMLParagraphElement>}
          className={rootClassName}
          {...(rest as ComponentPropsWithoutRef<"p">)}
        >
          {children}
        </p>
      );
  }
});

Text.displayName = "Text";
