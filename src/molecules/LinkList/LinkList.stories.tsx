import type { Story, StoryDefault } from "@ladle/react";
import { LinkList } from "./LinkList";

export default {
  title: "Components / LinkList",
} satisfies StoryDefault;

/** Default — untitled footer column, sm size.
 *  Verifies: muted-link color at rest, hover transitions to --fg,
 *  semantic <ul>/<li> structure, --fs-meta text size. */
export const Default: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "240px" }}
  >
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="/writing">Writing</LinkList.Item>
      <LinkList.Item href="/contact">Contact</LinkList.Item>
    </LinkList>
  </div>
);

/** WithHeading — footer column with h3 heading and hairline divider.
 *  Verifies: Heading atom renders at h3, divider rule below heading,
 *  --space-3 gap between heading and list. */
export const WithHeading: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "240px" }}
  >
    <LinkList heading="Company" headingLevel={3} divider>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="/writing">Writing</LinkList.Item>
      <LinkList.Item href="/contact">Contact</LinkList.Item>
    </LinkList>
  </div>
);

/** OnThisPage — TOC composition at md size, with current item.
 *  Verifies: size="md" upgrades to --fs-body, current item renders at full --fg,
 *  aria-current="page" on the active anchor, external link indicator. */
export const OnThisPage: Story = () => (
  <div
    style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)", maxWidth: "280px" }}
  >
    <LinkList heading="On this page" headingLevel={2} size="md">
      <LinkList.Item href="#intent">Intent</LinkList.Item>
      <LinkList.Item href="#anatomy" current>
        Anatomy
      </LinkList.Item>
      <LinkList.Item href="#tokens">Tokens</LinkList.Item>
      <LinkList.Item href="#variants">Variants</LinkList.Item>
      <LinkList.Item href="#a11y">Accessibility</LinkList.Item>
      <LinkList.Item href="https://www.w3.org/WAI/ARIA/apg/" external>
        ARIA Authoring Practices
      </LinkList.Item>
    </LinkList>
  </div>
);

/** AllVariants — side-by-side sm vs md size comparison.
 *  Design-matrix story. */
export const AllVariants: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      display: "flex",
      gap: "var(--space-12)",
    }}
  >
    <LinkList heading="Footer column (sm)" headingLevel={3} divider>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="/writing">Writing</LinkList.Item>
      <LinkList.Item href="/contact" current>
        Contact
      </LinkList.Item>
    </LinkList>
    <LinkList heading="TOC (md)" headingLevel={3} size="md">
      <LinkList.Item href="#intent">Intent</LinkList.Item>
      <LinkList.Item href="#anatomy" current>
        Anatomy
      </LinkList.Item>
      <LinkList.Item href="#tokens">Tokens</LinkList.Item>
      <LinkList.Item href="https://example.com" external>
        External reference
      </LinkList.Item>
    </LinkList>
  </div>
);
