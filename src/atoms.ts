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
export { Text, type TextProps, type TextSize, type TextTone } from "./atoms/Text";
export {
  IconButton,
  type IconButtonProps,
  type IconButtonVariant,
  type IconButtonSize,
} from "./atoms/IconButton";
export { Label, type LabelProps, type LabelTone } from "./atoms/Label";
