import type { Story, StoryDefault } from "@ladle/react";
import { StatusDot, type StatusDotTone, type StatusDotSize } from "./StatusDot";

export default {
  title: "Atoms / StatusDot",
  args: { tone: "neutral", size: "md", disabled: false },
  argTypes: {
    tone: {
      options: [
        "neutral",
        "info",
        "success",
        "warning",
        "danger",
        "accent",
      ] satisfies StatusDotTone[],
      control: { type: "radio" },
    },
    size: {
      options: ["sm", "md"] satisfies StatusDotSize[],
      control: { type: "radio" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  tone: StatusDotTone;
  size: StatusDotSize;
  disabled: boolean;
}> = ({ tone, size, disabled }) => (
  <StatusDot tone={tone} size={size} disabled={disabled} aria-label={`Status: ${tone}`} />
);

export const AllTones: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <StatusDot tone="neutral" aria-label="Neutral" />
    <StatusDot tone="info" aria-label="Info" />
    <StatusDot tone="success" aria-label="Success" />
    <StatusDot tone="warning" aria-label="Warning" />
    <StatusDot tone="danger" aria-label="Danger" />
    <StatusDot tone="accent" aria-label="Accent" />
  </div>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <StatusDot tone="success" size="sm" aria-label="Small success dot" />
    <StatusDot tone="success" size="md" aria-label="Medium success dot" />
  </div>
);

export const Disabled: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <StatusDot tone="neutral" disabled aria-label="Neutral (disabled)" />
    <StatusDot tone="success" disabled aria-label="Success (disabled)" />
    <StatusDot tone="warning" disabled aria-label="Warning (disabled)" />
    <StatusDot tone="danger" disabled aria-label="Danger (disabled)" />
    <StatusDot tone="accent" disabled aria-label="Accent (disabled)" />
  </div>
);

export const ToneMatrix: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    {(["neutral", "info", "success", "warning", "danger", "accent"] as StatusDotTone[]).map(
      (tone) => (
        <div key={tone} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <StatusDot tone={tone} aria-hidden />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}>{tone}</span>
        </div>
      ),
    )}
  </div>
);

export const DecorativePattern: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    {/* aria-hidden dot alongside a visible text label — the accessible pattern when text is present */}
    <StatusDot tone="success" aria-hidden />
    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-meta)" }}>Published</span>
  </div>
);

export const StandalonePattern: Story = () => (
  /* role="img" + aria-label — the accessible pattern without adjacent text */
  <StatusDot tone="danger" aria-label="Failed — last deploy errored" />
);

export const KanbanRowExample: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <StatusDot tone="success" size="md" aria-hidden />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}>
        Sprint retrospective notes
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <StatusDot tone="warning" size="md" aria-hidden />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}>
        Q3 roadmap review — stale 14 days
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <StatusDot tone="danger" size="md" aria-hidden />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}>
        Deploy pipeline — failed
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <StatusDot tone="accent" size="md" aria-hidden />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}>
        Active feature branch
      </span>
    </div>
  </div>
);
