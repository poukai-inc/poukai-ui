import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import clsx from "clsx";
import { Eyebrow } from "../../atoms/Eyebrow";
import styles from "./LinkCard.module.css";

export type LinkCardVariant = "default" | "quiet";

export interface LinkCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  /** Navigation destination. Required when `asChild` is false. */
  href?: string;
  /**
   * Render as a child element (e.g. a framework router `<Link>`).
   * Radix Slot composition — identical to the `Button` `asChild` pattern.
   */
  asChild?: boolean;
  /**
   * Category label above the title.
   * String → auto-wrapped in `<Eyebrow variant="muted">`.
   * ReactNode → rendered as-is.
   */
  eyebrow?: string | ReactNode;
  /** Required. The card's primary content and accessible name anchor. */
  title: ReactNode;
  /**
   * Heading element for the title. Default `"h3"`.
   * Override with `"h2"` when no preceding `<h2>` exists in the section,
   * or `"h4"` for deeply nested contexts.
   */
  titleAs?: "h2" | "h3" | "h4";
  /**
   * Supporting copy below the title.
   * String → auto-wrapped in `<p>`.
   * ReactNode → rendered as-is.
   */
  body?: ReactNode;
  /**
   * Footer strip, pushed to card bottom via flex spacer.
   * Intended use: "Read more →", tag list, date string.
   * ReactNode pass-through — no DS styling enforced.
   */
  footer?: ReactNode;
  /**
   * Icon at top-right corner of card. Absolutely positioned within padding box.
   * Consumer-supplied ReactNode. Conventional: `<ArrowUpRight size={16} />`.
   */
  icon?: ReactNode;
  /**
   * When true: adds `target="_blank"`, `rel="noopener noreferrer"`, and a
   * visually-hidden `<span>(opens in new tab)</span>` for screen readers.
   * Does NOT auto-inject an icon — pass via `icon` slot.
   */
  external?: boolean;
  /** Visual treatment variant. Default `"default"`. */
  variant?: LinkCardVariant;
}

/**
 * Canonical interactive card primitive. The entire card surface is a single
 * click target that routes the user.
 *
 * Use `asChild` to swap the root `<a>` for a framework router `<Link>`:
 * ```tsx
 * <LinkCard asChild title="Case study"><Link href="/work/case">...</Link></LinkCard>
 * ```
 *
 * Do NOT nest interactive elements (`<button>`, `<a>`) inside a LinkCard —
 * nested interactivity is a WCAG failure. Use plain `<span>` for any inline
 * labels or tags in the footer slot.
 *
 * @example Default
 *   <LinkCard href="/work/case" eyebrow="Design" title="Redesigning onboarding">
 *     <p>A three-month engagement...</p>
 *   </LinkCard>
 *
 * @example External
 *   <LinkCard href="https://example.com" external icon={<ArrowUpRight size={16} />} title="External resource" />
 *
 * @example Quiet list variant
 *   <LinkCard variant="quiet" href="/posts/1" title="Post title" />
 */
export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(function LinkCard(
  {
    href,
    asChild = false,
    eyebrow,
    title,
    titleAs = "h3",
    body,
    footer,
    icon,
    external = false,
    variant = "default",
    className,
    children,
    ...rest
  },
  ref,
) {
  // Dev warnings (Vite: import.meta.env.DEV is tree-shaken to false in production builds)
  if (import.meta.env.DEV) {
    if (!asChild && !href) {
      console.error(
        "[LinkCard] href is required when asChild is false. Provide an href or set asChild={true} and pass a framework Link as the child.",
      );
    }
    if (asChild && href) {
      console.error(
        "[LinkCard] Do not pass both href and asChild={true}. When asChild is true, the child element owns the href.",
      );
    }
  }

  const rootClassName = clsx(
    styles.root,
    variant === "quiet" ? styles.variantQuiet : styles.variantDefault,
    className,
  );

  // Eyebrow: string → auto-wrap; ReactNode → pass-through
  const eyebrowNode =
    eyebrow === undefined ? null : typeof eyebrow === "string" ? (
      <Eyebrow variant="muted">{eyebrow}</Eyebrow>
    ) : (
      eyebrow
    );

  // Title element
  const TitleTag = titleAs;

  // Body: string → wrap in <p>; ReactNode → pass-through
  const bodyNode =
    body === undefined ? null : typeof body === "string" ? (
      <p className={styles.body}>{body}</p>
    ) : (
      <div className={styles.body}>{body}</div>
    );

  const anchorProps = {
    href,
    ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  };

  const cardContent = (
    <>
      {icon !== undefined && (
        <div className={styles.iconSlot} aria-hidden="true">
          {icon}
        </div>
      )}

      <div className={styles.header}>
        {eyebrowNode !== null && <div className={styles.eyebrowSlot}>{eyebrowNode}</div>}
        <TitleTag className={styles.title}>{title}</TitleTag>
      </div>

      {bodyNode}

      {footer !== undefined && (
        <>
          <div className={styles.spacer} aria-hidden="true" />
          <div className={styles.footer}>{footer}</div>
        </>
      )}

      {external && <span className={styles.srOnly}>(opens in new tab)</span>}
    </>
  );

  if (asChild) {
    return (
      <Slot ref={ref} className={rootClassName} {...rest}>
        <Slottable>{children}</Slottable>
        {cardContent}
      </Slot>
    );
  }

  return (
    <a ref={ref} className={rootClassName} {...anchorProps} {...rest}>
      {cardContent}
    </a>
  );
});

LinkCard.displayName = "LinkCard";
