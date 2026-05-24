import type { Story, StoryDefault } from "@ladle/react";
import { TimePicker, type TimePickerProps, type TimePickerSize } from "./TimePicker";

export default {
  title: "Atoms / TimePicker",
  args: {
    size: "md",
    invalid: false,
    disabled: false,
    step: 60,
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] satisfies TimePickerSize[],
      control: { type: "select" },
    },
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    step: { control: { type: "number" } },
  },
} satisfies StoryDefault<TimePickerProps>;

/** Default — rest state, size md, no preset value. */
export const Default: Story = () => (
  <TimePicker aria-label="Select time" style={{ maxWidth: "16rem" }} />
);

/** WithValue — controlled with a preset time. */
export const WithValue: Story = () => (
  <TimePicker
    aria-label="Select time"
    value="09:30"
    onValueChange={() => {}}
    style={{ maxWidth: "16rem" }}
  />
);

/** Disabled — 50% opacity, pointer-events none. */
export const Disabled: Story = () => (
  <TimePicker
    aria-label="Select time"
    value="14:00"
    onValueChange={() => {}}
    disabled
    style={{ maxWidth: "16rem" }}
  />
);

/** Invalid — danger border applied. */
export const Invalid: Story = () => (
  <TimePicker aria-label="Select time" invalid style={{ maxWidth: "16rem" }} />
);

/** Size sm — min-height 32px. */
export const SizeSm: Story = () => (
  <TimePicker aria-label="Select time" size="sm" style={{ maxWidth: "16rem" }} />
);

/** Size md — default, min-height 44px. */
export const SizeMd: Story = () => (
  <TimePicker aria-label="Select time" size="md" style={{ maxWidth: "16rem" }} />
);

/** Size lg — min-height 52px. */
export const SizeLg: Story = () => (
  <TimePicker aria-label="Select time" size="lg" style={{ maxWidth: "16rem" }} />
);

/** Step 15-min — native spinner steps by 15 minutes. */
export const Step15Min: Story = () => (
  <TimePicker aria-label="Select time" step={900} style={{ maxWidth: "16rem" }} />
);

/** All sizes for visual regression. */
export const AllSizes: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "16rem" }}
  >
    <TimePicker aria-label="Small time picker" size="sm" />
    <TimePicker aria-label="Medium time picker" size="md" />
    <TimePicker aria-label="Large time picker" size="lg" />
  </div>
);

/** All states for visual regression. */
export const AllStates: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "16rem" }}
  >
    <TimePicker aria-label="Default state" />
    <TimePicker aria-label="With value" value="10:30" onValueChange={() => {}} />
    <TimePicker aria-label="Invalid state" invalid />
    <TimePicker aria-label="Disabled state" disabled value="08:00" onValueChange={() => {}} />
  </div>
);
