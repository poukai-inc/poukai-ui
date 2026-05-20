import type { Story, StoryDefault } from "@ladle/react";
import { Field } from "./Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";

export default {
  title: "Components / Field",
  argTypes: {
    label: { control: { type: "text" } },
    helper: { control: { type: "text" } },
    error: { control: { type: "text" } },
    required: { control: { type: "boolean" } },
  },
  args: {
    label: "Email address",
    helper: "",
    error: "",
    required: false,
  },
} satisfies StoryDefault;

/** (a) Field + Input (email) — default with helper text. */
export const WithInput: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Email address" id="story-email" helper="We'll never share your email.">
      <Input type="email" placeholder="you@example.com" />
    </Field>
  </div>
);

/** (b) Field + Textarea (message). */
export const WithTextarea: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Message" id="story-message" helper="Tell us about your project.">
      <Textarea placeholder="What are you working on?" />
    </Field>
  </div>
);

/** (c) Field with error state — error replaces helper text. */
export const WithError: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field
      label="Email address"
      id="story-email-error"
      error="Please enter a valid email address."
      helper="This helper is hidden when error is set."
    >
      <Input type="email" defaultValue="not-an-email" />
    </Field>
  </div>
);

/** (d) Standalone Input (no Field wrapper) — consumer responsible for label. */
export const StandaloneInput: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label
      htmlFor="standalone-search"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        fontWeight: 500,
        color: "var(--fg)",
        display: "block",
        marginBottom: "var(--space-1)",
      }}
    >
      Search
    </label>
    <Input id="standalone-search" type="search" placeholder="Search…" />
  </div>
);

/** Required field — * indicator next to label, required on input. */
export const Required: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Full name" id="story-name" required>
      <Input placeholder="Arian Zargaran" />
    </Field>
  </div>
);

/** Required with error. */
export const RequiredWithError: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Full name" id="story-name-error" required error="Full name is required.">
      <Input placeholder="Arian Zargaran" />
    </Field>
  </div>
);

/** Disabled input inside Field. */
export const Disabled: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Username" id="story-disabled" helper="Cannot be changed after registration.">
      <Input defaultValue="arian" disabled />
    </Field>
  </div>
);

/** Full form — multiple fields stacked together. */
export const FullForm: Story = () => (
  <div
    style={{
      maxWidth: "24rem",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
    }}
  >
    <Field label="Full name" id="form-name" required>
      <Input placeholder="Arian Zargaran" />
    </Field>
    <Field label="Email address" id="form-email" required helper="We'll never share your email.">
      <Input type="email" placeholder="you@example.com" />
    </Field>
    <Field label="Message" id="form-message">
      <Textarea placeholder="Tell us about your project…" />
    </Field>
  </div>
);

/** Auto-generated id — no id prop needed. */
export const AutoId: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Field label="Phone number" helper="Include country code.">
      <Input type="tel" placeholder="+1 555 000 0000" />
    </Field>
  </div>
);
