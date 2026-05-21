import type { Story, StoryDefault } from "@ladle/react";
import { Stat } from "../Stat";
import { Divider, type DividerProps } from "./Divider";

export default {
  title: "Components / Divider",
  args: { orientation: "horizontal", tone: "default" },
  argTypes: {
    orientation: {
      options: ["horizontal", "vertical"] satisfies NonNullable<DividerProps["orientation"]>[],
      control: { type: "radio" },
      defaultValue: "horizontal",
    },
    tone: {
      options: ["default", "muted"] satisfies NonNullable<DividerProps["tone"]>[],
      control: { type: "radio" },
      defaultValue: "default",
    },
    as: {
      options: ["hr", "div"],
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

/** Interactive playground — adjust orientation, tone, and as via controls. */
export const Playground: Story<DividerProps> = (args) => {
  if (args.orientation === "vertical") {
    return (
      <div style={{ display: "flex", alignItems: "center", height: "3rem", gap: "var(--space-4)" }}>
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Left</span>
        <Divider {...args} />
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Right</span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
        Above the rule
      </p>
      <Divider {...args} />
      <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
        Below the rule
      </p>
    </div>
  );
};

/** Default horizontal — `--hairline` structural separator. */
export const HorizontalDefault: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
      Section above
    </p>
    <Divider />
    <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
      Section below
    </p>
  </div>
);

/** Muted horizontal — `--hairline-soft` decorative separator. */
export const HorizontalMuted: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
      Section above
    </p>
    <Divider tone="muted" />
    <p style={{ margin: 0, fontFamily: "var(--font-sans)", color: "var(--fg-muted)" }}>
      Section below
    </p>
  </div>
);

/** Default vertical — `--hairline` rule inside a flex row. Parent must be flex. */
export const VerticalDefault: Story = () => (
  <div style={{ display: "flex", alignItems: "center", height: "3rem", gap: "var(--space-4)" }}>
    <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Observers</span>
    <Divider orientation="vertical" />
    <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Engineers</span>
    <Divider orientation="vertical" />
    <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Advisors</span>
  </div>
);

/** Muted vertical — `--hairline-soft` rule inside a flex row. */
export const VerticalMuted: Story = () => (
  <div style={{ display: "flex", alignItems: "center", height: "3rem", gap: "var(--space-4)" }}>
    <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Left</span>
    <Divider orientation="vertical" tone="muted" />
    <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>Right</span>
  </div>
);

/** `as="div"` override on horizontal — valid when `<hr>` semantics are inappropriate. */
export const HorizontalAsDiv: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      Before (div root, role=separator)
    </span>
    <Divider as="div" />
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      After
    </span>
  </div>
);

/** All four orientation × tone combinations on one canvas. */
export const AllVariants: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Horizontal / default
      </span>
      <Divider />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Horizontal / muted
      </span>
      <Divider tone="muted" />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Vertical / default
      </span>
      <div
        style={{ display: "flex", alignItems: "center", height: "2.5rem", gap: "var(--space-4)" }}
      >
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>A</span>
        <Divider orientation="vertical" />
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>B</span>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
        }}
      >
        Vertical / muted
      </span>
      <div
        style={{ display: "flex", alignItems: "center", height: "2.5rem", gap: "var(--space-4)" }}
      >
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>A</span>
        <Divider orientation="vertical" tone="muted" />
        <span style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>B</span>
      </div>
    </div>
  </div>
);

/** Between Stats — a common composition pattern. */
export const BetweenStats: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-8)",
      flexWrap: "wrap",
    }}
  >
    <Stat value="85%" caption="of teams plateau at pilot." source="MIT Sloan, 2025" />
    <Divider orientation="vertical" />
    <Stat value="6×" caption="faster time to production." source="Internal, 2024" />
    <Divider orientation="vertical" tone="muted" />
    <Stat value="3" caption="enterprise clients closed via referral." />
  </div>
);
