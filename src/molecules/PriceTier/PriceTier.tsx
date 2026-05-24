<<<<<<< HEAD
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
=======
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./PriceTier.module.css";

export interface PriceTierProps extends ComponentPropsWithoutRef<"article"> {
  /**
   * Plan name — required. Rendered as an h3 inside the card.
   * Provide a descriptive name so screen readers can distinguish cards.
   */
  name: ReactNode;
  /**
   * Price display — required. Typically a formatted numeral, e.g. `"$49"`.
   * Rendered in the editorial serif at --fs-stat scale.
   */
  price: ReactNode;
  /**
   * Billing cadence label — rendered below the price at --fs-meta.
   * e.g. `"per month"`, `"billed annually"`.
   */
  cadence?: ReactNode;
  /**
   * Short supporting description below the cadence label.
   * String values are auto-wrapped in a `<p>`.
   */
  description?: ReactNode;
  /**
   * Feature bullet list — accepts an array of ReactNode items or any ReactNode.
   * Array items are wrapped in `<ul><li>` markup for screen readers.
   */
  features?: ReactNode[] | ReactNode;
  /**
   * CTA slot — typically a `<Button>`. Rendered at the bottom of the card.
   * For a11y: the Button's accessible name should be tier-specific,
   * e.g. `"Get started with Pro"` not just `"Get started"`.
   */
  cta?: ReactNode;
  /**
   * Visually elevates this tier as the recommended/featured plan.
   * Applies `--bg-elevated` surface, `--accent` border, and a subtle entrance
   * animation on page load. Featured tier hover lift is suppressed.
   */
  featured?: boolean;
}

/**
 * Pricing tier card molecule.
 *
 * Presents a single pricing plan: name, price, cadence, description, feature
 * bullets, and CTA. Composes into `PricingTable` organism.
 *
 * Featured tiers receive visual elevation (`--bg-elevated` + `--accent` border)
 * and a subtle entrance animation. Non-featured tiers lift slightly on hover.
 *
 * @example Standard tier
 *   <PriceTier
 *     name="Starter"
 *     price="$0"
 *     cadence="free forever"
 *     features={["5 projects", "Community support"]}
 *     cta={<Button variant="secondary" asChild><a href="/signup">Get started with Starter</a></Button>}
 *   />
 *
 * @example Featured tier
 *   <PriceTier
 *     featured
 *     name="Pro"
 *     price="$49"
 *     cadence="per month"
 *     features={["Unlimited projects", "Priority support", "Custom domain"]}
 *     cta={<Button asChild><a href="/signup/pro">Get started with Pro</a></Button>}
 *   />
 */
export const PriceTier = forwardRef<HTMLElement, PriceTierProps>(function PriceTier(
  { name, price, cadence, description, features, cta, featured = false, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  const rootClassName = clsx(styles.root, featured && styles.featured, className);

  const featuresNode = Array.isArray(features) ? (
    <ul className={styles.featureList}>
      {features.map((item, i) => (
        <li key={i} className={styles.featureItem}>
          {item}
        </li>
      ))}
    </ul>
  ) : features !== undefined ? (
    <div className={styles.featureList}>{features}</div>
  ) : null;

  const descriptionNode =
    description === undefined ? null : typeof description === "string" ? (
      <p className={styles.description}>{description}</p>
    ) : (
      description
    );

  return (
    <article
      ref={ref}
      className={rootClassName}
      aria-labelledby={titleId}
      {...(rest as ComponentPropsWithoutRef<"article">)}
    >
      {featured && <span className={styles.featuredLabel}>Recommended</span>}
      <h3 id={titleId} className={styles.name}>
        {name}
      </h3>
      <div className={styles.priceBlock}>
        <span className={styles.price}>{price}</span>
        {cadence !== undefined && <span className={styles.cadence}>{cadence}</span>}
      </div>
      {descriptionNode}
      {featuresNode !== null && <div className={styles.features}>{featuresNode}</div>}
      {cta !== undefined && <div className={styles.cta}>{cta}</div>}
>>>>>>> 2472d7f (feat(organism): add PricingTable — PriceTier grid)
    </article>
  );
});

PriceTier.displayName = "PriceTier";
