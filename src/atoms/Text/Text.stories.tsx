import type { Story, StoryDefault } from "@ladle/react";
import { Text, type TextSize, type TextTone } from "./Text";

export default {
  title: "Components / Text",
  args: {
    size: "body",
    tone: "default",
    children:
      "Poukai is the design system behind every customer touchpoint at pouk.ai — quietly opinionated, never decorative without reason.",
  },
  argTypes: {
    size: {
      options: ["body", "lede", "caption", "micro"] satisfies TextSize[],
      control: { type: "radio" },
      defaultValue: "body",
    },
    tone: {
      options: ["default", "muted", "on-warm", "on-warm-muted"] satisfies TextTone[],
      control: { type: "radio" },
      defaultValue: "default",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  size: TextSize;
  tone: TextTone;
  children: string;
}> = ({ size, tone, children }) => (
  <Text size={size} tone={tone}>
    {children}
  </Text>
);

/** Sizes — every typographic register stacked. */
export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    <Text size="body">
      Body — the standard running-copy register. `--fs-body` at `--lh-body` (1.55).
    </Text>
    <Text size="lede" tone="muted">
      Lede — same point size as body but with relaxed leading and a 36rem measure constraint.
      Designed to sit directly under a heading and ease the reader into the page.
    </Text>
    <Text size="caption" tone="muted">
      Caption — `--fs-meta` (14px) at `--lh-meta` (1.2). Captions, helper copy, footer lines.
    </Text>
    <Text size="micro" tone="muted">
      Micro — `--fs-micro` (12px). Footnotes and inline metadata. Not uppercase.
    </Text>
  </div>
);

/** Tones — color register across all four token mappings. */
export const Tones: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    <Text tone="default">Default tone on the page surface — `--fg`.</Text>
    <Text tone="muted">Muted tone on the page surface — `--fg-muted`.</Text>
    <div
      style={{
        background: "var(--bg-warm-accent)",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <Text tone="on-warm">On-warm tone on the warm editorial band — `--fg-on-warm`.</Text>
      <Text tone="on-warm-muted">Supporting copy on the warm band — `--fg-on-warm-muted`.</Text>
    </div>
  </div>
);

/** Canonical pairing — `<h1>` + lede + muted, the dominant editorial pattern. */
export const LedeAfterHeading: Story = () => (
  <div>
    <h1 style={{ margin: "0 0 var(--space-4)" }}>The system has one job: cohere.</h1>
    <Text size="lede" tone="muted">
      Every atom in Poukai resolves a real drift in the production codebase. We do not ship a
      component until it has earned its place by collapsing two or more existing patterns.
    </Text>
  </div>
);

/** Inline composition via `as="span"`. */
export const AsSpan: Story = () => (
  <p style={{ margin: 0 }}>
    Wrapped fragment inside a parent paragraph —{" "}
    <Text as="span" tone="muted">
      a muted span
    </Text>{" "}
    sits inline without breaking the flow.
  </p>
);
