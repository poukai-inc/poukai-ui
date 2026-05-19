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
export { Eyebrow, type EyebrowProps, type EyebrowVariant } from "./atoms/Eyebrow";
export { EmailLink, type EmailLinkProps, type EmailLinkVariant } from "./atoms/EmailLink";

/* ---------- molecules ---------- */
export {
  Hero,
  type HeroProps,
  type HeroDefaultProps,
  type HeroNoTitleProps,
  type HeroAlign,
  type HeroSize,
  type HeroEntrance,
  type HeroVariant,
  type HeroBleed,
} from "./molecules/Hero";
export { RoleCard, type RoleCardProps } from "./molecules/RoleCard";
export { Principle, type PrincipleProps } from "./molecules/Principle";
export { FailureMode, type FailureModeProps } from "./molecules/FailureMode";
export { Statement, type StatementProps } from "./molecules/Statement";
export { Portrait, type PortraitProps, type AspectRatio } from "./molecules/Portrait";
export { Section, type SectionProps } from "./molecules/Section";
export { Pull, type PullProps } from "./molecules/Pull";
export { LinkCard, type LinkCardProps, type LinkCardVariant } from "./molecules/LinkCard";
export { TeamCard, type TeamCardProps } from "./molecules/TeamCard";
export { FeatureCard, type FeatureCardProps } from "./molecules/FeatureCard";

/* ---------- organisms ---------- */
export { SiteShell, type SiteShellProps, type SiteShellRoute } from "./organisms/SiteShell";
