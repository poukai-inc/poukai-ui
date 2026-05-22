import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Checkbox, type CheckboxCheckedState } from "./Checkbox";

export default {
  title: "Components / Checkbox",
} satisfies StoryDefault;

/* ---------- Static state stories ---------- */

export const Unchecked: Story = () => <Checkbox aria-label="Unchecked" />;

export const Checked: Story = () => <Checkbox checked aria-label="Checked" />;

export const Indeterminate: Story = () => (
  <Checkbox checked="indeterminate" aria-label="Indeterminate" />
);

export const DisabledUnchecked: Story = () => <Checkbox disabled aria-label="Disabled unchecked" />;

export const DisabledChecked: Story = () => (
  <Checkbox checked disabled aria-label="Disabled checked" />
);

export const DisabledIndeterminate: Story = () => (
  <Checkbox checked="indeterminate" disabled aria-label="Disabled indeterminate" />
);

export const Invalid: Story = () => <Checkbox aria-invalid="true" aria-label="Invalid checkbox" />;

/* ---------- Controlled ---------- */

export const Controlled: Story = () => {
  const [checked, setChecked] = useState<CheckboxCheckedState>(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg)",
      }}
    >
      <Checkbox
        id="controlled-story"
        checked={checked}
        onCheckedChange={setChecked}
        aria-label="Controlled checkbox"
      />
      <label htmlFor="controlled-story" style={{ cursor: "pointer" }}>
        Controlled — state:{" "}
        <code
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-micro)",
            background: "var(--surface)",
            padding: "2px 4px",
            borderRadius: "var(--radius-1)",
          }}
        >
          {String(checked)}
        </code>
      </label>
    </div>
  );
};

/* ---------- Uncontrolled ---------- */

export const Uncontrolled: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-meta)",
      color: "var(--fg)",
    }}
  >
    <Checkbox id="uncontrolled-story" defaultChecked />
    <label htmlFor="uncontrolled-story" style={{ cursor: "pointer" }}>
      Uncontrolled — starts checked
    </label>
  </div>
);

/* ---------- All states matrix ---------- */

export const AllStates: Story = () => {
  const rows: Array<{ label: string; props: React.ComponentProps<typeof Checkbox> }> = [
    { label: "Unchecked", props: {} },
    { label: "Checked", props: { checked: true } },
    { label: "Indeterminate", props: { checked: "indeterminate" } },
    { label: "Disabled unchecked", props: { disabled: true } },
    { label: "Disabled checked", props: { checked: true, disabled: true } },
    { label: "Disabled indeterminate", props: { checked: "indeterminate", disabled: true } },
    { label: "Invalid", props: { "aria-invalid": "true" } },
  ];

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {rows.map(({ label, props }) => (
          <tr key={label}>
            <td
              style={{
                padding: "var(--space-2) var(--space-4) var(--space-2) 0",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </td>
            <td style={{ padding: "var(--space-2)" }}>
              <Checkbox aria-label={label} {...props} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
