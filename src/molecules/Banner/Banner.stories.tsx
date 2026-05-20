import type { Story, StoryDefault } from "@ladle/react";
import { Banner } from "./Banner";
import { Button } from "../../atoms/Button/Button";

export default {
  title: "Components / Banner",
} satisfies StoryDefault;

/** InfoDefault — quiet, on-page register. No icon, no action.
 *  Verifies: role="status", --bg background, --hairline border, --fg text,
 *  --font-sans, --fs-body, --lh-body, --radius-2, --space-3/--space-4 padding. */
export const InfoDefault: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner tone="info">
      Your session will expire in 15 minutes. Save your work to avoid losing changes.
    </Banner>
  </div>
);

/** Warning — tinted cream surface (--bg-warning), assertive live region, amber left rule.
 *  Verifies: role="alert", --bg-warning background, --fg-on-warning text,
 *  2px border-inline-start using --warning (amber). Visually distinct from danger (pink surface). */
export const Warning: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner tone="warning">
      Your API key expires in 3 days. Rotate it before the deadline to prevent service interruption.
    </Banner>
  </div>
);

/** Danger — tinted pink surface (--bg-danger), assertive live region, true-red left rule.
 *  Verifies: role="alert", --bg-danger background, --fg-on-danger text,
 *  2px border-inline-start using --danger (red). Visually distinct from warning (cream surface). */
export const Danger: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner tone="danger">
      Deployment failed. The build exited with code 1. Check the logs and redeploy.
    </Banner>
  </div>
);

/** Success — elevated surface, accent left rule, polite live region.
 *  Verifies: role="status", --bg-elevated background, 2px --accent border-inline-start,
 *  --hairline full border, --fg text. */
export const Success: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner tone="success">Deployment complete. Your changes are live at pouk.ai.</Banner>
  </div>
);

/** WithAction — info tone with a ghost Button in the action slot.
 *  Verifies: action slot renders end-aligned, focus order is body→action,
 *  Button variant="ghost" composes cleanly inside Banner. */
export const WithAction: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner
      tone="info"
      action={
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
      }
    >
      A new version of the design system is available. Update to get the latest components.
    </Banner>
  </div>
);

/** WithIcon — success tone with a leading SVG icon in the icon slot.
 *  Verifies: icon slot renders before body, icon is decorative (aria-hidden on SVG),
 *  icon aligns vertically with first line of body text. */
export const WithIcon: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner
      tone="success"
      icon={
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
    >
      Your changes have been saved successfully.
    </Banner>
  </div>
);

/** AllTones — all four tones stacked for visual comparison.
 *  Design-matrix story. Each tone is now visually distinct:
 *  info=page canvas (--bg), warning=cream (--bg-warning), danger=pink (--bg-danger), success=elevated (--bg-elevated).
 *  warning and danger no longer share the same --bg-warm-accent surface. */
export const AllTones: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
    }}
  >
    <Banner tone="info">Info — session will expire in 15 minutes.</Banner>
    <Banner tone="warning">Warning — API key expires in 3 days.</Banner>
    <Banner tone="danger">Danger — deployment failed. Check the logs.</Banner>
    <Banner tone="success">Success — deployment complete. Changes are live.</Banner>
  </div>
);

/** WithIconAndAction — full anatomy: icon + body + action. Warning tone.
 *  warning now uses --bg-warning (cream) with --fg-on-warning text.
 *  <Button variant="ghost"> (--fg text, ~16:1 on --bg-warning) composes cleanly on the new tinted surface.
 *  NOTE: The previous constraint about --fg-on-warm over --bg-warm-accent still applies if --bg-warm-accent
 *  is used in future components. Ghost Button now works on danger/warning tones without a special variant. */
export const WithIconAndAction: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Banner
      tone="warning"
      icon={
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      }
      action={
        <Button variant="ghost" size="sm">
          Rotate key
        </Button>
      }
    >
      Your API key expires in 3 days. Rotate it before the deadline to prevent service interruption.
    </Banner>
  </div>
);
