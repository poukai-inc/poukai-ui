/**
 * Test harnesses for Popover.test.tsx.
 *
 * Playwright CT requires every mounted component to be defined outside the
 * test file. Inline component definitions produce "Component X cannot be
 * mounted" errors at runtime. All wrappers live here.
 */

import { Popover } from "./Popover";
import { Button } from "../../atoms/Button";

/** Basic popover — trigger + content. Open state is uncontrolled (defaultOpen). */
export function BasicPopover({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger asChild>
        <Button variant="secondary" data-testid="popover-trigger">
          Open
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Test popover" data-testid="popover-content">
        <p data-testid="popover-body">Popover body text.</p>
      </Popover.Content>
    </Popover.Root>
  );
}

/** Popover with a Close button inside the content. */
export function PopoverWithClose() {
  return (
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary" data-testid="popover-trigger">
          Open
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Closeable popover">
        <p>Content with a close button.</p>
        <Popover.Close asChild>
          <Button variant="ghost" size="sm" data-testid="popover-close">
            Close
          </Button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}

/** Popover that accepts className on content for forwarding tests. */
export function PopoverWithClassName({ contentClassName }: { contentClassName: string }) {
  return (
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Classed popover" className={contentClassName}>
        <p>Content.</p>
      </Popover.Content>
    </Popover.Root>
  );
}

/** Popover with data-* forwarded to content. */
export function PopoverWithDataAttr() {
  return (
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Data attr popover" data-testid="content-data-attr">
        <p>Data attr content.</p>
      </Popover.Content>
    </Popover.Root>
  );
}

/** A11y harness — open popover with accessible label and body. */
export function PopoverA11yHarness() {
  return (
    <div style={{ padding: "var(--space-8)" }}>
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <Button variant="secondary">More info</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Accessibility test popover">
          <p>Popover content for the a11y gate scan.</p>
          <Popover.Close asChild>
            <Button variant="ghost" size="sm" aria-label="Close popover">
              Close
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
