/**
 * Test harnesses for HoverCard.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including children of wrapper components) to be defined outside
 * the test file. Inline test-file components produce
 * "Component X cannot be mounted" errors at runtime.
 */

import { HoverCard } from "./HoverCard";

/** Default harness — Root + Trigger (anchor) + Content with text. */
export function DefaultHarness({
  openDelay = 0,
  closeDelay = 0,
  showArrow = true,
  width = "md",
  side = "bottom",
  align = "start",
  className,
  contentText = "Preview content",
  triggerText = "Hover me",
  defaultOpen = false,
}: {
  openDelay?: number;
  closeDelay?: number;
  showArrow?: boolean;
  width?: "sm" | "md";
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  contentText?: string;
  triggerText?: string;
  defaultOpen?: boolean;
}) {
  return (
    <HoverCard.Root openDelay={openDelay} closeDelay={closeDelay} defaultOpen={defaultOpen}>
      <HoverCard.Trigger>
        <a href="/profile" data-testid="hc-trigger">
          {triggerText}
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content
        width={width}
        side={side}
        align={align}
        showArrow={showArrow}
        className={className}
        data-testid="hc-content"
      >
        <p data-testid="hc-body">{contentText}</p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

/** Harness for ref-forwarding test. */
export function RefHarness() {
  return (
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <HoverCard.Trigger>
        <a href="/profile" data-testid="ref-trigger">
          Author
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content data-testid="ref-content">
        <p>Ref content</p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
