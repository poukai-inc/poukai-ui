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
    </article>
  );
});

PriceTier.displayName = "PriceTier";
