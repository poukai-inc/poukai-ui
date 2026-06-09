import type { Story, StoryDefault } from "@ladle/react";
import { PasswordInput, type PasswordInputProps } from "./PasswordInput";
import { Field } from "../../molecules/Field";

export default {
  title: "Atoms / PasswordInput",
  args: {
    size: "md",
    invalid: false,
    disabled: false,
    placeholder: "••••••••",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] satisfies NonNullable<PasswordInputProps["size"]>[],
      control: { type: "inline-radio" },
    },
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    placeholder: { control: { type: "text" } },
  },
} satisfies StoryDefault<PasswordInputProps>;

/** Default — masked, size md, reveal toggle at the inline end. */
export const Default: Story<PasswordInputProps> = (args) => (
  <PasswordInput {...args} style={{ maxWidth: "24rem" }} />
);

/** Inside Field — the canonical pattern with label association. */
export const InField: Story<PasswordInputProps> = (args) => (
  <Field label="Password" id="pw">
    <PasswordInput {...args} id="pw" autoComplete="current-password" />
  </Field>
);

/** Localized toggle labels. */
export const LocalizedLabels: Story<PasswordInputProps> = (args) => (
  <PasswordInput
    {...args}
    revealLabel="Mostrar contraseña"
    hideLabel="Ocultar contraseña"
    style={{ maxWidth: "24rem" }}
  />
);

/* ---- Size scale ---- */

/** All three sizes — toggle stays sm at every field height. */
export const Sizes: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "24rem" }}
  >
    <PasswordInput size="sm" placeholder="Small (32px)" />
    <PasswordInput size="md" placeholder="Medium (44px)" />
    <PasswordInput size="lg" placeholder="Large (52px)" />
  </div>
);

/* ---- Visual states ---- */

/** Invalid — danger border applied to the field. */
export const Invalid: Story<PasswordInputProps> = (args) => (
  <PasswordInput {...args} invalid defaultValue="short" style={{ maxWidth: "24rem" }} />
);

/** Disabled — field is disabled (50% opacity, not-allowed cursor). */
export const Disabled: Story<PasswordInputProps> = (args) => (
  <PasswordInput {...args} disabled style={{ maxWidth: "24rem" }} />
);

/** Full width — fills container. */
export const FullWidth: Story = () => (
  <div style={{ maxWidth: "36rem" }}>
    <PasswordInput placeholder="Full-width password…" />
  </div>
);
