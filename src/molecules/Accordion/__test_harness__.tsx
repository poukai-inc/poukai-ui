/**
 * Test harness wrappers for Accordion CT tests.
 * Playwright CT forbids inline component definitions in test files.
 */
import { useState, type ReactNode } from "react";
import { Accordion } from "./Accordion";

/* ─── Basic single accordion ─────────────────────────────────────── */

export function SingleAccordion() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Item one</Accordion.Trigger>
        <Accordion.Content>
          <p>Content one</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Item two</Accordion.Trigger>
        <Accordion.Content>
          <p>Content two</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Single with default open ───────────────────────────────────── */

export function SingleDefaultOpen() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="item-1">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Default open</Accordion.Trigger>
        <Accordion.Content>
          <p data-testid="default-open-content">This is open by default</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Closed item</Accordion.Trigger>
        <Accordion.Content>
          <p>Closed by default</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Multiple type ──────────────────────────────────────────────── */

export function MultipleAccordion() {
  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="a">
        <Accordion.Trigger>Alpha</Accordion.Trigger>
        <Accordion.Content>
          <p data-testid="content-a">Alpha content</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Beta</Accordion.Trigger>
        <Accordion.Content>
          <p data-testid="content-b">Beta content</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Disabled item ──────────────────────────────────────────────── */

export function WithDisabledItem() {
  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="enabled">
        <Accordion.Trigger>Enabled item</Accordion.Trigger>
        <Accordion.Content>
          <p>Enabled content</p>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="disabled" disabled>
        <Accordion.Trigger>Disabled item</Accordion.Trigger>
        <Accordion.Content>
          <p>Should not be reachable</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Controlled accordion ───────────────────────────────────────── */

export function ControlledAccordion() {
  const [value, setValue] = useState<string>("");
  return (
    <div>
      <output data-testid="controlled-value">{value}</output>
      <Accordion.Root type="single" collapsible value={value} onValueChange={setValue}>
        <Accordion.Item value="ctrl-1">
          <Accordion.Trigger>Controlled one</Accordion.Trigger>
          <Accordion.Content>
            <p>Controlled content one</p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="ctrl-2">
          <Accordion.Trigger>Controlled two</Accordion.Trigger>
          <Accordion.Content>
            <p>Controlled content two</p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}

/* ─── className / data-* forwarding ─────────────────────────────── */

export function ForwardingAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="custom-root" data-testid="acc-root">
      <Accordion.Item value="fwd" className="custom-item" data-testid="acc-item">
        <Accordion.Trigger className="custom-trigger" data-testid="acc-trigger">
          Forward props
        </Accordion.Trigger>
        <Accordion.Content className="custom-content" data-testid="acc-content">
          <p>Content</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Tinted tone ────────────────────────────────────────────────── */

export function TintedAccordion() {
  return (
    <Accordion.Root type="single" collapsible tone="tinted" defaultValue="t-1">
      <Accordion.Item value="t-1">
        <Accordion.Trigger>Tinted item</Accordion.Trigger>
        <Accordion.Content data-testid="tinted-content">
          <p>Tinted panel content</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Ref forwarding ─────────────────────────────────────────────── */

export function RefAccordion({ rootRef }: { rootRef: React.RefObject<HTMLDivElement> }) {
  return (
    <Accordion.Root type="single" collapsible ref={rootRef}>
      <Accordion.Item value="r">
        <Accordion.Trigger>Ref item</Accordion.Trigger>
        <Accordion.Content>
          <p>Ref content</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

/* ─── Children slot ──────────────────────────────────────────────── */

export function WithChildrenContent({ children }: { children: ReactNode }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="slot">
      <Accordion.Item value="slot">
        <Accordion.Trigger>Slot trigger</Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
