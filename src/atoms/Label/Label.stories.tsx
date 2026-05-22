import type { Story, StoryDefault } from "@ladle/react";
import { Label } from "./Label";

export default {
  title: "Components / Label",
  args: { children: "Email address", htmlFor: "demo", required: false, tone: "default" },
  argTypes: {
    tone: {
      options: ["default", "muted"],
      control: { type: "radio" },
      defaultValue: "default",
    },
  },
} satisfies StoryDefault;

/**
 * Default — basic label bound to a sibling input via htmlFor.
 * Click the label to verify browser-native focus transfer.
 */
export const Default: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
    <Label htmlFor="demo-default">Email address</Label>
    <input
      id="demo-default"
      type="email"
      placeholder="you@example.com"
      style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}
    />
  </div>
);

/**
 * Required — required={true} renders the asterisk suffix in var(--danger).
 * The span is aria-hidden; the consumer is responsible for aria-required on the control.
 */
export const Required: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
    <Label htmlFor="demo-required" required>
      Email address
    </Label>
    <input
      id="demo-required"
      type="email"
      placeholder="you@example.com"
      aria-required="true"
      style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}
    />
  </div>
);

/**
 * Muted — tone="muted" uses --fg-muted. No asterisk.
 * Use for secondary fields inside nested fieldsets or de-emphasized form sections.
 */
export const Muted: Story = () => (
  <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
    <legend
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg)",
        marginBottom: "var(--space-3)",
      }}
    >
      Optional preferences
    </legend>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      <Label htmlFor="demo-muted" tone="muted">
        Timezone
      </Label>
      <input
        id="demo-muted"
        type="text"
        placeholder="UTC"
        style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}
      />
    </div>
  </fieldset>
);

/**
 * LongText — 60+ character label demonstrating natural wrap behavior.
 * No truncation, no max-width set by Label — consumer or layout owns that.
 */
export const LongText: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", maxWidth: "200px" }}
  >
    <Label htmlFor="demo-long">
      Your full legal name as it appears on your government-issued identification document
    </Label>
    <input
      id="demo-long"
      type="text"
      placeholder="Full legal name"
      style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}
    />
  </div>
);
