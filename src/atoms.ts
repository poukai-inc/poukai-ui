/**
 * @poukai-inc/ui/atoms — subpath entry.
 *
 * Tree-shakes cleaner for consumers that only need atomic primitives
 * (e.g. an internal tool that wants `Wordmark` + `Button` and nothing else).
 *
 * The flat root export (`@poukai-inc/ui`) re-exports everything from here plus
 * molecules and organisms.
 */
export { Wordmark, type WordmarkProps } from "./atoms/Wordmark";
export { StatusBadge, type StatusBadgeProps, type StatusBadgeStatus } from "./atoms/StatusBadge";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./atoms/Button";
export { Stat, type StatProps, type StatAlign, type StatSize } from "./atoms/Stat";
