import type { Story, StoryDefault } from "@ladle/react";
import { Disclosure } from "./Disclosure";

export default {
  title: "Molecules / Disclosure",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Disclosure summary="What is Poukai?">
    <p>
      Poukai is a senior-only AI consulting practice that ships production AI systems end-to-end.
    </p>
  </Disclosure>
);

export const DefaultOpen: Story = () => (
  <Disclosure summary="What is Poukai?" defaultOpen>
    <p>
      Poukai is a senior-only AI consulting practice that ships production AI systems end-to-end.
    </p>
  </Disclosure>
);

export const ShowDetails: Story = () => (
  <div style={{ maxWidth: "40rem" }}>
    <p style={{ marginBottom: "var(--space-4)", color: "var(--fg)" }}>
      This engagement includes a six-week discovery phase, a working prototype, and a production
      hand-off checklist.
    </p>
    <Disclosure summary="Show full scope details">
      <p style={{ color: "var(--fg-muted)", margin: 0 }}>
        Week 1–2: stakeholder interviews and data audit. Week 3–4: prototype + evals. Week 5–6:
        production cut-over, documentation, and team hand-off.
      </p>
    </Disclosure>
  </div>
);

export const SettingsRow: Story = () => (
  <div
    style={{
      maxWidth: "32rem",
      border: "var(--hairline-w) solid var(--hairline)",
      borderRadius: "var(--radius-3)",
      overflow: "hidden",
    }}
  >
    <Disclosure summary="Advanced settings">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          paddingInline: "var(--space-4)",
          paddingBlockEnd: "var(--space-4)",
        }}
      >
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
          }}
        >
          <span>Enable telemetry</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--fs-body)",
            color: "var(--fg)",
          }}
        >
          <span>Verbose logging</span>
          <input type="checkbox" />
        </label>
      </div>
    </Disclosure>
    <Disclosure summary="Danger zone" tone="muted" divider>
      <p style={{ color: "var(--fg-muted)", margin: 0, paddingInline: "var(--space-4)" }}>
        Destructive actions live here. Proceed with caution.
      </p>
    </Disclosure>
  </div>
);
