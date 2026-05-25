import type { Story, StoryDefault } from "@ladle/react";
import { Popover } from "./Popover";
import { Button } from "../../atoms/Button";

export default {
  title: "Molecules / Popover",
} satisfies StoryDefault;

/* ─── Default ─────────────────────────────────────────────────── */

export const Default: Story = () => (
  <div style={{ padding: "var(--space-16)", display: "flex", justifyContent: "center" }}>
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary">Open popover</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Default popover">
        <p style={{ margin: 0, color: "var(--fg)" }}>
          This is a default popover with a short body.
        </p>
      </Popover.Content>
    </Popover.Root>
  </div>
);

/* ─── OnButton ────────────────────────────────────────────────── */

export const OnButton: Story = () => (
  <div style={{ padding: "var(--space-16)", display: "flex", justifyContent: "center" }}>
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="primary">Filter results</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Filter options" side="bottom" align="start">
        <p style={{ margin: "0 0 var(--space-2)", fontWeight: 500, color: "var(--fg)" }}>
          Filter by status
        </p>
        <p style={{ margin: 0, fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
          Click the trigger button above to toggle this panel.
        </p>
      </Popover.Content>
    </Popover.Root>
  </div>
);

/* ─── FilterPicker ────────────────────────────────────────────── */

export const FilterPicker: Story = () => (
  <div style={{ padding: "var(--space-16)", display: "flex", justifyContent: "center" }}>
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary" size="sm">
          Filter
        </Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Filter picker" side="bottom" align="start" arrow>
        <p style={{ margin: "0 0 var(--space-3)", fontWeight: 500, color: "var(--fg)" }}>
          Filter by stage
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {["Discovery", "In progress", "Shipped", "Archived"].map((label) => (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontSize: "var(--fs-meta)",
                color: "var(--fg)",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" defaultChecked={label === "Shipped"} />
              {label}
            </label>
          ))}
        </div>
        <div
          style={{
            marginTop: "var(--space-4)",
            paddingTop: "var(--space-3)",
            borderTop: "var(--hairline-w) solid var(--hairline)",
          }}
        >
          <Popover.Close asChild>
            <Button variant="ghost" size="sm">
              Apply
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  </div>
);

/* ─── LongContent ─────────────────────────────────────────────── */

export const LongContent: Story = () => (
  <div style={{ padding: "var(--space-16)", display: "flex", justifyContent: "center" }}>
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <Button variant="secondary">What is this?</Button>
      </Popover.Trigger>
      <Popover.Content
        aria-label="Detailed explanation"
        side="right"
        align="start"
        style={{ maxWidth: "20rem" }}
      >
        <p style={{ margin: "0 0 var(--space-3)", fontWeight: 500, color: "var(--fg)" }}>
          About this metric
        </p>
        <p
          style={{
            margin: "0 0 var(--space-3)",
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
          }}
        >
          This value is computed from your last 30 days of activity. Outlier sessions are
          automatically excluded using a rolling IQR filter applied at ingestion time.
        </p>
        <p style={{ margin: 0, fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
          Updated daily at 02:00 UTC. Contact support if the numbers look wrong.
        </p>
        <div style={{ marginTop: "var(--space-4)" }}>
          <Popover.Close asChild>
            <Button variant="ghost" size="sm">
              Got it
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Root>
  </div>
);
