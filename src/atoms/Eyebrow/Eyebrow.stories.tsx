import type { Story, StoryDefault } from "@ladle/react";
import { Eyebrow, type EyebrowVariant } from "./Eyebrow";

export default {
  title: "Components / Eyebrow",
  args: { children: "Role 01", variant: "muted" },
  argTypes: {
    variant: {
      options: ["muted", "solid", "numbered"] satisfies EyebrowVariant[],
      control: { type: "radio" },
      defaultValue: "muted",
    },
  },
} satisfies StoryDefault;

/** Default — `muted` variant, plain text label. No numeral slot. */
export const Default: Story = () => <Eyebrow>Role 01</Eyebrow>;

/** Solid — full-contrast color register. */
export const Solid: Story = () => <Eyebrow variant="solid">Engineering</Eyebrow>;

/** Numbered — activates the inline numeral slot with `--space-2` gap. */
export const Numbered: Story = () => (
  <Eyebrow variant="numbered" numeral="01 ·">
    Principle
  </Eyebrow>
);

/**
 * Inside a RoleCard-like mock — Eyebrow above a card title on `--surface`.
 * Verifies the composition before RoleCard adopts Eyebrow.
 */
export const InsideRoleCard: Story = () => (
  <div
    style={{
      background: "var(--surface)",
      borderRadius: "var(--radius-3)",
      padding: "var(--space-8)",
      maxWidth: "20rem",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
    }}
  >
    <Eyebrow>Role 01</Eyebrow>
    <p
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "var(--fs-card-title)",
        fontWeight: 400,
        margin: 0,
        lineHeight: 1.2,
        color: "var(--fg)",
      }}
    >
      Builder
    </p>
    <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-meta)" }}>
      Ships production systems end-to-end.
    </p>
  </div>
);

/**
 * Inside a Section-like mock — Eyebrow above an `<h2>` with `--space-3` gap.
 * Section marker pattern; verifies the heading pairing.
 */
export const InsideSection: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      maxWidth: "36rem",
    }}
  >
    <Eyebrow as="p">01 · Principles</Eyebrow>
    <h2 style={{ margin: 0 }}>The rules we ship by.</h2>
  </div>
);
