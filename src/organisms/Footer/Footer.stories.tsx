import type { Story, StoryDefault } from "@ladle/react";
import { Footer } from "./Footer";
import { SiteShell } from "../SiteShell";
import type { FooterLink } from "./Footer";

export default {
  title: "Components / Footer",
  args: {
    copyright: "© Pouk AI INC 2026",
    email: "hello@pouk.ai",
    emailLabel: undefined,
    linksLabel: "Footer",
  },
  argTypes: {
    as: {
      control: { type: "select" },
      options: ["div", "footer"],
      defaultValue: "div",
    },
    copyright: {
      control: { type: "text" },
    },
    email: {
      control: { type: "text" },
    },
    emailLabel: {
      control: { type: "text" },
    },
    linksLabel: {
      control: { type: "text" },
    },
  },
} satisfies StoryDefault;

const sampleLinks: FooterLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true },
];

/**
 * Default: as="div" + copyright + email + links (3 items).
 * Canonical usage inside SiteShell's footer slot.
 */
export const Default: Story = () => (
  <Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" links={sampleLinks} />
);

/**
 * Playground — all knobs active for interactive exploration.
 */
export const Playground: Story<{
  as: "div" | "footer";
  copyright: string;
  email: string;
  emailLabel?: string;
  linksLabel: string;
}> = ({ as = "div", copyright, email, emailLabel, linksLabel }) => (
  <Footer
    as={as}
    copyright={copyright}
    email={email}
    emailLabel={emailLabel}
    linksLabel={linksLabel}
    links={sampleLinks}
  />
);

/**
 * NoLinks: copyright + email only — no links prop.
 * Verifies no <nav> is emitted and left group is still coherent.
 */
export const NoLinks: Story = () => <Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />;

/**
 * Standalone: as="footer" with full props.
 * Footer emits its own <footer> landmark with hairline rule and padding.
 */
export const Standalone: Story = () => (
  <Footer as="footer" copyright="© Pouk AI INC 2026" email="hello@pouk.ai" links={sampleLinks} />
);

/**
 * WithLinks: explicit story showing all three secondary links including external.
 */
export const WithLinks: Story = () => (
  <Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" links={sampleLinks} />
);

/**
 * ExternalLink: one link with external: true — verifies target="_blank" and
 * rel="noopener noreferrer" on that link only.
 */
export const ExternalLink: Story = () => (
  <Footer
    copyright="© Pouk AI INC 2026"
    email="hello@pouk.ai"
    links={[
      { href: "/privacy", label: "Privacy" },
      { href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true },
    ]}
  />
);

/**
 * CustomEmailLabel: visible label is "Contact"; href is mailto:hello@pouk.ai.
 */
export const CustomEmailLabel: Story = () => (
  <Footer
    copyright="© Pouk AI INC 2026"
    email="hello@pouk.ai"
    emailLabel="Contact"
    links={[{ href: "/privacy", label: "Privacy" }]}
  />
);

/**
 * InsideSiteShell: full SiteShell composition with Footer in the footer slot.
 * Verifies no double <footer> in DOM, SiteShell hairline rule present.
 */
export const InsideSiteShell: Story = () => (
  <SiteShell
    currentRoute="/why-ai"
    routes={[
      { href: "/why-ai", label: "Why AI" },
      { href: "/roles", label: "Roles" },
    ]}
    footer={
      <Footer
        copyright="© Pouk AI INC 2026"
        email="hello@pouk.ai"
        links={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
      />
    }
  >
    <h1>Why AI</h1>
    <p>
      Footer slotted into SiteShell — no double landmark, layout aligns within SiteShell padding.
    </p>
  </SiteShell>
);
