import type { Story, StoryDefault } from "@ladle/react";
import { Input, type InputProps } from "./Input";

export default {
  title: "Components / Input",
  args: {
    type: "text",
    placeholder: "Enter text…",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    type: {
      options: [
        "text",
        "email",
        "url",
        "tel",
        "password",
        "search",
        "number",
      ] satisfies NonNullable<InputProps["type"]>[],
      control: { type: "select" },
      defaultValue: "text",
    },
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    placeholder: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Default text input — resting state. */
export const Default: Story = () => (
  <Input placeholder="Enter text…" style={{ maxWidth: "24rem" }} />
);

/** Email type. */
export const Email: Story = () => (
  <Input type="email" placeholder="you@example.com" style={{ maxWidth: "24rem" }} />
);

/** Password type — input is masked. */
export const Password: Story = () => (
  <Input type="password" placeholder="••••••••" style={{ maxWidth: "24rem" }} />
);

/** Search type. */
export const Search: Story = () => (
  <Input type="search" placeholder="Search…" style={{ maxWidth: "24rem" }} />
);

/** Error / invalid state — accent border applied. */
export const Invalid: Story = () => (
  <Input
    type="email"
    placeholder="you@example.com"
    invalid
    defaultValue="not-an-email"
    style={{ maxWidth: "24rem" }}
  />
);

/** Disabled state — 50% opacity, not-allowed cursor. */
export const Disabled: Story = () => (
  <Input placeholder="Disabled input" disabled style={{ maxWidth: "24rem" }} />
);

/** Required — consumer passes required attribute directly. */
export const Required: Story = () => (
  <Input type="email" placeholder="you@example.com" required style={{ maxWidth: "24rem" }} />
);

/** Full width — no max-width constraint; fills container. */
export const FullWidth: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <Input placeholder="Full-width input…" />
  </div>
);

/** All states matrix. */
export const AllStates: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "24rem" }}
  >
    <Input placeholder="Default" />
    <Input placeholder="Disabled" disabled />
    <Input placeholder="Invalid" invalid defaultValue="bad value" />
  </div>
);
