import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "../../atoms/Heading/Heading";
import { Link } from "../../atoms/Link/Link";
import { VisuallyHidden } from "../../atoms/VisuallyHidden/VisuallyHidden";
import styles from "./LinkList.module.css";

/* ---------- Types ---------- */

export type LinkListSize = "sm" | "md";

export interface LinkListProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional column heading. Accepts a string or ReactNode.
   * Rendered via the `Heading` atom at `headingLevel` (default h3).
   */
  heading?: string | ReactNode;
  /**
   * Semantic level for the heading element.
   * Default: 3 (h3).
   */
  headingLevel?: 2 | 3 | 4;
  /**
   * Visual size register.
   * - `"sm"` (default): --fs-meta (14px) — footer columns, sidebar nav.
   * - `"md"`: --fs-body — TOC or reading-flow link lists.
   */
  size?: LinkListSize;
  /**
   * Renders a --hairline rule below the heading when true.
   * Default: false. Requires `heading` to be provided to be visible.
   */
  divider?: boolean;
  /** List items — should be `<LinkList.Item>` elements. */
  children: ReactNode;
}

export interface LinkListItemProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  /** Destination URL. Required. */
  href: string;
  /**
   * When true: adds target="_blank" + rel="noopener noreferrer" and appends a
   * visually-hidden "(opens in new tab)" text for screen readers.
   */
  external?: boolean;
  /**
   * Marks the current/active item with aria-current="page".
   * Renders at --fg color at rest (no muting — "already arrived").
   */
  current?: boolean;
  /**
   * Optional trailing icon slot. Consumer passes a ReactNode (e.g. a Lucide icon).
   * Used for ArrowUpRight on external links, or active-section markers.
   */
  icon?: ReactNode;
  /** Link label. */
  children: ReactNode;
}

/* ---------- LinkList.Item ---------- */

const LinkListItem = forwardRef<HTMLLIElement, LinkListItemProps>(function LinkListItem(
  { href, external = false, current = false, icon, className, children, ...rest },
  ref,
) {
  const rel = external ? "noopener noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <li ref={ref} className={clsx(styles.item, className)}>
      <Link
        href={href}
        variant="muted-link"
        target={target}
        rel={rel}
        aria-current={current ? "page" : undefined}
        className={clsx(styles.itemLink, current && styles.itemCurrent)}
        {...rest}
      >
        <span className={styles.itemLabel}>{children}</span>
        {external && <VisuallyHidden> (opens in new tab)</VisuallyHidden>}
        {(icon !== undefined || external) && (
          <span className={styles.itemIcon} aria-hidden="true">
            {icon !== undefined ? (
              icon
            ) : (
              /* Default ArrowUpRight for external links */
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            )}
          </span>
        )}
      </Link>
    </li>
  );
});

LinkListItem.displayName = "LinkList.Item";

/* ---------- LinkList ---------- */

const LinkListRoot = forwardRef<HTMLDivElement, LinkListProps>(function LinkList(
  { heading, headingLevel = 3, size = "sm", divider = false, className, children, ...rest },
  ref,
) {
  const headingAs = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <div ref={ref} className={clsx(styles.root, styles[size], className)} {...rest}>
      {heading !== undefined && (
        <div className={clsx(styles.headingWrapper, divider && styles.divider)}>
          <Heading as={headingAs} size={headingAs} className={styles.heading}>
            {heading}
          </Heading>
        </div>
      )}
      <ul className={styles.list}>{children}</ul>
    </div>
  );
});

LinkListRoot.displayName = "LinkList";

/* ---------- Compound export ---------- */

export const LinkList = Object.assign(LinkListRoot, {
  Item: LinkListItem,
});

export type { LinkListItemProps as LinkListItem };
