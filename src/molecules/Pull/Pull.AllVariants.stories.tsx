import type { Story, StoryDefault } from "@ladle/react";
import { Pull } from "./Pull";

export default {
  title: "Components / Pull / All Variants",
} satisfies StoryDefault;

/** AllVariants — design matrix: serif/sans × with/without attribution, stacked vertically. */
export const AllVariants: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <p
      style={{ margin: "0 0 var(--space-2)", fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}
    >
      serif / no attribution
    </p>
    <Pull variant="serif">
      The smallest real deployment teaches more than six months of staging.
    </Pull>

    <p
      style={{ margin: "0 0 var(--space-2)", fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}
    >
      serif / with attribution
    </p>
    <Pull variant="serif" attribution="— from §3, Engineering culture">
      Pilots fail because they are rehearsals. The loop that matters is the one that runs in
      production, not staging.
    </Pull>

    <p
      style={{ margin: "0 0 var(--space-2)", fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}
    >
      sans / no attribution
    </p>
    <Pull variant="sans">
      The smallest real deployment teaches more than six months of staging.
    </Pull>

    <p
      style={{ margin: "0 0 var(--space-2)", fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}
    >
      sans / with attribution
    </p>
    <Pull variant="sans" attribution="— from §3, Engineering culture">
      Pilots fail because they are rehearsals. The loop that matters is the one that runs in
      production, not staging.
    </Pull>
  </div>
);

/** InArticleRhythm — two paragraphs of lorem prose above the Pull, two below.
 *  Verifies that margin-block (--space-8) reads as natural breathing room and
 *  Pull does not disrupt the article flow. */
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
