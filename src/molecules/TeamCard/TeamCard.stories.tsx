import type { Story, StoryDefault } from "@ladle/react";
import { TeamCard } from "./TeamCard";
import { Portrait } from "../Portrait";
import { EmailLink } from "../../atoms/EmailLink";
import { Eyebrow } from "../../atoms/Eyebrow";

export default {
  title: "Components / Cards / TeamCard",
} satisfies StoryDefault;

const PORTRAIT_STACKED = (
  <Portrait
    src="https://picsum.photos/seed/teamcard1/800/800"
    alt="Arian Zargaran, founder of Poukai — headshot in natural light"
    aspect="1:1"
    width={800}
    loading="eager"
    fetchPriority="high"
  />
);

const PORTRAIT_HORIZONTAL = (
  <Portrait
    src="https://picsum.photos/seed/teamcard1/400/400"
    alt="Arian Zargaran, founder of Poukai — headshot in natural light"
    aspect="1:1"
    width={400}
    loading="eager"
    fetchPriority="high"
  />
);

/** Default — full composition: portrait + name + role + bio + EmailLink contact.
 *  Stacked layout. Verifies all slots render and gap stack is correct. */
export const Default: Story = () => (
  <div style={{ maxWidth: "20rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard
      portrait={PORTRAIT_STACKED}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices. Formerly infrastructure engineer at a scale-up acquired by a Fortune 500."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** Minimal — portrait + name + role only.
 *  Verifies optional slots omit cleanly with no empty elements or gap artifacts. */
export const Minimal: Story = () => (
  <div style={{ maxWidth: "20rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard portrait={PORTRAIT_STACKED} name="Arian Zargaran" role="Founder, Engineering" />
  </div>
);

/** HorizontalLayout — layout="horizontal", full composition.
 *  Verifies portrait sits left at 5rem width, text block right, --space-6 gap. */
export const HorizontalLayout: Story = () => (
  <div style={{ maxWidth: "36rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard
      layout="horizontal"
      portrait={PORTRAIT_HORIZONTAL}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** WithEyebrow — string eyebrow ("Founding team") + full composition.
 *  Verifies string→Eyebrow wrapping, --space-3 gap eyebrow→portrait, muted variant. */
export const WithEyebrow: Story = () => (
  <div style={{ maxWidth: "20rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard
      eyebrow="Founding team"
      portrait={PORTRAIT_STACKED}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** PolymorphicSection — as="section" root.
 *  Verifies root is <section>, aria-labelledby wired to name heading id, styling identical. */
export const PolymorphicSection: Story = () => (
  <div style={{ maxWidth: "20rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard
      as="section"
      portrait={PORTRAIT_STACKED}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** ThreeColumnGrid — three TeamCards in a CSS 3-column grid.
 *  Primary smoke test for the component's raison d'être. */
export const ThreeColumnGrid: Story = () => (
  <div
    style={{
      maxWidth: "var(--content-max)",
      background: "var(--bg)",
      padding: "var(--space-4)",
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--space-8)",
      }}
    >
      <TeamCard
        portrait={
          <Portrait
            src="https://picsum.photos/seed/team1/800/800"
            alt="Team member one — headshot"
            aspect="1:1"
            width={800}
          />
        }
        name="Arian Zargaran"
        role="Founder, Engineering"
        bio="Builds production AI systems end-to-end."
        contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
      />
      <TeamCard
        portrait={
          <Portrait
            src="https://picsum.photos/seed/team2/800/800"
            alt="Team member two — headshot"
            aspect="1:1"
            width={800}
          />
        }
        name="Jamie Chen"
        role="Partner, Strategy"
        bio="Advises on AI adoption for enterprise teams."
        contact={<EmailLink email="jamie@pouk.ai" variant="muted" />}
      />
      <TeamCard
        portrait={
          <Portrait
            src="https://picsum.photos/seed/team3/800/800"
            alt="Team member three — headshot"
            aspect="1:1"
            width={800}
          />
        }
        name="Sam Okonkwo"
        role="Principal, Systems"
        bio="Closes the gap between pilot and production infrastructure."
        contact={<EmailLink email="sam@pouk.ai" variant="muted" />}
      />
    </div>
  </div>
);
