import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Avatar.module.css";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";

/** Image mode — renders a real <img> with src + alt. */
export interface AvatarImageProps {
  mode: "image";
  /** Image source URL. */
  src: string;
  /**
   * Alt text for the image.
   * When provided, the <img> is labelled by this string.
   * When omitted, you must supply `name` so the avatar has an accessible label.
   */
  alt?: string;
}

/** Initials mode — renders a text label inside the avatar. */
export interface AvatarInitialsProps {
  mode: "initials";
  /** 1–2 character initials to display. Consumer responsibility — Avatar does not derive from a name string. */
  initials: string;
}

/** Empty / placeholder mode — renders a blank avatar. */
export interface AvatarEmptyProps {
  mode?: "empty";
}

export type AvatarModeProps = AvatarImageProps | AvatarInitialsProps | AvatarEmptyProps;

/** Shared props across all modes. */
export interface AvatarBaseProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** Visual size. sm=24px, md=32px (default), lg=40px. */
  size?: AvatarSize;
  /** Circle (default) or square (rounded-square). */
  shape?: AvatarShape;
  /**
   * Accessible name for the avatar as a whole.
   * Required in image mode when `alt` is omitted, and in initials/empty modes.
   * Produces `role="img"` + `aria-label` on the root span.
   */
  name?: string;
}

export type AvatarProps = AvatarBaseProps & AvatarModeProps;

const sizeClass: Record<AvatarSize, string> = {
  sm: styles.sizeSm!,
  md: styles.sizeMd!,
  lg: styles.sizeLg!,
};

const shapeClass: Record<AvatarShape, string> = {
  circle: styles.shapeCircle!,
  square: styles.shapeSquare!,
};

/** Keys that must not be forwarded to the root <span>. */
const AVATAR_OWN_KEYS = new Set([
  "mode",
  "size",
  "shape",
  "name",
  "className",
  "src",
  "alt",
  "initials",
]);

/** Return only the props that are safe to spread onto a <span>. */
function getSpanRest(props: AvatarProps): ComponentPropsWithoutRef<"span"> {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !AVATAR_OWN_KEYS.has(key)),
  ) as ComponentPropsWithoutRef<"span">;
}

/**
 * Avatar atom — displays a person/entity as an image, initials, or placeholder.
 *
 * Three modes via discriminated union on the `mode` prop:
 *   - `mode="image"` — renders `<img>` with `src` and optional `alt`.
 *   - `mode="initials"` — renders 1–2 character text label.
 *   - `mode="empty"` (default) — blank placeholder.
 *
 * Non-polymorphic. Root is always `<span>`. Ref forwarded to the root span.
 *
 * @example
 *   // Image
 *   <Avatar mode="image" src="/arian.jpg" alt="Arian Zargaran" size="lg" />
 *
 *   // Initials
 *   <Avatar mode="initials" initials="AZ" name="Arian Zargaran" />
 *
 *   // Empty
 *   <Avatar name="Unknown person" />
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  const { size = "md", shape = "circle", name, className } = props;
  const spanRest = getSpanRest(props);

  const mode = (props as { mode?: string }).mode ?? "empty";

  let inner: React.ReactNode = null;
  let rootRole: string | undefined;
  let rootAriaLabel: string | undefined;

  if (mode === "image") {
    const { src, alt } = props as AvatarImageProps;
    if (alt) {
      // <img> carries the accessible label — root span is presentational.
      inner = <img src={src} alt={alt} loading="lazy" className={styles.img} />;
    } else {
      // No alt — root span carries role + aria-label from name prop.
      rootRole = name ? "img" : undefined;
      rootAriaLabel = name ?? undefined;
      inner = <img src={src} alt="" loading="lazy" className={styles.img} aria-hidden={true} />;
    }
  } else if (mode === "initials") {
    const { initials } = props as AvatarInitialsProps;
    rootRole = name ? "img" : undefined;
    rootAriaLabel = name ?? undefined;
    inner = (
      <span className={styles.initials} aria-hidden="true">
        {initials}
      </span>
    );
  } else {
    // empty mode
    rootRole = name ? "img" : undefined;
    rootAriaLabel = name ?? undefined;
  }

  return (
    <span
      ref={ref}
      className={clsx(styles.root, sizeClass[size], shapeClass[shape], className)}
      role={rootRole}
      aria-label={rootAriaLabel}
      {...spanRest}
    >
      {inner}
    </span>
  );
});

Avatar.displayName = "Avatar";
