import type { Story, StoryDefault } from "@ladle/react";
import { Tag, type TagProps } from "./Tag";

// Minimal inline SVG star used in place of lucide-react (no runtime dep in stories)
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default {
  title: "Components / Tag",
  args: { children: "Engineering", tone: "default" },
  argTypes: {
    tone: {
      options: ["default", "muted"] satisfies NonNullable<TagProps["tone"]>[],
      control: { type: "radio" },
      defaultValue: "default",
    },
    children: {
      control: { type: "text" },
    },
  },
} satisfies StoryDefault;

/** Default tone — `--surface` fill, `--fg` text. Primary categorical label register. */
export const Default: Story = () => <Tag>Engineering</Tag>;

/** Muted tone — transparent background, `--hairline` border, `--fg-muted` text. */
export const Muted: Story = () => <Tag tone="muted">Draft</Tag>;

/**
 * With leading icon — root shifts to `inline-flex`.
 * Icon and text are center-aligned; `--space-2` gap.
 * Pass `aria-hidden="true"` on decorative icons (demonstrated here).
 */
export const WithIcon: Story = () => <Tag icon={<StarIcon />}>Featured</Tag>;

/** Muted tone with icon — border and muted text alongside an icon. */
export const MutedWithIcon: Story = () => (
  <Tag tone="muted" icon={<StarIcon />}>
    Optional
  </Tag>
);

/** All tone × icon combinations — design matrix reference. */
export const AllVariants: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <Tag>Engineering</Tag>
      <Tag icon={<StarIcon />}>Featured</Tag>
    </div>
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <Tag tone="muted">Draft</Tag>
      <Tag tone="muted" icon={<StarIcon />}>
        Optional
      </Tag>
    </div>
  </div>
);

/** Tags embedded inline in prose — verifies inline flow, no baseline disruption. */
export const InlineInProse: Story = () => (
  <p style={{ maxWidth: "36rem", lineHeight: 1.55, fontFamily: "var(--font-sans)" }}>
    Tagged in: <Tag>Engineering</Tag> and <Tag>AI Infrastructure</Tag>. Secondary label:{" "}
    <Tag tone="muted">Draft</Tag>.
  </p>
);

/** Multiple Tags in a flex row — verifies row layout and wrap behavior. */
export const FlexRow: Story = () => (
  <div
    style={{
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap",
      maxWidth: "240px",
    }}
  >
    <Tag>Engineering</Tag>
    <Tag>AI Infrastructure</Tag>
    <Tag tone="muted">Draft</Tag>
    <Tag icon={<StarIcon />}>Featured</Tag>
  </div>
);

/** Inside a mock card surface — verifies the pill reads clearly on `--surface-section`. */
export const InsideCard: Story = () => (
  <div
    style={{
      background: "var(--surface-section)",
      borderRadius: "var(--radius-3)",
      padding: "var(--space-8)",
      maxWidth: "20rem",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
    }}
  >
    <Tag>Platform</Tag>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-card-title)",
        fontWeight: 500,
        margin: 0,
        lineHeight: 1.3,
        color: "var(--fg)",
      }}
    >
      Observability
    </p>
    <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body)" }}>
      Every inference logged, traced, and alertable.
    </p>
  </div>
);
