import type { Story, StoryDefault } from "@ladle/react";
import { Spacer, type SpacerProps } from "./Spacer";

const ALL_SIZES: NonNullable<SpacerProps["size"]>[] = ["1", "2", "3", "4", "6", "8", "10"];

const slabStyle: React.CSSProperties = {
  background: "var(--bg-warm-accent)",
  color: "var(--fg)",
  fontFamily: "var(--font-sans)",
  padding: "var(--space-3) var(--space-4)",
};

const inlineSlab: React.CSSProperties = {
  background: "var(--bg-warm-accent)",
  color: "var(--fg)",
  fontFamily: "var(--font-sans)",
  padding: "0 var(--space-2)",
  display: "inline-block",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
};

export default {
  title: "Components / Spacer",
  args: { size: "4", axis: "block", as: "div" },
  argTypes: {
    size: {
      options: ALL_SIZES,
      control: { type: "radio" },
      defaultValue: "4",
    },
    axis: {
      options: ["block", "inline"] satisfies NonNullable<SpacerProps["axis"]>[],
      control: { type: "radio" },
      defaultValue: "block",
    },
    as: {
      options: ["div", "span"] satisfies NonNullable<SpacerProps["as"]>[],
      control: { type: "radio" },
      defaultValue: "div",
    },
  },
} satisfies StoryDefault;

/** Interactive playground — pick size, axis, and root element. */
export const Playground: Story<SpacerProps> = (args) => {
  if (args.axis === "inline") {
    return (
      <div style={{ fontFamily: "var(--font-sans)" }}>
        <span style={inlineSlab}>before</span>
        <Spacer {...args} />
        <span style={inlineSlab}>after</span>
      </div>
    );
  }
  return (
    <div>
      <div style={slabStyle}>Above the spacer</div>
      <Spacer {...args} />
      <div style={slabStyle}>Below the spacer</div>
    </div>
  );
};

/** Every block-axis size stacked. */
export const BlockAllSizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {ALL_SIZES.map((size) => (
      <div key={size}>
        <span style={labelStyle}>size="{size}" / axis="block"</span>
        <div style={slabStyle}>Above</div>
        <Spacer size={size} />
        <div style={slabStyle}>Below</div>
      </div>
    ))}
  </div>
);

/** Every inline-axis size between two inline slabs. */
export const InlineAllSizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {ALL_SIZES.map((size) => (
      <div key={size}>
        <div style={labelStyle}>size="{size}" / axis="inline"</div>
        <div style={{ fontFamily: "var(--font-sans)" }}>
          <span style={inlineSlab}>left</span>
          <Spacer as="span" axis="inline" size={size} />
          <span style={inlineSlab}>right</span>
        </div>
      </div>
    ))}
  </div>
);

/** Block axis size="1". */
export const BlockSize1: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="1" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="2". */
export const BlockSize2: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="2" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="3". */
export const BlockSize3: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="3" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="4" — canonical default beat. */
export const BlockSize4: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="4" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="6". */
export const BlockSize6: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="6" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="8" — strong editorial pause. */
export const BlockSize8: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="8" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Block axis size="10" — atom-tier ceiling. */
export const BlockSize10: Story = () => (
  <div>
    <div style={slabStyle}>Above</div>
    <Spacer size="10" />
    <div style={slabStyle}>Below</div>
  </div>
);

/** Inline axis size="1". */
export const InlineSize1: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="1" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="2". */
export const InlineSize2: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="2" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="3". */
export const InlineSize3: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="3" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="4". */
export const InlineSize4: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="4" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="6". */
export const InlineSize6: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="6" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="8". */
export const InlineSize8: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="8" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Inline axis size="10". */
export const InlineSize10: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)" }}>
    <span style={inlineSlab}>left</span>
    <Spacer as="span" axis="inline" size="10" />
    <span style={inlineSlab}>right</span>
  </div>
);

/** Both axes side by side at the same nominal size — visual sanity check. */
export const BlockVsInlineComparison: Story = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
    <div>
      <div style={labelStyle}>Block / size="6"</div>
      <div style={slabStyle}>Above</div>
      <Spacer size="6" />
      <div style={slabStyle}>Below</div>
    </div>
    <div>
      <div style={labelStyle}>Inline / size="6"</div>
      <div style={{ fontFamily: "var(--font-sans)" }}>
        <span style={inlineSlab}>left</span>
        <Spacer as="span" axis="inline" size="6" />
        <span style={inlineSlab}>right</span>
      </div>
    </div>
  </div>
);

/** Canonical use inside Prose — between a paragraph and a conditionally-rendered callout. */
export const InsideProseFlow: Story = () => (
  <div style={{ maxWidth: "36rem", fontFamily: "var(--font-serif)" }}>
    <p>
      The smallest real deployment teaches more than six months of staging. Pilots fail because
      they're rehearsals, not because the technology was wrong.
    </p>
    <Spacer size="6" />
    <blockquote
      style={{
        margin: 0,
        padding: "var(--space-4)",
        borderLeft: "2px solid var(--accent)",
        fontStyle: "italic",
        color: "var(--fg-muted)",
      }}
    >
      A note pinned to the previous paragraph — not a section, not a sibling that owns its own
      rhythm.
    </blockquote>
    <Spacer size="6" />
    <p>
      The next paragraph continues the thread. The spacer above lets the editorial beat breathe
      without bolting it to either neighbour's margin.
    </p>
  </div>
);
