import type { Story, StoryDefault } from "@ladle/react";
import { Alert } from "./Alert";

export default {
  title: "Molecules / Alert",
} satisfies StoryDefault;

/** Default — info variant, body only. */
export const Default: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="info">Your session will expire in 15 minutes.</Alert>
  </div>
);

/** Info variant — polite live region, accent-blue icon. */
export const Info: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="info">Your session will expire in 15 minutes.</Alert>
  </div>
);

/** Success variant — polite live region, green surface. */
export const Success: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="success">Profile updated successfully.</Alert>
  </div>
);

/** Warn variant — polite live region, amber surface. */
export const Warn: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="warn">Your trial ends in 3 days. Upgrade to keep access.</Alert>
  </div>
);

/** Error variant — assertive live region (role="alert"), red surface. */
export const Error: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="error">Payment failed. Please check your card details and try again.</Alert>
  </div>
);

/** Note variant — static landmark (role="note"), muted surface. */
export const Note: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="note">This feature is in beta. Behaviour may change in future releases.</Alert>
  </div>
);

/** WithTitle — title + body. Title rendered as &lt;strong&gt;, not a heading. */
export const WithTitle: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="error" title="Submission failed">
      Please fix the highlighted fields and try again.
    </Alert>
  </div>
);

/** WithTitle across all variants — design matrix. */
export const AllVariantsWithTitle: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "40rem",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
    }}
  >
    <Alert variant="info" title="Info">
      Your session will expire in 15 minutes.
    </Alert>
    <Alert variant="success" title="Success">
      Profile updated successfully.
    </Alert>
    <Alert variant="warn" title="Warning">
      Your trial ends in 3 days. Upgrade to keep access.
    </Alert>
    <Alert variant="error" title="Error">
      Payment failed. Please check your card details and try again.
    </Alert>
    <Alert variant="note" title="Note">
      This feature is in beta. Behaviour may change in future releases.
    </Alert>
  </div>
);

/** NoIcon — icon suppressed via icon={null}. */
export const NoIcon: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "40rem" }}
  >
    <Alert variant="info" icon={null}>
      Icon suppressed. Consumer controls icon slot via icon=&#123;null&#125;.
    </Alert>
  </div>
);
