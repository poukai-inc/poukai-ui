import type { Story, StoryDefault } from "@ladle/react";
import { Skeleton, type SkeletonRadius } from "./Skeleton";

export default {
  title: "Components / Skeleton",
  args: {
    width: 200,
    height: 20,
    radius: "md" as SkeletonRadius,
  },
  argTypes: {
    radius: {
      options: ["sm", "md", "lg", "circle"] satisfies SkeletonRadius[],
      control: { type: "radio" },
      defaultValue: "md",
    },
    as: {
      options: ["div", "span"],
      control: { type: "radio" },
      defaultValue: "div",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  width: number;
  height: number;
  radius: SkeletonRadius;
  as: "div" | "span";
}> = ({ width, height, radius, as }) => (
  <Skeleton width={width} height={height} radius={radius} as={as} />
);

export const Rectangles: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-3)" }}>
    <Skeleton width="100%" height={16} radius="sm" />
    <Skeleton width="80%" height={16} radius="sm" />
    <Skeleton width="60%" height={16} radius="sm" />
  </div>
);

export const Circle: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-3)" }}>
    <Skeleton width={24} height={24} radius="circle" />
    <Skeleton width={32} height={32} radius="circle" />
    <Skeleton width={40} height={40} radius="circle" />
  </div>
);

export const Line: Story = () => (
  <div style={{ display: "grid", gap: "var(--space-2)" }}>
    <Skeleton width="100%" height={14} radius="sm" />
    <Skeleton width="75%" height={14} radius="sm" />
  </div>
);

/** Approximates a FeatureCard placeholder — three stacked skeletons. */
export const CardPlaceholder: Story = () => (
  <div
    style={{
      display: "grid",
      gap: "var(--space-3)",
      padding: "var(--space-6)",
      background: "var(--surface)",
      borderRadius: "var(--radius-3)",
      width: 320,
    }}
  >
    <Skeleton width={40} height={40} radius="md" />
    <Skeleton width="60%" height={18} radius="sm" />
    <div style={{ display: "grid", gap: "var(--space-2)" }}>
      <Skeleton width="100%" height={14} radius="sm" />
      <Skeleton width="80%" height={14} radius="sm" />
    </div>
  </div>
);

/** Inline usage — Skeleton as="span" inside paragraph text. */
export const InlineText: Story = () => (
  <p style={{ font: "var(--fs-body)/var(--lh-body) var(--font-sans)", color: "var(--fg)" }}>
    Posted by{" "}
    <Skeleton as="span" width={80} height={14} radius="sm" style={{ verticalAlign: "middle" }} />
  </p>
);

export const RadiusVariants: Story = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <Skeleton width={80} height={40} radius="sm" />
    <Skeleton width={80} height={40} radius="md" />
    <Skeleton width={80} height={40} radius="lg" />
    <Skeleton width={40} height={40} radius="circle" />
  </div>
);
