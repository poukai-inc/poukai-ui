import type { Story, StoryDefault } from "@ladle/react";
import { X, Copy, Check, Heart, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { IconButton, type IconButtonVariant, type IconButtonSize } from "./IconButton";

export default {
  title: "Components / IconButton",
  args: { variant: "primary", size: "md", ariaLabel: "Close dialog" },
  argTypes: {
    variant: {
      options: ["primary", "secondary", "ghost"] satisfies IconButtonVariant[],
      control: { type: "radio" },
      defaultValue: "primary",
    },
    size: {
      options: ["sm", "compact", "md", "lg"] satisfies IconButtonSize[],
      control: { type: "radio" },
      defaultValue: "md",
    },
    ariaLabel: {
      control: { type: "text" },
      defaultValue: "Close dialog",
    },
  },
} satisfies StoryDefault;

export const Playground: Story<{
  variant: IconButtonVariant;
  size: IconButtonSize;
  ariaLabel: string;
}> = ({ variant, size, ariaLabel }) => (
  <IconButton icon={X} aria-label={ariaLabel} variant={variant} size={size} />
);

export const VariantsAndSizes: Story = () => {
  const variants: IconButtonVariant[] = ["primary", "secondary", "ghost"];
  const sizes: IconButtonSize[] = ["sm", "compact", "md", "lg"];
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {variants.map((v) => (
          <tr key={v}>
            <th
              style={{
                textAlign: "left",
                padding: "var(--space-2) var(--space-4)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-micro)",
                color: "var(--fg-muted)",
              }}
            >
              {v}
            </th>
            {sizes.map((s) => (
              <td key={s} style={{ padding: "var(--space-2)" }}>
                <IconButton icon={X} aria-label={`Close (${v} ${s})`} variant={v} size={s} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const PairedWithButton: Story = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "var(--space-4)",
    }}
  >
    <IconButton icon={ChevronLeft} aria-label="Previous" variant="secondary" size="md" />
    <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>Page 3 of 12</span>
    <IconButton icon={ChevronRight} aria-label="Next" variant="secondary" size="md" />
  </div>
);

export const InCardHeader: Story = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-4)",
      background: "var(--surface)",
      borderRadius: "var(--radius-3)",
      maxWidth: "32rem",
    }}
  >
    <strong style={{ fontFamily: "var(--font-sans)" }}>hello@pouk.ai</strong>
    <IconButton icon={Copy} aria-label="Copy email address" variant="ghost" size="compact" />
  </div>
);

export const Disabled: Story = () => (
  <div style={{ display: "inline-flex", gap: "var(--space-3)" }}>
    <IconButton icon={Heart} aria-label="Favourite" disabled />
    <IconButton icon={Heart} aria-label="Favourite" variant="secondary" disabled />
    <IconButton icon={Heart} aria-label="Favourite" variant="ghost" disabled />
  </div>
);

export const ColorContexts: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      padding: "var(--space-4)",
    }}
  >
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}>
      <IconButton icon={Mail} aria-label="Email" variant="primary" size="md" />
      <IconButton icon={Mail} aria-label="Email" variant="secondary" size="md" />
      <IconButton icon={Mail} aria-label="Email" variant="ghost" size="md" />
      <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
        md — primary / secondary / ghost
      </span>
    </div>
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}>
      <IconButton icon={Check} aria-label="Confirm" variant="primary" size="sm" />
      <IconButton icon={Check} aria-label="Confirm" variant="primary" size="compact" />
      <IconButton icon={Check} aria-label="Confirm" variant="primary" size="md" />
      <IconButton icon={Check} aria-label="Confirm" variant="primary" size="lg" />
      <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
        primary — sm / compact / md / lg
      </span>
    </div>
  </div>
);
