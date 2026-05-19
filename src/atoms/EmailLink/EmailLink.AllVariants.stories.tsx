import type { Story, StoryDefault } from "@ladle/react";
import { Mail } from "lucide-react";
import { EmailLink } from "./EmailLink";

export default {
  title: "Components / EmailLink / All Variants",
} satisfies StoryDefault;

/**
 * AllVariants — design-matrix grid: default × icon × qualifier × muted.
 */
export const AllVariants: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <EmailLink email="hello@pouk.ai" />
    </div>
    <div>
      <EmailLink email="hello@pouk.ai" icon={<Mail size={14} aria-hidden="true" />} />
    </div>
    <div>
      <EmailLink email="founder@pouk.ai" qualifier="Arian" />
    </div>
    <div>
      <EmailLink
        email="founder@pouk.ai"
        icon={<Mail size={14} aria-hidden="true" />}
        qualifier="Arian"
      />
    </div>
    <div>
      <EmailLink email="hello@pouk.ai" variant="muted" />
    </div>
    <div>
      <EmailLink
        email="hello@pouk.ai"
        variant="muted"
        icon={<Mail size={14} aria-hidden="true" />}
      />
    </div>
  </div>
);

/**
 * FocusVisible — programmatically focused instance for visual review of the
 * 2px `--accent` outline at 4px offset.
 */
export const FocusVisible: Story = () => (
  <div style={{ padding: "var(--space-8)" }}>
    <EmailLink
      email="hello@pouk.ai"
      data-testid="focus-target"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  </div>
);

/**
 * InlineSentence — `<EmailLink>` embedded in a `<p>` sentence. Verifies
 * inline flow, no baseline disruption, underline alignment with surrounding text.
 */
export const InlineSentence: Story = () => (
  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    Questions? Contact us at <EmailLink email="hello@pouk.ai" /> — we read every message.
  </p>
);

/**
 * LongEmailOverflow — an intentionally long email string in a constrained
 * 240px container. Documents overflow behavior without intervention; verifies
 * no layout breakage. (Per spec §11: overflow handling is consumer responsibility.)
 */
export const LongEmailOverflow: Story = () => (
  <div
    style={{
      width: "240px",
      border: "1px solid var(--hairline)",
      padding: "var(--space-4)",
      borderRadius: "var(--radius-2)",
    }}
  >
    <EmailLink email="very-long-name@subdomain.example.com" />
  </div>
);
