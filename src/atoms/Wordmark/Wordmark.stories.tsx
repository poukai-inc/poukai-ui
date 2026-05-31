import type { Story } from "@ladle/react";
import { Wordmark } from "./Wordmark";

export default {
  title: "Atoms / Wordmark",
};

export const Default: Story = () => <Wordmark height={80} />;

export const Small: Story = () => <Wordmark height={32} />;

export const Inverted: Story = () => (
  <div style={{ background: "var(--fg)", padding: "var(--space-12)", color: "var(--bg)" }}>
    <Wordmark height={64} />
  </div>
);

export const ScaledRow: Story = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-8)" }}>
    {[24, 40, 64, 96].map((h) => (
      <Wordmark key={h} height={h} />
    ))}
  </div>
);

/**
 * White-label path: `src` supplied. The image renders at `height={64}` with
 * `width="auto"`. Colors are baked into the asset — `currentColor` does NOT apply.
 *
 * Using an inline SVG data URI here so the story works offline in Ladle without
 * a network asset. In production you would pass a CDN URL or a relative asset path.
 *
 * Note: the `data:` scheme is blocked by the component's safe-src guard —
 * `data:image/*` URIs are intentionally not on the allowlist (consistent with the
 * AudioPlayer / VideoEmbed hardening posture). For story purposes we use an absolute
 * https URL that falls back gracefully to the bundled mark when offline.
 */
export const WhiteLabelSrc: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
    <p style={{ font: "var(--text-caption)", color: "var(--fg-muted)" }}>
      White-label via https src:
    </p>
    <Wordmark
      height={64}
      label="Example brand"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg"
    />
    <p
      style={{ font: "var(--text-caption)", color: "var(--fg-muted)", marginTop: "var(--space-8)" }}
    >
      Unsafe scheme (javascript:) — falls back to bundled SVG mark:
    </p>
    {/* eslint-disable-next-line no-script-url */}
    <Wordmark height={64} label="Poukai" src="javascript:void(0)" />
  </div>
);
