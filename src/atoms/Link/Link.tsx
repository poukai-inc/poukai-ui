import { forwardRef, type AnchorHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import styles from "./Link.module.css";

export type LinkVariant = "default" | "quiet" | "muted-link";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Destination URL. Required — a link without an href is not a link. */
  href: string;
  /**
   * Visual register.
   * - `default` (default) — two-layer underline; hairline at rest, accent grows on hover.
   * - `quiet` — underline on hover only; no hairline at rest.
   * - `muted-link` — `--fg-muted` color, plain color transition; no underline layers.
   */
  variant?: LinkVariant;
  /**
   * Render DS styles on a child element (e.g. a Next.js or Remix `<Link>`).
   * When `true`, renders a Radix `<Slot>` and merges all props onto the single child.
   * The consumer is responsible for passing exactly one child.
   */
  asChild?: boolean;
}

const variantClass: Record<LinkVariant, string> = {
  default: styles.default!,
  quiet: styles.quiet!,
  "muted-link": styles.mutedLink!,
};

/**
 * Canonical styled anchor atom.
 *
 * Renders a plain `<a href>` with the DS underline contract.
 * Use `asChild` to compose with a framework router Link (Next.js, Remix, etc.).
 *
 * External-link security: if `target="_blank"` is set and no explicit `rel` is
 * provided, `rel="noopener noreferrer"` is applied automatically.
 *
 * @example
 *   <Link href="/about">About</Link>
 *   <Link href="/about" variant="quiet">About</Link>
 *   <Link href="mailto:hello@pouk.ai" variant="muted-link">hello@pouk.ai</Link>
 *   <Link href="/about" asChild><NextLink href="/about">About</NextLink></Link>
 *   <Link href="https://example.com" target="_blank">External</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, variant = "default", asChild = false, className, target, rel, ...rest },
  ref,
) {
  // Auto-apply rel="noopener noreferrer" when target="_blank" and consumer
  // hasn't provided an explicit rel value.
  const resolvedRel = target === "_blank" && rel === undefined ? "noopener noreferrer" : rel;

  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      href={href}
      target={target}
      rel={resolvedRel}
      className={clsx(styles.root, variantClass[variant], className)}
      {...rest}
    />
  );
});

Link.displayName = "Link";
