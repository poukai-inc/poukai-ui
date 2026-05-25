import type { Story, StoryDefault } from "@ladle/react";
import { TestimonialBlock } from "./TestimonialBlock";
import { Byline } from "../../molecules/Byline";
import { Portrait } from "../../molecules/Portrait";

export default {
  title: "Organisms / TestimonialBlock",
} satisfies StoryDefault;

const defaultByline = <Byline name="Jane Doe" role="Head of Design, Acme" />;

export const Default: Story = () => (
  <TestimonialBlock
    quote="Changed how our team ships. We went from six-week release cycles to continuous delivery in under a quarter."
    byline={defaultByline}
  />
);

export const WithPortrait: Story = () => (
  <TestimonialBlock
    quote="Changed how our team ships. We went from six-week release cycles to continuous delivery in under a quarter."
    byline={<Byline name="Jane Doe" role="Head of Design, Acme" />}
    portrait={
      <Portrait
        src="https://picsum.photos/seed/testimonial-portrait/120/120"
        alt=""
        aspect="1:1"
        width={120}
        loading="eager"
      />
    }
  />
);

export const HorizontalWithPortrait: Story = () => (
  <TestimonialBlock
    orientation="horizontal"
    quote="Accelerated our roadmap by a full quarter. The clarity they brought to the architecture decision saved us months."
    byline={<Byline name="Alex Kim" role="CTO, Startupco" />}
    portrait={
      <Portrait
        src="https://picsum.photos/seed/testimonial-horiz/120/120"
        alt=""
        aspect="1:1"
        width={120}
        loading="eager"
      />
    }
  />
);

export const StartAligned: Story = () => (
  <TestimonialBlock
    align="start"
    quote="The best technical partnership we've had. Thoughtful, fast, and uncompromising on quality."
    byline={<Byline name="Maria Chen" role="VP Engineering, Fieldwork" />}
  />
);

export const WithEmphasis: Story = () => (
  <TestimonialBlock
    quote={
      <>
        Changed how our team ships. We went from <em>six-week release cycles</em> to continuous
        delivery in under a quarter.
      </>
    }
    byline={defaultByline}
  />
);

export const EndOfPageComposition: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <main>
      <section
        style={{
          padding: "var(--space-12) var(--page-pad)",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--fs-statement)",
            color: "var(--fg)",
          }}
        >
          Our work
        </h2>
        <p style={{ color: "var(--fg-muted)", marginTop: "var(--space-4)" }}>
          We partner with teams building high-stakes systems.
        </p>
      </section>
      <TestimonialBlock
        quote="Changed how our team ships. An honest, high-leverage partnership from day one."
        byline={<Byline name="Jane Doe" role="Head of Design, Acme" />}
        portrait={
          <Portrait
            src="https://picsum.photos/seed/testimonial-eop/120/120"
            alt=""
            aspect="1:1"
            width={120}
            loading="eager"
          />
        }
      />
    </main>
  </div>
);
