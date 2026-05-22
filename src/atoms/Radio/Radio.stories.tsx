import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Radio } from "./Radio";
import { RadioGroup } from "./Radio";

export default {
  title: "Components / Radio",
} satisfies StoryDefault;

/** Single unselected radio — control only, no label. */
export const Unselected: Story = () => (
  <RadioGroup aria-label="Single unselected">
    <Radio value="a" />
  </RadioGroup>
);

/** Single selected radio — controlled at "a". */
export const Selected: Story = () => (
  <RadioGroup value="a" onValueChange={() => undefined} aria-label="Single selected">
    <Radio value="a" />
  </RadioGroup>
);

/** Vertical group (default orientation) — 3 options with wrapping labels. */
export const VerticalGroup: Story = () => {
  const [value, setValue] = useState("monthly");
  return (
    <RadioGroup value={value} onValueChange={setValue} aria-label="Billing plan">
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <Radio value="monthly" />
        Monthly
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <Radio value="annual" />
        Annual
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <Radio value="lifetime" />
        Lifetime
      </label>
    </RadioGroup>
  );
};

/** Horizontal group — orientation="horizontal", row layout with --space-4 gap. */
export const HorizontalGroup: Story = () => {
  const [value, setValue] = useState("s");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      orientation="horizontal"
      aria-label="T-shirt size"
    >
      {(["XS", "S", "M", "L", "XL"] as const).map((s) => (
        <label
          key={s}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          <Radio value={s.toLowerCase()} />
          {s}
        </label>
      ))}
    </RadioGroup>
  );
};

/** Controlled — value state managed externally, updates on selection. */
export const Controlled: Story = () => {
  const [value, setValue] = useState("engineer");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <RadioGroup value={value} onValueChange={setValue} aria-label="Role">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          <Radio value="engineer" id="role-engineer" />
          Engineer
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          <Radio value="designer" id="role-designer" />
          Designer
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
            cursor: "pointer",
          }}
        >
          <Radio value="pm" id="role-pm" />
          Product Manager
        </label>
      </RadioGroup>
      <p style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)", margin: 0 }}>
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
};

/** Disabled item — the middle option is individually disabled. */
export const DisabledItem: Story = () => (
  <RadioGroup defaultValue="standard" aria-label="Shipping speed">
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg)",
        cursor: "pointer",
      }}
    >
      <Radio value="standard" />
      Standard (3–5 days)
    </label>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg-muted)",
        cursor: "not-allowed",
      }}
    >
      <Radio value="express" disabled />
      Express (unavailable)
    </label>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg)",
        cursor: "pointer",
      }}
    >
      <Radio value="overnight" />
      Overnight
    </label>
  </RadioGroup>
);

/** Disabled group — all items disabled at the group level. */
export const DisabledGroup: Story = () => (
  <RadioGroup defaultValue="monthly" disabled aria-label="Billing plan (disabled)">
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg-muted)",
        cursor: "not-allowed",
      }}
    >
      <Radio value="monthly" />
      Monthly
    </label>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg-muted)",
        cursor: "not-allowed",
      }}
    >
      <Radio value="annual" />
      Annual
    </label>
  </RadioGroup>
);

/**
 * Invalid group — aria-invalid="true" on items signals an error condition.
 * Pair with a visible error message linked via aria-describedby in production.
 *
 * Note: Field+RadioGroup cloneElement wiring is deferred to a follow-up PR.
 * aria-invalid is set manually on each Radio here.
 */
export const InvalidGroup: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
    <RadioGroup aria-label="Preferred contact" aria-describedby="contact-error">
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <Radio value="email" aria-invalid="true" />
        Email
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <Radio value="phone" aria-invalid="true" />
        Phone
      </label>
    </RadioGroup>
    <p
      id="contact-error"
      style={{
        margin: 0,
        fontSize: "var(--fs-meta)",
        color: "var(--danger)",
        fontFamily: "var(--font-sans)",
      }}
    >
      Please select one option.
    </p>
  </div>
);

/** Uncontrolled — defaultValue sets the initial selection; no state management needed. */
export const Uncontrolled: Story = () => (
  <RadioGroup defaultValue="standard" name="shipping" aria-label="Shipping speed">
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg)",
        cursor: "pointer",
      }}
    >
      <Radio value="standard" />
      Standard (3–5 days)
    </label>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-body)",
        color: "var(--fg)",
        cursor: "pointer",
      }}
    >
      <Radio value="express" />
      Express (1–2 days)
    </label>
  </RadioGroup>
);
