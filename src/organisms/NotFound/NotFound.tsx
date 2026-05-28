import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { SiteShell } from "../SiteShell";
import { Button } from "../../atoms/Button";
import styles from "./NotFound.module.css";

export interface NotFoundSuggestion {
  label: string;
  href: string;
}

export interface NotFoundProps extends ComponentPropsWithoutRef<"div"> {
  /** Where the "Go home" CTA and the SiteShell wordmark link both point. Default: `"/"`. */
  homeHref?: string;
  /** The `<h1>` text. Default: `"Page not found."`. */
  headline?: string;
  /** Supporting sentence below the headline. Default: `"The page you're looking for doesn't exist or has been moved."`. */
  description?: string;
  /** Optional list of suggestion links rendered above the home CTA. Default: `[]`. */
  suggestions?: NotFoundSuggestion[];
  /** Label on the home CTA button. Default: `"Go home"`. */
  homeLabel?: string;
}

/**
 * Shared 404 page organism for all pouk.ai surfaces.
 *
 * Composes a chrome-less `SiteShell` (wordmark-only header, no nav, no footer)
 * with a centered 404 content column. RSC-safe: no `'use client'`, no state,
 * no effects.
 *
 * Consumers render `<NotFound />` as the entire page output — not inside an
 * existing `SiteShell`. Wrapping in a second `SiteShell` produces nested
 * landmark elements, which is a structural and accessibility error.
 *
 * @example
 *   <NotFound />
 *
 * @example
 *   <NotFound
 *     headline="This role doesn't exist."
 *     description="The URL may have changed or this role was removed."
 *     homeHref="/roles"
 *     homeLabel="Back to roles"
 *     suggestions={[{ label: "Home", href: "/" }, { label: "Why AI", href: "/why-ai" }]}
 *   />
 */
export const NotFound = forwardRef<HTMLDivElement, NotFoundProps>(function NotFound(
  {
    homeHref = "/",
    headline = "Page not found.",
    description = "The page you're looking for doesn't exist or has been moved.",
    suggestions = [],
    homeLabel = "Go home",
    className,
    ...rest
  },
  ref,
) {
  const hasSuggestions = suggestions.length > 0;

  return (
    <SiteShell ref={ref} routes={[]} homeHref={homeHref} className={clsx(className)} {...rest}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.description}>{description}</p>
        {hasSuggestions ? (
          <ul className={styles.suggestions}>
            {suggestions.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        ) : null}
        <div className={hasSuggestions ? styles.cta : styles.ctaNoSuggestions}>
          <Button variant="primary" size="md" asChild>
            <a href={homeHref}>{homeLabel}</a>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
});

NotFound.displayName = "NotFound";
