/**
 * HoverCard — hover-triggered preview card molecule.
 *
 * Compound API:
 *   HoverCard.Root     — context provider; owns open/close delays.
 *   HoverCard.Trigger  — asChild slot; renders any DS component as the trigger.
 *   HoverCard.Content  — floating card surface on --bg-elevated.
 *
 * Built on @radix-ui/react-hover-card for pointer-delay management,
 * positioning, portal, and Escape dismissal.
 *
 * Runtime destructuring of Radix imports avoids a Playwright CT bundler
 * collision where Radix's internal identifiers can clash with DS names after
 * esbuild flattens the module graph. See Toast.tsx for the same pattern.
 *
 * @see meta/design/HoverCard.md
 */

import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import * as RadixHoverCardModule from "@radix-ui/react-hover-card";
import clsx from "clsx";
import styles from "./HoverCard.module.css";

// Runtime destructuring — avoids CT bundler name collisions.
const {
  Root: RadixRoot,
  Trigger: RadixTrigger,
  Portal: RadixPortal,
  Content: RadixContent,
  Arrow: RadixArrow,
} = RadixHoverCardModule;

/* ─── Types ──────────────────────────────────────────────────── */

export type HoverCardSide = "top" | "bottom" | "left" | "right";
export type HoverCardAlign = "start" | "center" | "end";
export type HoverCardWidth = "sm" | "md";

/** Props for HoverCard.Root */
export interface HoverCardRootProps {
  children: ReactNode;
  /** Delay before opening (ms). Default: 700. */
  openDelay?: number;
  /** Delay before closing (ms). Default: 300. */
  closeDelay?: number;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Open-state change handler. */
  onOpenChange?: (open: boolean) => void;
}

/** Props for HoverCard.Trigger */
export interface HoverCardTriggerProps {
  /** Renders the trigger element as-is via Radix asChild — no wrapping element. */
  children: ReactNode;
  /** Additional className for the trigger wrapper (rarely needed; asChild passes through). */
  className?: string;
}

/** Props for HoverCard.Content */
export interface HoverCardContentProps extends ComponentPropsWithoutRef<"div"> {
  /** Card width preset. `sm` = 220px, `md` = 280px. Default: "md". */
  width?: HoverCardWidth;
  /** Positioning side relative to trigger. Default: "bottom". */
  side?: HoverCardSide;
  /** Alignment relative to trigger edge. Default: "start". */
  align?: HoverCardAlign;
  /** Offset (px) from trigger. Default: 8. */
  sideOffset?: number;
  /** Show directional arrow caret. Default: true. */
  showArrow?: boolean;
  children: ReactNode;
}

/* ─── HoverCard.Root ─────────────────────────────────────────── */

function HoverCardRoot({
  children,
  openDelay = 700,
  closeDelay = 300,
  defaultOpen,
  open,
  onOpenChange,
}: HoverCardRootProps): JSX.Element {
  // Conditionally spread the optional open-state props so that `undefined`
  // is never passed under exactOptionalPropertyTypes (Radix types `open`
  // as `boolean`, not `boolean | undefined`).
  const openProps = {
    ...(defaultOpen !== undefined && { defaultOpen }),
    ...(open !== undefined && { open }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  };
  return (
    <RadixRoot openDelay={openDelay} closeDelay={closeDelay} {...openProps}>
      {children}
    </RadixRoot>
  );
}

HoverCardRoot.displayName = "HoverCard.Root";

/* ─── HoverCard.Trigger ──────────────────────────────────────── */

function HoverCardTrigger({ children, className }: HoverCardTriggerProps): JSX.Element {
  return (
    <RadixTrigger asChild className={className ?? undefined}>
      {children}
    </RadixTrigger>
  );
}

HoverCardTrigger.displayName = "HoverCard.Trigger";

/* ─── HoverCard.Content ──────────────────────────────────────── */

const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  (
    {
      children,
      width = "md",
      side = "bottom",
      align = "start",
      sideOffset = 8,
      showArrow = true,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <RadixPortal>
        <RadixContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={clsx(
            styles.content,
            // CSS modules export with camelCase keys (localsConvention:
            // camelCaseOnly), but the underlying class name still contains
            // the original kebab-case hash. Lookup via camelCase so the
            // class is actually applied; pattern assertions on the rendered
            // DOM (e.g. /width-sm/) still match the hashed class name.
            width === "sm" ? styles.widthSm : styles.widthMd,
            side === "top"
              ? styles.sideTop
              : side === "right"
                ? styles.sideRight
                : side === "left"
                  ? styles.sideLeft
                  : styles.sideBottom,
            className,
          )}
          {...rest}
        >
          {children}
          {showArrow && <RadixArrow className={styles.arrow} width={10} height={5} />}
        </RadixContent>
      </RadixPortal>
    );
  },
);

HoverCardContent.displayName = "HoverCard.Content";

/* ─── Compound export ────────────────────────────────────────── */

/**
 * HoverCard — compound component.
 *
 * Usage:
 * ```tsx
 * <HoverCard.Root>
 *   <HoverCard.Trigger><a href="/profile">Arian</a></HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <Avatar src="..." alt="Arian" size="md" />
 *     <p>Founder, Poukai</p>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
} as const;
