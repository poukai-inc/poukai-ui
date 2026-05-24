import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./PriceTier.module.css";

export interface PriceTierProps extends HTMLAttributes<HTMLElement> {
  /** Tier label — rendered as an `<h3>`. Required. */
  name: string;
  /** Displayed at stat scale; e.g. `"$29"`, `"Free"`, `"Custom"`. Required. */
  price: string;
  /**
   * Period label below the price; e.g. `"month"`, `"year"`.
   * Omit for free or custom tiers.
   */
  per?: string;
  /** Feature list rendered as `<ul>` items. */
  bullets?: string[];
  /**
   * Leading icon per bullet; typically a lucide check icon.
   * When absent, the native list marker is shown.
   */
  bulletIcon?: ReactNode;
  /** CTA button slot — renders full-width at card bottom. Required. */
  cta: ReactNode;
  /**
   * Elevates the card to `--bg-elevated` surface and shows a badge above
   * the tier name. Default `false`.
   */
  featured?: boolean;
  /**
   * Badge text shown when `featured` is `true`.
   * Default `"Recommended"`.
   */
  featuredLabel?: string;
}

/**
 * PriceTier — single pricing-plan card molecule.
 *
 * Presents one pricing tier: optional featured badge, tier name, price with
 * optional period label, feature bullet list, and a CTA slot. Designed to
 * live inside a `PricingTable` organism grid — do not render at full-page
 * width in isolation.
 *
 * Root element is `<article>` with `aria-label` derived from `name`.
 *
 * @example Default tier
 *   <PriceTier
 *     name="Starter"
 *     price="$0"
 *     bullets={["5 projects", "1 GB storage"]}
 *     cta={<Button variant="secondary" size="md">Get started</Button>}
 *   />
 *
 * @example Featured (recommended) tier
 *   <PriceTier
 *     featured
 *     name="Pro"
 *     price="$29"
 *     per="month"
 *     bullets={["Unlimited projects", "100 GB storage", "Priority support"]}
 *     cta={<Button variant="primary" size="md">Start free trial</Button>}
 *   />
 */
export const PriceTier = forwardRef<HTMLElement, PriceTierProps>(function PriceTier(
  {
    name,
    price,
    per,
    bullets = [],
    bulletIcon,
    cta,
    featured = false,
    featuredLabel = "Recommended",
    className,
    ...rest
  },
  ref,
) {
  return (
    <article
      ref={ref}
      aria-label={`${name} plan`}
      className={clsx(styles.root, featured && styles.featured, className)}
      {...rest}
    >
      {featured && (
        <p className={styles.badge} aria-label={featuredLabel}>
          {featuredLabel}
        </p>
      )}

      <h3 className={styles.name}>{name}</h3>

      <div className={styles.priceBlock}>
        <span className={styles.priceNumeral}>{price}</span>
        {per !== undefined && <span className={styles.pricePer}>/ {per}</span>}
      </div>

      <hr className={styles.divider} />

      {bullets.length > 0 && (
        <ul className={styles.bulletList}>
          {bullets.map((bullet, i) => (
            <li key={i} className={styles.bulletItem}>
              {bulletIcon !== undefined && (
                <span className={styles.bulletIconSlot} aria-hidden="true">
                  {bulletIcon}
                </span>
              )}
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.ctaSlot}>{cta}</div>
    </article>
  );
});

PriceTier.displayName = "PriceTier";
