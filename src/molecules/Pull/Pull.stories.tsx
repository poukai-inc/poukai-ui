import type { Story, StoryDefault } from "@ladle/react";
import { Pull } from "./Pull";

export default {
  title: "Components / Pull",
} satisfies StoryDefault;

/** Default — body text only, serif variant (default).
 *  Verifies font (Instrument Serif italic), --fs-pull size, left rule, and block margin. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pull>The smallest real deployment teaches more than six months of staging.</Pull>
  </div>
);

/** WithAttribution — body text + attribution line.
 *  Verifies --space-2 gap, attribution color (--fg-muted), italic style, --fs-meta size. */
export const WithAttribution: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pull attribution="— from §3, Engineering culture">
      Pilots fail because they are rehearsals. The loop that matters is the one that runs in
      production, not staging.
    </Pull>
  </div>
);

/** LongBody — multi-sentence pull (~40 words).
 *  Verifies line-height (1.45) and that max-width (--hero-max) constrains correctly at wide viewports. */
export const LongBody: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pull attribution="— originally published in the team handbook">
      Most teams stop at the demo. The demo dazzles; the production loop never closes. The instinct
      to run another sprint of staging instead of shipping to a single real customer is the most
      expensive mistake in the AI pilot cycle.
    </Pull>
  </div>
);

/** SansVariant — variant="sans" body only, with serif for direct comparison.
 *  Verifies Geist roman renders at --fs-pull, no italic. */
export const SansVariant: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)",
    }}
  >
    <div>
      <p
        style={{
          margin: "0 0 var(--space-2)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        variant="serif" (default)
      </p>
      <Pull variant="serif">
        The smallest real deployment teaches more than six months of staging.
      </Pull>
    </div>
    <div>
      <p
        style={{
          margin: "0 0 var(--space-2)",
          fontSize: "var(--fs-meta)",
          color: "var(--fg-muted)",
        }}
      >
        variant="sans"
      </p>
      <Pull variant="sans">
        The smallest real deployment teaches more than six months of staging.
      </Pull>
    </div>
  </div>
);

/** AsidePolymorphism — as="aside" + body + attribution.
 *  Verifies root element is <aside>, cite prop is not rendered as an attribute,
 *  and attribution renders as <p> (not <footer>). */
export const AsidePolymorphism: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pull as="aside" cite="https://example.com/source" attribution="— from §3, Engineering culture">
      The instinct to run another sprint of staging instead of shipping to a single real customer is
      the most expensive mistake in the AI pilot cycle.
    </Pull>
  </div>
);

/** InArticleRhythm — two paragraphs above and below the Pull.
 *  Primary smoke test: verifies margin-block (--space-8) reads as natural editorial
 *  breathing room and Pull does not disrupt article flow.
 *
 *  Note: gap between adjacent <p> margin-bottom (--space-4) and Pull margin-block-start
 *  (--space-8) is additive (48px total, no CSS margin collapse). This reads correctly
 *  at the --fs-pull register — see Pull.module.css comment for full rationale. */
export const InArticleRhythm: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "var(--hero-max)",
    }}
  >
    <p>
      Pilots fail because they are rehearsals. Every staging environment is a model of production,
      not production itself. The signal you need lives in real usage — in the edge cases users
      actually hit, in the latency of real infrastructure, in the behavior of real data.
    </p>
    <p>
      The team that spends three months hardening a demo is trading signal for comfort. They know
      the demo well. They do not know the product.
    </p>
    <Pull attribution="— from §3, Engineering culture">
      The smallest real deployment teaches more than six months of staging.
    </Pull>
    <p>
      Ship the smallest real system. Instrument everything. Iterate on signal. This is not a
      philosophy — it is the only method that closes the loop.
    </p>
    <p>
      The gap between pilot and production is not a technical problem. It is a decision problem.
      Every week spent in staging is a week of not knowing what you are actually building.
    </p>
  </div>
);
