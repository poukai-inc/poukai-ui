import type { Story, StoryDefault } from "@ladle/react";
import { LogoCloud } from "./LogoCloud";
import { Logo } from "../../atoms/Logo";

export default {
  title: "Components / LogoCloud",
} satisfies StoryDefault;

/* ── Shared fixtures ───────────────────────────────────────── */

const LOGOS_6 = (
  <>
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Initech" alt="Initech" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Umbrella" alt="Umbrella" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Hooli" alt="Hooli" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Vehement" alt="Vehement Capital" />
  </>
);

const LOGOS_8 = (
  <>
    {LOGOS_6}
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Soylent" alt="Soylent Corp" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=MomCorp" alt="Mom Corp" />
  </>
);

/* ── Stories ───────────────────────────────────────────────── */

/**
 * Default: grid variant, 4 columns, no heading.
 */
export const Default: Story = () => <LogoCloud aria-label="Our partners">{LOGOS_6}</LogoCloud>;

/**
 * GridWithHeading: "Trusted by" composition — eyebrow + heading + logos.
 */
export const GridWithHeading: Story = () => (
  <LogoCloud eyebrow="Customers" heading="Trusted by teams at" columns={3}>
    {LOGOS_6}
  </LogoCloud>
);

/**
 * GridColumns: shows 2, 3, 4, 5, 6 column options.
 */
export const GridColumns2: Story = () => (
  <LogoCloud aria-label="2-column grid" columns={2}>
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Initech" alt="Initech" />
    <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Umbrella" alt="Umbrella" />
  </LogoCloud>
);

/**
 * Strip: horizontal marquee variant.
 */
export const Strip: Story = () => (
  <LogoCloud variant="strip" aria-label="Our partners">
    {LOGOS_8}
  </LogoCloud>
);

/**
 * StripWithHeading: strip with eyebrow and heading.
 */
export const StripWithHeading: Story = () => (
  <LogoCloud variant="strip" eyebrow="Integrations" heading="Works with your stack">
    {LOGOS_8}
  </LogoCloud>
);

/**
 * WithDivider: hairline rule above the logo container.
 */
export const WithDivider: Story = () => (
  <LogoCloud divider aria-label="Our customers">
    {LOGOS_6}
  </LogoCloud>
);

/**
 * TrustedBy: canonical "trusted by" composition — eyebrow + heading + grid + divider.
 */
export const TrustedBy: Story = () => (
  <LogoCloud
    eyebrow="Social proof"
    heading="Trusted by teams building at scale"
    lede="Join hundreds of companies using Poukai to ship faster."
    divider
    columns={3}
  >
    {LOGOS_6}
  </LogoCloud>
);
