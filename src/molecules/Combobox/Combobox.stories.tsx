import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Combobox } from "./Combobox";
import { Field } from "../Field/Field";

export default {
  title: "Components / Combobox",
} satisfies StoryDefault;

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Denver", label: "America/Denver" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Asia/Singapore", label: "Asia/Singapore" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
];

const GROUPED_OPTIONS = [
  { value: "react", label: "React", group: "Frontend" },
  { value: "vue", label: "Vue", group: "Frontend" },
  { value: "svelte", label: "Svelte", group: "Frontend" },
  { value: "node", label: "Node.js", group: "Backend" },
  { value: "deno", label: "Deno", group: "Backend" },
  { value: "bun", label: "Bun", group: "Backend" },
  { value: "postgres", label: "PostgreSQL", group: "Database" },
  { value: "mysql", label: "MySQL", group: "Database" },
  { value: "sqlite", label: "SQLite", group: "Database" },
];

/** (a) Default — uncontrolled, no initial selection. */
export const Default: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Combobox options={TIMEZONES} placeholder="Select timezone…" aria-label="Timezone" />
  </div>
);

/** (b) Controlled — value + onValueChange. */
export const Controlled: Story = () => {
  const [value, setValue] = useState("Europe/London");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <Combobox
        options={TIMEZONES}
        value={value}
        onValueChange={setValue}
        placeholder="Select timezone…"
        aria-label="Timezone"
      />
      <p
        style={{
          marginTop: "var(--space-4)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        Selected: <strong style={{ color: "var(--fg)" }}>{value || "(none)"}</strong>
      </p>
    </div>
  );
};

/** (c) WithField — standard label + helper composition. */
export const WithField: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <Field label="Timezone" id="story-tz" helper="Used for scheduling posts.">
        <Combobox
          id="story-tz"
          options={TIMEZONES}
          value={value}
          onValueChange={setValue}
          placeholder="Select timezone…"
        />
      </Field>
    </div>
  );
};

/** (d) Invalid — error state paired with Field. */
export const Invalid: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <Field label="Timezone" id="story-tz-err" error="Please select a timezone.">
        <Combobox
          id="story-tz-err"
          options={TIMEZONES}
          value={value}
          onValueChange={setValue}
          placeholder="Select timezone…"
        />
      </Field>
    </div>
  );
};

/** (e) Disabled — trigger blocked, no pointer events. */
export const Disabled: Story = () => (
  <div style={{ maxWidth: "24rem" }}>
    <Combobox
      options={TIMEZONES}
      value="Asia/Tokyo"
      onValueChange={() => {}}
      disabled
      aria-label="Timezone (disabled)"
    />
  </div>
);

/** (f) SizeSm — 32px trigger height, --fs-meta labels. */
export const SizeSm: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: "20rem" }}>
      <Combobox
        options={TIMEZONES}
        value={value}
        onValueChange={setValue}
        size="sm"
        placeholder="Select timezone…"
        aria-label="Timezone (sm)"
      />
    </div>
  );
};

/** (g) Grouped — options with group headings. */
export const Grouped: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <Combobox
        options={GROUPED_OPTIONS}
        value={value}
        onValueChange={setValue}
        placeholder="Select technology…"
        aria-label="Technology"
      />
    </div>
  );
};

/** (h) WithFormName — hidden input for native form submission. */
export const WithFormName: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          alert(`timezone = ${fd.get("timezone")}`);
        }}
      >
        <Field label="Timezone" id="story-tz-form">
          <Combobox
            id="story-tz-form"
            options={TIMEZONES}
            value={value}
            onValueChange={setValue}
            name="timezone"
            placeholder="Select timezone…"
          />
        </Field>
        <button
          type="submit"
          style={{
            marginTop: "var(--space-4)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-body)",
            padding: "var(--space-2) var(--space-4)",
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            borderRadius: "var(--radius-2)",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
