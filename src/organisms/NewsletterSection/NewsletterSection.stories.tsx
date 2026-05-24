import type { Story, StoryDefault } from "@ladle/react";
import { NewsletterSection } from "./NewsletterSection";
import { NewsletterField } from "../../molecules/NewsletterField";

export default {
  title: "Components / NewsletterSection",
} satisfies StoryDefault;

export const Default: Story = () => (
  <NewsletterSection
    heading="Get monthly updates"
    body="One email a month. No spam."
    field={<NewsletterField action="/api/subscribe" />}
  />
);

export const WithEyebrow: Story = () => (
  <NewsletterSection
    eyebrow="Stay in the loop"
    heading="Get monthly updates"
    body="One email a month. No spam."
    field={<NewsletterField action="/api/subscribe" />}
  />
);

export const Tight: Story = () => (
  <NewsletterSection
    heading="Stay in the loop"
    size="tight"
    field={<NewsletterField action="/api/subscribe" size="compact" />}
  />
);

export const WithSurface: Story = () => (
  <NewsletterSection
    heading="Get monthly updates"
    body="One email a month. No spam."
    surface
    field={<NewsletterField action="/api/subscribe" />}
  />
);

export const TitleAsH3: Story = () => (
  <div>
    <h2 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-4)" }}>
      Article title
    </h2>
    <NewsletterSection
      heading="Stay in the loop"
      titleAs="h3"
      body="One email a month. No spam."
      field={<NewsletterField action="/api/subscribe" size="compact" />}
    />
  </div>
);

export const FooterSignupComposition: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <main style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
      <article style={{ padding: "var(--space-16) var(--page-pad)" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-4)" }}>
          Closing the AI gap
        </h1>
        <p className="lede">
          We work alongside founders and platform teams to close the gap between pilot and
          production.
        </p>
      </article>
      <NewsletterSection
        heading="Get monthly updates"
        body="One email a month. No spam."
        surface
        size="tight"
        field={
          <NewsletterField
            action="/api/subscribe"
            placeholder="you@example.com"
            cta="Subscribe"
            note="No spam. Unsubscribe any time."
          />
        }
      />
    </main>
  </div>
);
