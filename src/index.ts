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
export { Tag, type TagProps } from "./atoms/Tag";
export {
  Avatar,
  type AvatarProps,
  type AvatarSize,
  type AvatarShape,
  type AvatarImageProps,
  type AvatarInitialsProps,
  type AvatarEmptyProps,
  type AvatarModeProps,
  type AvatarBaseProps,
} from "./atoms/Avatar";
export { VisuallyHidden, type VisuallyHiddenProps } from "./atoms/VisuallyHidden";
export { Skeleton, type SkeletonProps, type SkeletonRadius } from "./atoms/Skeleton";
export { Icon, type IconProps, type IconSize } from "./atoms/Icon";
export { Link, type LinkProps, type LinkVariant } from "./atoms/Link";
export {
  Divider,
  type DividerProps,
  type DividerOrientation,
  type DividerTone,
} from "./atoms/Divider";
export { Spinner, type SpinnerProps, type SpinnerSize } from "./atoms/Spinner";
export { Heading, type HeadingProps, type HeadingLevel } from "./atoms/Heading";
export { Prose, type ProseProps, type ProseWidth } from "./atoms/Prose";
export { Code, type CodeProps } from "./atoms/Code";
export { Kbd, type KbdProps } from "./atoms/Kbd";
export { Image, type ImageProps, type ImageFit, type ImageRadius } from "./atoms/Image";
export { Logo, type LogoProps, type LogoTone, type LogoSize } from "./atoms/Logo";
export { Mark, type MarkProps } from "./atoms/Mark";
export { Text, type TextProps, type TextSize, type TextTone } from "./atoms/Text";
export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
} from "./atoms/IconButton";
export { Checkbox, type CheckboxProps, type CheckboxCheckedState } from "./atoms/Checkbox";
export { Switch, type SwitchProps } from "./atoms/Switch";
export { Label, type LabelProps, type LabelTone } from "./atoms/Label";
export { SkipLink, type SkipLinkProps } from "./atoms/SkipLink";
export {
  NumberFormat,
  type NumberFormatProps,
  type NumberFormatNotation,
  type NumberFormatAs,
} from "./atoms/NumberFormat";
export { Time, type TimeProps, type TimeFormat } from "./atoms/Time";
export {
  Spacer,
  type SpacerProps,
  type SpacerSize,
  type SpacerAxis,
  type SpacerAs,
} from "./atoms/Spacer";

export {
  ProgressBar,
  type ProgressBarProps,
  type ProgressBarSize,
  type ProgressBarTone,
} from "./atoms/ProgressBar";
export { Input, type InputProps, type InputSize } from "./atoms/Input";
export { Select, type SelectProps, type SelectSize } from "./atoms/Select";

export { Textarea, type TextareaProps, type TextareaResize } from "./atoms/Textarea";
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from "./atoms/Radio";

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
export { FieldNote, type FieldNoteProps } from "./molecules/FieldNote";
export { Quote, type QuoteProps } from "./molecules/Quote";
export { Field, type FieldProps } from "./molecules/Field";
export { useFieldErrors, type FieldErrors } from "./molecules/Field";
export { Banner, type BannerProps, type BannerTone } from "./molecules/Banner";
export { Byline, type BylineProps } from "./molecules/Byline/index.js";
export { TagList, type TagListProps } from "./molecules/TagList/index.js";

/* ---------- organisms ---------- */
export { SiteShell, type SiteShellProps, type SiteShellRoute } from "./organisms/SiteShell";
export { Footer, type FooterProps, type FooterLink } from "./organisms/Footer";
export {
  Dialog,
  DialogBasic,
  type DialogRootProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
  type DialogBasicProps,
} from "./organisms/Dialog";
export {
  Tabs,
  TabsBasic,
  type TabsRootProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
  type TabsBasicProps,
  type TabItem,
} from "./organisms/Tabs";
export { Form, type FormProps } from "./organisms/Form";
export {
  ToastProvider,
  useToast,
  type ToastProviderProps,
  type ToastPayload,
  type ToastTone,
} from "./organisms/Toast";
