import React from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Select, type SelectProps, type SelectSize } from "./Select";
import { Field } from "../../molecules/Field";

export default {
  title: "Atoms / Select",
  args: {
    size: "md",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"] satisfies SelectSize[],
      control: { type: "select" },
    },
    invalid: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
} satisfies StoryDefault;

const countries = (
  <>
    <option value="">Select a country…</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="gb">United Kingdom</option>
    <option value="au">Australia</option>
  </>
);

/** Default — rest state, size md. */
export const Default: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="default-select">Country</label>
    <Select id="default-select" style={{ marginTop: "var(--space-1)" }}>
      {countries}
    </Select>
  </div>
);

/* ---- Size scale ---- */

/** Size sm — pairs with Button size="sm" (min-height 32px). */
export const SizeSmall: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="sm-select">Plan</label>
    <Select id="sm-select" size="sm" defaultValue="starter" style={{ marginTop: "var(--space-1)" }}>
      <option value="starter">Starter</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </Select>
  </div>
);

/** Size md — default (min-height 44px). */
export const SizeMedium: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="md-select">Plan</label>
    <Select id="md-select" size="md" defaultValue="pro" style={{ marginTop: "var(--space-1)" }}>
      <option value="starter">Starter</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </Select>
  </div>
);

/** Size lg — pairs with Button size="lg" (min-height 52px). */
export const SizeLarge: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="lg-select">Plan</label>
    <Select
      id="lg-select"
      size="lg"
      defaultValue="enterprise"
      style={{ marginTop: "var(--space-1)" }}
    >
      <option value="starter">Starter</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </Select>
  </div>
);

/** All three sizes in a column — visual regression for height ladder. */
export const AllSizes: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "24rem" }}
  >
    {(["sm", "md", "lg"] as SelectSize[]).map((size) => (
      <div key={size}>
        <label htmlFor={`all-sizes-${size}`}>{size}</label>
        <Select id={`all-sizes-${size}`} size={size} style={{ marginTop: "var(--space-1)" }}>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      </div>
    ))}
  </div>
);

/* ---- Content variants ---- */

/** With optgroup — regional grouping. */
export const WithOptgroup: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="optgroup-select">Region</label>
    <Select id="optgroup-select" style={{ marginTop: "var(--space-1)" }}>
      <option value="">Select a region…</option>
      <optgroup label="North America">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="mx">Mexico</option>
      </optgroup>
      <optgroup label="Europe">
        <option value="fr">France</option>
        <option value="de">Germany</option>
        <option value="gb">United Kingdom</option>
      </optgroup>
      <optgroup label="Asia Pacific">
        <option value="au">Australia</option>
        <option value="jp">Japan</option>
        <option value="sg">Singapore</option>
      </optgroup>
    </Select>
  </div>
);

/** Many options — verifies truncation + caret spacing under long text. */
export const ManyOptions: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="many-select">Timezone</label>
    <Select id="many-select" style={{ marginTop: "var(--space-1)" }}>
      {Array.from({ length: 30 }, (_, i) => (
        <option key={i} value={`tz-${i}`}>
          {`UTC${i < 12 ? `-${12 - i}` : `+${i - 12}`}:00 — Zone ${i + 1}`}
        </option>
      ))}
    </Select>
  </div>
);

/** With a disabled option — e.g. Enterprise requires contact. */
export const WithDisabledOption: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="disabled-option-select">Plan</label>
    <Select id="disabled-option-select" defaultValue="pro" style={{ marginTop: "var(--space-1)" }}>
      <option value="free">Free</option>
      <option value="pro">Pro</option>
      <option value="enterprise" disabled>
        Enterprise (contact sales)
      </option>
    </Select>
  </div>
);

/** defaultValue — pre-selects an option on mount. */
export const DefaultValue: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="default-value-select">Sort by</label>
    <Select
      id="default-value-select"
      defaultValue="popular"
      style={{ marginTop: "var(--space-1)" }}
    >
      <option value="recent">Most recent</option>
      <option value="popular">Most popular</option>
      <option value="az">A → Z</option>
    </Select>
  </div>
);

/** Controlled value — updates reflected in UI label. */
function ControlledDemo() {
  const [value, setValue] = React.useState("pro");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <label htmlFor="controlled-select">Plan</label>
      <Select
        id="controlled-select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginTop: "var(--space-1)" }}
      >
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </Select>
      <p
        style={{
          marginTop: "var(--space-2)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
}
export const ControlledValue: Story = () => <ControlledDemo />;

/* ---- Visual states ---- */

/** Invalid — danger border applied. */
export const Invalid: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="invalid-select">Country</label>
    <Select id="invalid-select" invalid defaultValue="" style={{ marginTop: "var(--space-1)" }}>
      <option value="" disabled>
        Select a country…
      </option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </Select>
  </div>
);

/** Disabled — 50% opacity, not-allowed cursor. */
export const Disabled: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="disabled-select">Country</label>
    <Select id="disabled-select" disabled defaultValue="us" style={{ marginTop: "var(--space-1)" }}>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </Select>
  </div>
);

/** Required — native required attribute forwarded. */
export const Required: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="required-select">
      Country <span aria-hidden="true">*</span>
    </label>
    <Select id="required-select" required defaultValue="" style={{ marginTop: "var(--space-1)" }}>
      <option value="" disabled>
        Select a country…
      </option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </Select>
  </div>
);

/** Multiple — caret hidden, native listbox renders. */
export const Multiple: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <label htmlFor="multiple-select">Skills (hold Ctrl/⌘ for multi)</label>
    <Select id="multiple-select" multiple style={{ marginTop: "var(--space-1)" }}>
      <option value="design">Design</option>
      <option value="eng">Engineering</option>
      <option value="product">Product</option>
      <option value="data">Data</option>
      <option value="marketing">Marketing</option>
    </Select>
  </div>
);

/** RTL — caret flips to inline-start. */
export const RTL: Story = () => (
  <div dir="rtl" style={{ maxWidth: "24rem" }}>
    <label htmlFor="rtl-select">البلد</label>
    <Select id="rtl-select" style={{ marginTop: "var(--space-1)" }}>
      <option value="sa">المملكة العربية السعودية</option>
      <option value="eg">مصر</option>
      <option value="ae">الإمارات</option>
    </Select>
  </div>
);

/** Inside Field — full composition with label, helper, error wiring. */
export const InsideField: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "24rem" }}
  >
    <Field label="Country" id="field-select" helper="Used for tax calculation.">
      <Select defaultValue="">
        <option value="" disabled>
          Select a country…
        </option>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="gb">United Kingdom</option>
      </Select>
    </Field>

    <Field label="Plan" id="field-select-error" error="Please choose a plan to continue.">
      <Select defaultValue="" invalid>
        <option value="" disabled>
          Select a plan…
        </option>
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </Select>
    </Field>
  </div>
);

/** All states — visual regression matrix. */
export const AllStates: Story = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "24rem" }}
  >
    {[
      { label: "Default", props: {} },
      { label: "Disabled", props: { disabled: true } },
      { label: "Invalid", props: { invalid: true } },
    ].map(({ label, props }) => (
      <div key={label}>
        <label htmlFor={`state-${label}`}>{label}</label>
        <Select
          id={`state-${label}`}
          defaultValue="a"
          style={{ marginTop: "var(--space-1)" }}
          {...(props as Partial<SelectProps>)}
        >
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      </div>
    ))}
  </div>
);
