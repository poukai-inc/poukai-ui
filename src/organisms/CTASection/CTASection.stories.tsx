import type { Story, StoryDefault } from "@ladle/react";
import { CTASection } from "./CTASection";
import { Button } from "../../atoms/Button";

export default {
  title: "Organisms / CTASection",
} satisfies StoryDefault;

export const Default: Story = () => (
  <CTASection
    heading="Ready to start?"
    body="Spin up your first project in minutes."
    actions={<Button>Get a demo</Button>}
  />
);

export const FullBleed: Story = () => (
  <CTASection
    surface="recessed"
    heading="Ready to start?"
    body="We work with senior-only teams who'd rather ship than speculate."
    actions={
      <>
        <Button>Get a demo</Button>
        <Button variant="secondary">See our work</Button>
      </>
    }
  />
);

export const AlignStart: Story = () => (
  <CTASection
    align="start"
    heading="Ready to start?"
    body="Spin up your first project in minutes."
    actions={<Button>Get a demo</Button>}
  />
);

export const TightSize: Story = () => (
  <CTASection size="tight" heading="Ready to start?" actions={<Button>Get a demo</Button>} />
);

export const NoBody: Story = () => (
  <CTASection heading="Ready to start?" actions={<Button>Get a demo</Button>} />
);

export const EndOfPageComposition: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <main>
      <section
        style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "var(--space-16) var(--page-pad)",
        }}
      >
        <h1
          style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h1)", color: "var(--fg)" }}
        >
          Technical consulting for teams.
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: "var(--fs-body)" }}>
          We work alongside founders and platform teams.
        </p>
      </section>
      <CTASection
        surface="recessed"
        heading="Ready to work together?"
        body="Spin up your first project in minutes. No hand-offs, no fluff."
        actions={
          <>
            <Button>Get a demo</Button>
            <Button variant="secondary">See our work</Button>
          </>
        }
      />
    </main>
  </div>
);

export const HeadingH3: Story = () => (
  <CTASection
    headingAs="h3"
    heading="Interested in this role?"
    body="We're always looking for senior engineers."
    actions={<Button>Apply now</Button>}
  />
);
