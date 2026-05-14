/**
 * @poukai-inc/ui -- Poukai design system component library.
 *
 * Atomic-Design taxonomy:
 *   tokens/     -- single source of truth for color, type, spacing, motion
 *   atoms/      -- one job, no children of their own
 *   molecules/  -- atoms composed into a self-contained unit of meaning
 *   organisms/  -- molecules + layout intent; may know about page chrome
 *
 * Templates and pages live in the consuming repo, not here.
 *
 * Consume tokens by importing the stylesheet once at your app root:
 *   import "@poukai-inc/ui/tokens.css";
 */

/* ---------- atoms ---------- */
export { Wordmark, type WordmarkProps } from "./atoms/Wordmark";
export { StatusBadge, type StatusBadgeProps, type StatusBadgeStatus } from "./atoms/StatusBadge";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./atoms/Button";
export { Stat, type StatProps, type StatAlign, type StatSize } from "./atoms/Stat";

/* ---------- molecules ---------- */
export { Hero, type HeroProps, type HeroAlign } from "./molecules/Hero";
export { RoleCard, type RoleCardProps } from "./molecules/RoleCard";
export { Principle, type PrincipleProps } from "./molecules/Principle";
export { FailureMode, type FailureModeProps } from "./molecules/FailureMode";

/* ---------- organisms ---------- */
export { SiteShell, type SiteShellProps, type SiteShellRoute } from "./organisms/SiteShell";
