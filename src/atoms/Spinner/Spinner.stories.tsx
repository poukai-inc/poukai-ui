import type { Story, StoryDefault } from "@ladle/react";
import { Spinner, type SpinnerSize } from "./Spinner";
import { Button } from "../Button/Button";

export default {
  title: "Components / Spinner",
  args: { size: "md", label: "Loading" },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] satisfies SpinnerSize[],
      control: { type: "radio" },
      defaultValue: "md",
    },
    label: {
      control: { type: "text" },
      defaultValue: "Loading",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{ size: SpinnerSize; label: string }> = ({ size, label }) => (
  <Spinner size={size} label={label} />
);

export const SizeVariants: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
    <Spinner size="sm" label="Loading small" />
    <Spinner size="md" label="Loading medium" />
    <Spinner size="lg" label="Loading large" />
  </div>
);

export const LabelOverride: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Spinner size="md" label="Submitting form" />
      <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
        label=&quot;Submitting form&quot;
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Spinner size="md" label="Loading search results" />
      <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
        label=&quot;Loading search results&quot;
      </span>
    </div>
  </div>
);

export const InsideButton: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
    <Button variant="primary" size="md" disabled aria-busy="true">
      <Spinner size="md" label="Submitting" />
      Submitting…
    </Button>
    <Button variant="secondary" size="sm" disabled aria-busy="true">
      <Spinner size="sm" label="Loading" />
      Loading
    </Button>
    <Button variant="ghost" size="lg" disabled aria-busy="true">
      <Spinner size="md" label="Processing" />
      Processing
    </Button>
  </div>
);

export const ColorInheritance: Story = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        color: "var(--fg)",
      }}
    >
      <Spinner size="md" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--fg (default)</span>
    </div>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        color: "var(--accent)",
      }}
    >
      <Spinner size="md" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--accent</span>
    </div>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-3)",
        background: "var(--fg)",
        color: "var(--bg)",
        borderRadius: "var(--radius-2)",
      }}
    >
      <Spinner size="md" />
      <span style={{ fontSize: "var(--fs-meta)" }}>on --fg bg</span>
    </div>
  </div>
);
