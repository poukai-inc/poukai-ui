import type { Story } from "@ladle/react";
import { Mail, Heart, Check, AlertCircle } from "lucide-react";
import { Icon } from "./Icon";
import type { IconProps, IconSize } from "./Icon";

export default {
  title: "Atoms/Icon",
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg"] satisfies IconSize[],
      defaultValue: "sm",
    },
    decorative: {
      control: { type: "boolean" },
      defaultValue: true,
    },
  },
};

export const Playground: Story<IconProps> = ({ size = "sm", decorative = true, ...rest }) => (
  <Icon icon={Mail} size={size} decorative={decorative} aria-label="Mail" {...rest} />
);

export const AllSizes: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      padding: "var(--space-4)",
    }}
  >
    {(["xs", "sm", "md", "lg"] satisfies IconSize[]).map((s) => (
      <div key={s} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <Icon icon={Mail} size={s} />
        <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
          size="{s}" — {({ xs: 12, sm: 16, md: 20, lg: 24 } as const)[s]}px (var(--icon-{s}))
        </span>
      </div>
    ))}
  </div>
);

export const DecorativeDefault: Story = () => (
  <div style={{ padding: "var(--space-4)" }}>
    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        marginBottom: "var(--space-3)",
      }}
    >
      Decorative (default) — aria-hidden="true", removed from a11y tree:
    </p>
    <Icon icon={Heart} size="md" />
  </div>
);

export const Semantic: Story = () => (
  <div style={{ padding: "var(--space-4)" }}>
    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        marginBottom: "var(--space-3)",
      }}
    >
      Semantic — decorative=&#123;false&#125; with aria-label, role="img":
    </p>
    <Icon icon={AlertCircle} size="md" decorative={false} aria-label="Warning: action required" />
  </div>
);

export const InlineWithText: Story = () => (
  <div
    style={{
      padding: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
    }}
  >
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Icon icon={Check} size="sm" />
      <span style={{ fontSize: "var(--fs-meta)" }}>Confirmed — xs icon with meta text</span>
    </div>
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Icon icon={Mail} size="sm" />
      <span style={{ fontSize: "var(--fs-body)" }}>hello@pouk.ai</span>
    </div>
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Icon icon={Heart} size="md" />
      <span style={{ fontSize: "var(--fs-body)" }}>Paired with body-scale text</span>
    </div>
  </div>
);

export const CurrentColorInheritance: Story = () => (
  <div
    style={{
      padding: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
    }}
  >
    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        marginBottom: "var(--space-2)",
      }}
    >
      Icon inherits color from parent — no color prop on Icon itself:
    </p>
    <div
      style={{
        color: "var(--fg)",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
    >
      <Icon icon={Mail} size="sm" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--fg (primary)</span>
    </div>
    <div
      style={{
        color: "var(--fg-muted)",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
    >
      <Icon icon={Mail} size="sm" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--fg-muted (secondary)</span>
    </div>
    <div
      style={{
        color: "var(--accent)",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
    >
      <Icon icon={Mail} size="sm" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--accent (link/focus)</span>
    </div>
    <div
      style={{
        color: "var(--danger)",
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
    >
      <Icon icon={AlertCircle} size="sm" />
      <span style={{ fontSize: "var(--fs-meta)" }}>--danger (error state)</span>
    </div>
  </div>
);
