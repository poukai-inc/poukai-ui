import type { Story, StoryDefault } from "@ladle/react";
import { Textarea } from "./Textarea";

export default {
  title: "Atoms / Textarea",
  args: {
    placeholder: "Enter your message…",
    rows: 3,
    resize: "vertical",
    invalid: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    rows: { control: { type: "number" } },
    resize: {
      control: { type: "select" },
      options: ["vertical", "none", "both"],
    },
    placeholder: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Default textarea — resting state, rows=3, resize=vertical. */
export const Default: Story = () => (
  <Textarea placeholder="Enter your message…" style={{ maxWidth: "24rem" }} />
);

/** Taller — rows=6. */
export const TallRows: Story = () => (
  <Textarea placeholder="Long-form content…" rows={6} style={{ maxWidth: "24rem" }} />
);

/** Resize locked — height fixed by rows. */
export const ResizeNone: Story = () => (
  <Textarea placeholder="Fixed-height note…" rows={3} resize="none" style={{ maxWidth: "24rem" }} />
);

/** Both axes resizable — rare; mainly here for completeness. */
export const ResizeBoth: Story = () => (
  <Textarea
    placeholder="Drag corner to resize on either axis…"
    rows={3}
    resize="both"
    style={{ maxWidth: "24rem" }}
  />
);

/** Error / invalid state — danger border applied. */
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

/** Readonly — same visual register as default; value visible, no editing. */
export const Readonly: Story = () => (
  <Textarea readOnly defaultValue="This content is read-only." style={{ maxWidth: "24rem" }} />
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
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      maxWidth: "24rem",
    }}
  >
    <Textarea placeholder="Default" />
    <Textarea placeholder="Disabled" disabled />
    <Textarea readOnly defaultValue="Readonly content." />
    <Textarea placeholder="Invalid" invalid defaultValue="bad value" />
  </div>
);
