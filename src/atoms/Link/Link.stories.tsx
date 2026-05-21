import type { Story, StoryDefault } from "@ladle/react";
import { Link, type LinkVariant } from "./Link";

export default {
  title: "Components / Link",
  args: {
    href: "https://pouk.ai",
    variant: "default",
    children: "Read the case study",
  },
  argTypes: {
    variant: {
      options: ["default", "quiet", "muted-link"] satisfies LinkVariant[],
      control: { type: "radio" },
      defaultValue: "default",
    },
    asChild: {
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
} satisfies StoryDefault;

/**
 * Playground — all props live-editable via Ladle controls.
 * Uses the default variant inline in paragraph copy.
 */
export const Playground: Story = (args) => (
  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    Our latest work on AI adoption is documented in <Link {...args} />.
  </p>
);

/**
 * Default — two-layer underline; hairline always visible at rest.
 * Use in prose body copy and card descriptions.
 */
export const Default: Story = () => (
  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    We published a deep-dive on{" "}
    <Link href="https://pouk.ai/work" variant="default">
      our approach to AI adoption
    </Link>{" "}
    last quarter.
  </p>
);

/**
 * Quiet — underline on hover only; no hairline at rest.
 * Use in navigation contexts where link nature is implicit from layout.
 */
export const Quiet: Story = () => (
  <nav
    style={{
      display: "flex",
      gap: "var(--space-6)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-meta)",
      color: "var(--fg)",
    }}
  >
    <Link href="/why-ai" variant="quiet">
      Why AI
    </Link>
    <Link href="/roles" variant="quiet">
      Roles
    </Link>
    <Link href="/principles" variant="quiet">
      Principles
    </Link>
  </nav>
);

/**
 * MutedLink — footer and secondary navigation register.
 * `--fg-muted` at rest, `--fg` on hover, no underline layers.
 * Direct replacement for the global `.muted-link` class.
 */
export const MutedLink: Story = () => (
  <footer
    style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--fs-meta)",
      color: "var(--fg-muted)",
    }}
  >
    <span>© Pouk AI INC 2026</span>
    {" · "}
    <Link href="mailto:hello@pouk.ai" variant="muted-link">
      hello@pouk.ai
    </Link>
    {" · "}
    <Link href="/privacy" variant="muted-link">
      Privacy
    </Link>
    {" · "}
    <Link href="/terms" variant="muted-link">
      Terms
    </Link>
  </footer>
);

/**
 * AsChild — composes DS styles onto a simulated router Link.
 * The inner element receives all DS classes, rel defaults, and event handlers.
 * In real usage: replace the inner <a> with Next.js <Link> or Remix <Link>.
 */
export const AsChild: Story = () => (
  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    Navigate to{" "}
    <Link href="/about" asChild>
      {/* Simulates a framework router link — replace with NextLink in real usage */}
      <a href="/about">the about page</a>
    </Link>{" "}
    using asChild composition.
  </p>
);

/**
 * ExternalLink — target="_blank" auto-applies rel="noopener noreferrer".
 * No manual rel needed in the common case.
 */
export const ExternalLink: Story = () => (
  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
    Read the{" "}
    <Link href="https://example.com/report" target="_blank">
      full industry report
    </Link>{" "}
    (opens in a new tab — rel="noopener noreferrer" applied automatically).
  </p>
);

/**
 * AllVariants — side-by-side matrix for visual regression reference.
 */
export const AllVariants: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
      <strong>default</strong>{" "}
      <Link href="#" variant="default">
        Two-layer underline link
      </Link>
    </div>
    <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
      <strong>quiet</strong>{" "}
      <Link href="#" variant="quiet">
        Underline on hover only
      </Link>
    </div>
    <div
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
      }}
    >
      <strong>muted-link</strong>{" "}
      <Link href="#" variant="muted-link">
        Footer / secondary nav register
      </Link>
    </div>
  </div>
);
