import type { Story, StoryDefault } from "@ladle/react";
import { Textarea, type TextareaProps } from "./Textarea";

export default {
  title: "Components / Textarea",
  args: {
    placeholder: "Enter your message…",
    rows: 4,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    rows: { control: { type: "number" } },
    placeholder: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Default textarea — resting state. */
export const Default: Story = () => (
  <Textarea placeholder="Enter your message…" style={{ maxWidth: "24rem" }} />
);

/** Taller — rows=6. */
export const TallRows: Story = () => (
  <Textarea placeholder="Long-form content…" rows={6} style={{ maxWidth: "24rem" }} />
);

/** Error / invalid state — accent border applied. */
export const Invalid: Story = () => (
  <Textarea
    placeholder="Your message"
    invalid
    defaultValue="too short"
    style={{ maxWidth: "24rem" }}
  />
);

/** Disabled state — 50% opacity, not-allowed cursor. */
export const Disabled: Story = () => (
  <Textarea placeholder="Disabled textarea" disabled style={{ maxWidth: "24rem" }} />
);

/** Required. */
export const Required: Story = () => (
  <Textarea placeholder="Required field" required style={{ maxWidth: "24rem" }} />
);

/** Full width — fills container. */
export const FullWidth: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <Textarea placeholder="Full-width textarea…" />
  </div>
);

/** All states matrix. */
export const AllStates: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "24rem" }}
  >
    <Textarea placeholder="Default" />
    <Textarea placeholder="Disabled" disabled />
    <Textarea placeholder="Invalid" invalid defaultValue="bad value" />
  </div>
);
