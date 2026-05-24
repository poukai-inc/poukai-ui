import type { Story, StoryDefault } from "@ladle/react";
import { CopyButton } from "./CopyButton";

export default {
  title: "Components / CopyButton",
} satisfies StoryDefault;

/** Default — label + icon, idle state. Secondary affordance register.
 *  Verifies: ghost background, --fg-muted color, --fs-meta, --icon-xs,
 *  --radius-2 corners, --space-1/--space-2 padding. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <CopyButton value="npm install @poukai-inc/ui" />
  </div>
);

/** InCodeBlock — how CopyButton composes inside a code block surface.
 *  Verifies: renders cleanly against --surface background, sm size is
 *  readable beside mono code, success label appears and reverts. */
export const InCodeBlock: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-3)",
        padding: "var(--space-4)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
      }}
    >
      <code>npm install @poukai-inc/ui</code>
      <CopyButton value="npm install @poukai-inc/ui" label="Copy" />
    </div>
  </div>
);

/** Inline — icon-only variant, requires aria-label on root.
 *  Verifies: label={false} renders no text node, button still accessible
 *  via aria-label, icon-xs size renders correctly. */
export const Inline: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg)",
      }}
    >
      <span>sk-proj-abc123…xyz789</span>
      <CopyButton value="sk-proj-abc123xyz789" label={false} aria-label="Copy API key" size="sm" />
    </div>
  </div>
);

/** MdSize — md size register, pairs with body-text surfaces.
 *  Verifies: --fs-body + --icon-sm render cleanly at the larger rung. */
export const MdSize: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <CopyButton value="https://pouk.ai/share/abc123" size="md" label="Copy link" />
  </div>
);

/** Disabled — opacity 0.5, pointer-events none, no clipboard action fires. */
export const Disabled: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <CopyButton value="some-token" disabled />
  </div>
);
