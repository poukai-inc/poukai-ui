import type { Story, StoryDefault } from "@ladle/react";
import { Input, type InputProps, type InputSize } from "./Input";
import { Button } from "../Button";

export default {
  title: "Atoms / Input",
  args: {
    type: "text",
    size: "md",
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
    },
    size: {
      options: ["sm", "md", "lg"] satisfies InputSize[],
      control: { type: "select" },
    },
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    placeholder: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/** Default — rest state, size md. */
export const Default: Story = () => (
  <Input placeholder="Enter text…" style={{ maxWidth: "24rem" }} />
);

/* ---- Type variants ---- */

/** Email type. */
export const TypeEmail: Story = () => (
  <Input type="email" placeholder="you@example.com" style={{ maxWidth: "24rem" }} />
);

/** URL type. */
export const TypeUrl: Story = () => (
  <Input type="url" placeholder="https://example.com" style={{ maxWidth: "24rem" }} />
);

/** Tel type. */
export const TypeTel: Story = () => (
  <Input type="tel" placeholder="+1 (555) 000-0000" style={{ maxWidth: "24rem" }} />
);

/** Password type — input is masked. */
export const TypePassword: Story = () => (
  <Input type="password" placeholder="••••••••" style={{ maxWidth: "24rem" }} />
);

/** Search type. */
export const TypeSearch: Story = () => (
  <Input type="search" placeholder="Search…" style={{ maxWidth: "24rem" }} />
);

/** Number type. */
export const TypeNumber: Story = () => (
  <Input type="number" placeholder="0" style={{ maxWidth: "8rem" }} />
);

/* ---- Size scale ---- */

/** Size sm — pairs with Button size="sm" (min-height 32px). */
export const SizeSm: Story = () => (
  <Input size="sm" placeholder="Small input" style={{ maxWidth: "24rem" }} />
);

/** Size md — default (min-height 44px). */
export const SizeMd: Story = () => (
  <Input size="md" placeholder="Medium input" style={{ maxWidth: "24rem" }} />
);

/** Size lg — pairs with Button size="lg" (min-height 52px). */
export const SizeLg: Story = () => (
  <Input size="lg" placeholder="Large input" style={{ maxWidth: "24rem" }} />
);

/** Size × Button pairing — visually verifies that the shared --btn-h-* ladder aligns them. */
export const SizeButtonPair: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "24rem" }}
  >
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <Input size="sm" placeholder="sm input" />
      <Button size="sm">Send</Button>
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <Input size="md" placeholder="md input" />
      <Button size="md">Send</Button>
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      <Input size="lg" placeholder="lg input" />
      <Button size="lg">Send</Button>
    </div>
  </div>
);

/* ---- Visual states ---- */

/** Invalid — danger border applied. */
export const Invalid: Story = () => (
  <Input
    type="email"
    placeholder="you@example.com"
    invalid
    defaultValue="not-an-email"
    style={{ maxWidth: "24rem" }}
  />
);

/** Disabled — 50% opacity, not-allowed cursor. */
export const Disabled: Story = () => (
  <Input placeholder="Disabled input" disabled style={{ maxWidth: "24rem" }} />
);

/** Readonly — cursor:default, no hover border shift. */
export const Readonly: Story = () => (
  <Input value="read-only value" readOnly style={{ maxWidth: "24rem" }} onChange={() => {}} />
);

/** Required — native required attribute forwarded. */
export const Required: Story = () => (
  <Input type="email" placeholder="you@example.com" required style={{ maxWidth: "24rem" }} />
);

/** Full width — fills container. */
export const FullWidth: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <Input placeholder="Full-width input…" />
  </div>
);

/* ---- State matrix ---- */

/** All states at once for visual regression. */
export const AllStates: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "24rem" }}
  >
    <Input placeholder="Default" />
    <Input placeholder="Disabled" disabled />
    <Input placeholder="Readonly" value="read-only" readOnly onChange={() => {}} />
    <Input placeholder="Invalid" invalid defaultValue="bad value" />
  </div>
);

/** All three sizes — visual regression for height ladder. */
export const AllSizes: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "24rem" }}
  >
    <Input size="sm" placeholder="Small (32px)" />
    <Input size="md" placeholder="Medium (44px)" />
    <Input size="lg" placeholder="Large (52px)" />
  </div>
);
