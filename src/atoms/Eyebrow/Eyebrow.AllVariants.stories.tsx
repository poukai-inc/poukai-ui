import type { Story, StoryDefault } from "@ladle/react";
import { Eyebrow } from "./Eyebrow";

export default {
  title: "Components / Eyebrow / All Variants",
} satisfies StoryDefault;

/** Full variant matrix — muted, solid, numbered — stacked for visual comparison. */
export const AllVariants: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
      padding: "var(--space-8)",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        muted (default)
      </span>
      <Eyebrow variant="muted">Role 01</Eyebrow>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        solid
      </span>
      <Eyebrow variant="solid">Engineering</Eyebrow>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        numbered (muted + numeral slot)
      </span>
      <Eyebrow variant="numbered" numeral="FM-03">
        Failure Mode
      </Eyebrow>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        style={{
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        numbered with separator in numeral string
      </span>
      <Eyebrow variant="numbered" numeral="01 ·">
        Principle
      </Eyebrow>
    </div>
  </div>
);

/**
 * Tracking comparison — three instances at 0.04em / 0.06em / 0.08em side by side.
 *
 * For the design decision record: demonstrates why `--tracking-eyebrow: 0.06em`
 * was chosen as the canonical value. Can be removed after sign-off.
 */
export const TrackingComparison: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
      padding: "var(--space-8)",
    }}
  >
    <p style={{ margin: 0, fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
      All at <code>--fs-meta</code> (14px), <code>--font-sans</code>, weight 500, uppercase.
    </p>

    {(
      [
        { tracking: "0.04em", label: "0.04em — .micro global utility (too tight for all-caps)" },
        { tracking: "0.06em", label: "0.06em — --tracking-eyebrow (chosen)" },
        { tracking: "0.08em", label: "0.08em — FailureMode.index legacy (slightly airy)" },
      ] as const
    ).map(({ tracking, label }) => (
      <div
        key={tracking}
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}
      >
        <span
          style={{
            fontSize: "var(--fs-micro)",
            color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-meta)",
            fontWeight: 500,
            letterSpacing: tracking,
            textTransform: "uppercase",
            color: "var(--fg-muted)",
          }}
        >
          Role 01
        </span>
      </div>
    ))}
  </div>
);

/**
 * Inside a RoleCard-like mock — Eyebrow + card title on `--surface` background.
 * Verifies the composition before RoleCard adopts Eyebrow.
 */
export const InsideRoleCard: Story = () => (
  <div
    style={{
      background: "var(--surface)",
      borderRadius: "var(--radius-3)",
      padding: "var(--space-8)",
      maxWidth: "22rem",
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
    <p style={{ margin: 0, color: "var(--fg-muted)", fontSize: "var(--fs-body)" }}>
      Ships production systems end-to-end. Owns the loop from architecture to prod alert.
    </p>
  </div>
);

/**
 * Inside a Section-like mock — Eyebrow above an `<h2>` with `--space-3` gap.
 * Section marker pattern; verifies the heading pairing at page level.
 */
export const InsideSection: Story = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      padding: "var(--space-8)",
      maxWidth: "40rem",
    }}
  >
    <Eyebrow as="p">01 · Principles</Eyebrow>
    <h2 style={{ margin: 0 }}>The rules we ship by.</h2>
    <p style={{ margin: 0, color: "var(--fg-muted)" }}>
      Four principles, one constraint: every decision must make the system more operable, not less.
    </p>
  </div>
);
