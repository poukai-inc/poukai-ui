import type { Story, StoryDefault } from "@ladle/react";
import { Mail } from "lucide-react";
import { EmailLink, type EmailLinkVariant } from "./EmailLink";

export default {
  title: "Components / EmailLink",
  args: { email: "hello@pouk.ai", variant: "default" },
  argTypes: {
    variant: {
      options: ["default", "muted"] satisfies EmailLinkVariant[],
      control: { type: "radio" },
      defaultValue: "default",
    },
  },
} satisfies StoryDefault;

/** Default — plain inline link. No icon, no qualifier. Label defaults to the email string. */
export const Default: Story = () => <EmailLink email="hello@pouk.ai" />;

/** WithIcon — leading Mail icon (lucide-react). Verifies inline-flex layout, icon gap, optical alignment. */
export const WithIcon: Story = () => (
  <EmailLink email="hello@pouk.ai" icon={<Mail size={14} aria-hidden="true" />} />
);

/** WithQualifier — trailing role qualifier in muted parenthetical register. */
export const WithQualifier: Story = () => <EmailLink email="founder@pouk.ai" qualifier="Arian" />;

/** MutedVariant — `--fg-muted` base color, `--fg` on hover. Matches SiteShell footer treatment. */
export const MutedVariant: Story = () => <EmailLink email="hello@pouk.ai" variant="muted" />;

/** WithIconAndQualifier — all anatomy slots populated together. */
export const WithIconAndQualifier: Story = () => (
  <EmailLink
    email="founder@pouk.ai"
    icon={<Mail size={14} aria-hidden="true" />}
    qualifier="Arian"
  />
);
