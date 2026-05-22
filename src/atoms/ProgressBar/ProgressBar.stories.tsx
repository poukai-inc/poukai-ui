import type { Story, StoryDefault } from "@ladle/react";
import { ProgressBar, type ProgressBarSize, type ProgressBarTone } from "./ProgressBar";

export default {
  title: "Components / ProgressBar",
  args: { value: 60, size: "md", tone: "default" },
  argTypes: {
    size: {
      options: ["sm", "md"] satisfies ProgressBarSize[],
      control: { type: "radio" },
      defaultValue: "md",
    },
    tone: {
      options: ["default", "success", "warning", "danger"] satisfies ProgressBarTone[],
      control: { type: "radio" },
      defaultValue: "default",
    },
    value: {
      control: { type: "number", min: 0, max: 100 },
      defaultValue: 60,
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{ value: number; size: ProgressBarSize; tone: ProgressBarTone }> = ({
  value,
  size,
  tone,
}) => (
  <div style={{ width: "20rem", padding: "var(--space-4)" }}>
    <ProgressBar value={value} size={size} tone={tone} aria-label="Playground progress" />
  </div>
);

/* ---------- Tone × Size matrix (8 cells, value=60) ---------- */

export const ToneSizeMatrix: Story = () => {
  const tones: ProgressBarTone[] = ["default", "success", "warning", "danger"];
  const sizes: ProgressBarSize[] = ["md", "sm"];
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: "24rem" }}
    >
      {tones.map((tone) =>
        sizes.map((size) => (
          <div key={`${tone}-${size}`}>
            <p
              style={{
                fontSize: "var(--fs-meta)",
                color: "var(--fg-muted)",
                margin: "0 0 var(--space-2)",
              }}
            >
              tone="{tone}" size="{size}"
            </p>
            <ProgressBar
              value={60}
              size={size}
              tone={tone}
              aria-label={`${tone} ${size} progress at 60%`}
            />
          </div>
        )),
      )}
    </div>
  );
};

/* ---------- Determinate values ---------- */

export const DeterminateValues: Story = () => {
  const values = [0, 25, 50, 75, 100];
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "24rem" }}
    >
      {values.map((v) => (
        <div key={v}>
          <p
            style={{
              fontSize: "var(--fs-meta)",
              color: "var(--fg-muted)",
              margin: "0 0 var(--space-2)",
            }}
          >
            value={v}
          </p>
          <ProgressBar value={v} aria-label={`Progress at ${v}%`} />
        </div>
      ))}
    </div>
  );
};

/* ---------- Indeterminate (both sizes) ---------- */

export const Indeterminate: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: "24rem" }}>
    <div>
      <p
        style={{
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
          margin: "0 0 var(--space-2)",
        }}
      >
        size="md" (indeterminate)
      </p>
      <ProgressBar size="md" aria-label="Generating response" />
    </div>
    <div>
      <p
        style={{
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
          margin: "0 0 var(--space-2)",
        }}
      >
        size="sm" (indeterminate)
      </p>
      <ProgressBar size="sm" aria-label="Loading data" />
    </div>
  </div>
);

/* ---------- Out-of-range clamping ---------- */

export const OutOfRange: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: "24rem" }}>
    <div>
      <p
        style={{
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
          margin: "0 0 var(--space-2)",
        }}
      >
        value=-10 → clamped to 0 (empty track)
      </p>
      <ProgressBar value={-10} aria-label="Negative value clamped to zero" />
    </div>
    <div>
      <p
        style={{
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
          margin: "0 0 var(--space-2)",
        }}
      >
        value=150 → clamped to 100 (full track)
      </p>
      <ProgressBar value={150} aria-label="Over-range value clamped to 100" />
    </div>
  </div>
);

/* ---------- aria-label ---------- */

export const WithAriaLabel: Story = () => (
  <div style={{ width: "24rem" }}>
    <ProgressBar value={42} aria-label="Uploading report.pdf" />
  </div>
);

/* ---------- aria-labelledby (referencing a sibling label element) ---------- */

export const WithAriaLabelledBy: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", width: "24rem" }}>
    <p
      id="upload-label-story"
      style={{ fontSize: "var(--fs-meta)", color: "var(--fg)", margin: 0 }}
    >
      Uploading report.pdf
    </p>
    <ProgressBar value={42} aria-labelledby="upload-label-story" />
    <p style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)", margin: 0 }}>42%</p>
  </div>
);
