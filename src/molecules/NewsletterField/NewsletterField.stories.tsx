import type { Story, StoryDefault } from "@ladle/react";
import { NewsletterField } from "./NewsletterField";

export default {
  title: "Components / NewsletterField",
  argTypes: {
    cta: { control: { type: "text" } },
    placeholder: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    size: { control: { type: "select" }, options: ["compact", "md"] },
    note: { control: { type: "text" } },
  },
  args: {
    cta: "Subscribe",
    placeholder: "you@example.com",
    disabled: false,
    size: "compact",
    note: "",
  },
} satisfies StoryDefault;

/** Default uncontrolled — compact footer placement. */
export const Default: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <NewsletterField />
  </div>
);

/** Native POST via `action` prop — progressive enhancement. */
export const WithAction: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <NewsletterField
      action="/api/subscribe"
      method="post"
      cta="Subscribe"
      note="No spam. Unsubscribe any time."
    />
  </div>
);

/** Controlled — consumer manages submission. */
export const Controlled: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <NewsletterField
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        // eslint-disable-next-line no-alert
        alert(`Submitted: ${data.get("email")}`);
      }}
      cta="Join waitlist"
      note="We'll notify you when we launch."
    />
  </div>
);

/** Footer composition context — dark band, muted copy around the molecule. */
export const FooterComposition: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-6)",
      borderTop: "1px solid var(--hairline)",
      maxWidth: "40rem",
    }}
  >
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        marginBottom: "var(--space-3)",
        marginTop: 0,
      }}
    >
      Stay in the loop
    </p>
    <NewsletterField cta="Notify me" note="No spam. Unsubscribe any time." />
  </div>
);

/** md size — section-hero placement (44px height). */
export const SizeMd: Story = () => (
  <div style={{ maxWidth: "32rem" }}>
    <NewsletterField size="md" cta="Get early access" note="Free during beta." />
  </div>
);

/** Disabled state — both input and button inert. */
export const Disabled: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <NewsletterField disabled cta="Subscribe" note="Submissions closed." />
  </div>
);

/** With note slot showing an error string. */
export const WithNote: Story = () => (
  <div style={{ maxWidth: "28rem" }}>
    <NewsletterField note="This email is already on our list." />
  </div>
);
