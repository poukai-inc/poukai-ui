/**
 * Tooltip — hover-hint atom.
 *
 * Architecture:
 *   TooltipProvider  — wrap the app root once; controls global delayDuration.
 *   Tooltip          — convenience single-component form: <Tooltip content="…"><trigger /></Tooltip>
 *   Tooltip.Root     — Radix Tooltip.Root (open/closed state).
 *   Tooltip.Trigger  — Radix Tooltip.Trigger, always asChild.
 *   Tooltip.Content  — floating panel; portalled above all layers.
 *
 * Built on @radix-ui/react-tooltip for portal rendering, positioning,
 * delay, and keyboard semantics (focus opens, Escape closes).
 *
 * @see meta/design/Tooltip.md
 */

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";
// Runtime destructuring — same pattern as Toast — to avoid a Playwright CT
// bundler collision where `TooltipProvider` would shadow Radix's internal name.
import * as RadixTooltipModule from "@radix-ui/react-tooltip";
const {
  Provider: RadixTooltipProvider,
  Root: RadixTooltipRoot,
  Trigger: RadixTooltipTrigger,
  Portal: RadixTooltipPortal,
  Content: RadixTooltipContent,
} = RadixTooltipModule;
import clsx from "clsx";
import styles from "./Tooltip.module.css";

/* ─── Types ──────────────────────────────────────────────────── */

export interface TooltipProviderProps {
  children: ReactNode;
  /** Global open delay in ms. Default: 700. */
  delayDuration?: number;
  /** Skip delay when moving between tooltips. Default: 300. */
  skipDelayDuration?: number;
}

export interface TooltipRootProps {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean | undefined;
  /** Uncontrolled initial state. Default: false. */
  defaultOpen?: boolean | undefined;
  /** Open-state callback. */
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** ms before tooltip opens on hover. Default: 700. */
  delayDuration?: number | undefined;
}

export interface TooltipTriggerProps {
  children: ReactNode;
  /** Extra class forwarded to the trigger wrapper (asChild — no DOM node added). */
  className?: string;
}

export type TooltipContentProps = Omit<
  ComponentPropsWithoutRef<typeof RadixTooltipContent>,
  "asChild"
> & {
  /** Preferred placement. Default: "top". */
  side?: "top" | "right" | "bottom" | "left";
  /** px gap between trigger and panel. Default: 6. */
  sideOffset?: number;
};

/** Convenience shorthand form: <Tooltip content="label"><trigger /></Tooltip> */
export interface TooltipProps {
  /** The trigger element. */
  children: ReactNode;
  /** Label text shown in the floating panel. Required for shorthand form. */
  content: ReactNode;
  /** Preferred placement. Default: "top". */
  side?: "top" | "right" | "bottom" | "left" | undefined;
  /** px gap between trigger and panel. Default: 6. */
  sideOffset?: number | undefined;
  /** ms before tooltip opens on hover. Default: 700. */
  delayDuration?: number | undefined;
  /** Controlled open state. */
  open?: boolean | undefined;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean | undefined;
  /** Open-state callback. */
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/* ─── TooltipProvider ────────────────────────────────────────── */

/**
 * TooltipProvider — wrap the app root once.
 * Controls global delayDuration and skipDelayDuration across all tooltips.
 *
 * Named PoukaiTooltipProvider internally to avoid collision with Radix's
 * own `TooltipProvider` identifier once esbuild flattens the bundle.
 */
function PoukaiTooltipProvider({
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
}: TooltipProviderProps): JSX.Element {
  return (
    <RadixTooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      {children}
    </RadixTooltipProvider>
  );
}

PoukaiTooltipProvider.displayName = "TooltipProvider";

/* ─── Compound sub-components ────────────────────────────────── */

/**
 * Tooltip.Root — manages open/closed state.
 * Accepts all Radix Tooltip.Root props except asChild.
 */
function TooltipRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
}: TooltipRootProps): JSX.Element {
  return (
    <RadixTooltipRoot
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(delayDuration !== undefined ? { delayDuration } : {})}
    >
      {children}
    </RadixTooltipRoot>
  );
}

TooltipRoot.displayName = "Tooltip.Root";

/**
 * Tooltip.Trigger — always rendered asChild so it composes onto the consumer
 * element without adding an extra DOM node.
 */
function TooltipTrigger({ children }: TooltipTriggerProps): JSX.Element {
  return <RadixTooltipTrigger asChild>{children}</RadixTooltipTrigger>;
}

TooltipTrigger.displayName = "Tooltip.Trigger";

/**
 * Tooltip.Content — floating panel. Radix portals it above all other layers
 * and assigns role="tooltip" + wires aria-describedby automatically.
 */
const TooltipContent = forwardRef<ElementRef<typeof RadixTooltipContent>, TooltipContentProps>(
  function TooltipContent({ children, className, side = "top", sideOffset = 6, ...rest }, ref) {
    return (
      <RadixTooltipPortal>
        <RadixTooltipContent
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          className={clsx(styles.content, className)}
          {...rest}
        >
          {children}
        </RadixTooltipContent>
      </RadixTooltipPortal>
    );
  },
);

TooltipContent.displayName = "Tooltip.Content";

/* ─── Convenience shorthand form ─────────────────────────────── */

/**
 * Tooltip — single-component shorthand for the common icon-button case.
 *
 * Wraps Root + Trigger(asChild) + Content internally.
 * Requires a TooltipProvider ancestor (or wraps one if standalone).
 *
 * @example
 *   <Tooltip content="Settings">
 *     <IconButton aria-label="Settings"><Settings /></IconButton>
 *   </Tooltip>
 */
const TooltipShorthand = forwardRef<ElementRef<typeof RadixTooltipContent>, TooltipProps>(
  function Tooltip(
    {
      children,
      content,
      side = "top",
      sideOffset = 6,
      delayDuration,
      open,
      defaultOpen,
      onOpenChange,
    },
    ref,
  ) {
    return (
      <RadixTooltipRoot
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange !== undefined ? { onOpenChange } : {})}
        {...(delayDuration !== undefined ? { delayDuration } : {})}
      >
        <RadixTooltipTrigger asChild>{children}</RadixTooltipTrigger>
        <RadixTooltipPortal>
          <RadixTooltipContent
            ref={ref}
            side={side}
            sideOffset={sideOffset}
            className={styles.content}
          >
            {content}
          </RadixTooltipContent>
        </RadixTooltipPortal>
      </RadixTooltipRoot>
    );
  },
);

TooltipShorthand.displayName = "Tooltip";

/* ─── Compound namespace attachment ──────────────────────────── */

const Tooltip = Object.assign(TooltipShorthand, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

/* ─── Exports ────────────────────────────────────────────────── */

export { PoukaiTooltipProvider as TooltipProvider };
export { Tooltip };
