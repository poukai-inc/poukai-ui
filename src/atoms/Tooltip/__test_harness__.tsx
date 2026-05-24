/**
 * Test harnesses for Tooltip.test.tsx.
 *
 * Playwright CT forbids inline component definitions in test files —
 * every component passed to mount() must be defined in a separate module.
 */

import { TooltipProvider, Tooltip } from "./Tooltip";

/** Simple shorthand tooltip with a button trigger. */
export function ShorthandHarness({
  content = "Tooltip label",
  side,
  delayDuration = 0,
  defaultOpen,
}: {
  content?: string;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  defaultOpen?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip
        content={content}
        {...(side !== undefined ? { side } : {})}
        delayDuration={delayDuration}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      >
        <button type="button" data-testid="trigger">
          Trigger
        </button>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Compound API harness. */
export function CompoundHarness({ label = "Compound label" }: { label?: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button" data-testid="compound-trigger">
            Trigger
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content sideOffset={6}>
          <span data-testid="compound-content">{label}</span>
        </Tooltip.Content>
      </Tooltip.Root>
    </TooltipProvider>
  );
}

/** Harness for focus-open behaviour — trigger is keyboard-focusable. */
export function FocusHarness() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip content="Focus label" delayDuration={0}>
        <button type="button" data-testid="focus-trigger">
          Focus me
        </button>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Harness for className + data-* forwarding on content. */
export function ForwardingHarness() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button" data-testid="fwd-trigger">
            Trigger
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content className="custom-content" data-testid="fwd-content" sideOffset={6}>
          Forwarded
        </Tooltip.Content>
      </Tooltip.Root>
    </TooltipProvider>
  );
}
