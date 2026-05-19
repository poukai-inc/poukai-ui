import type { Story, StoryDefault } from "@ladle/react";
import { TeamCard } from "./TeamCard";
import { Portrait } from "../Portrait";
import { EmailLink } from "../../atoms/EmailLink";
import { Eyebrow } from "../../atoms/Eyebrow";

export default {
  title: "Components / Cards / TeamCard / All Variants",
} satisfies StoryDefault;

const makePortrait = (seed: string, size = 800) => (
  <Portrait
    src={`https://picsum.photos/seed/${seed}/${size}/${size}`}
    alt={`Team member ${seed} — headshot`}
    aspect="1:1"
    width={size}
  />
);

/** ThreeColumnGrid — three TeamCards in a CSS 3-column grid at --content-max.
 *  Primary smoke test: equal-height behavior, portrait alignment, rhythm. */
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
        alignItems: "stretch",
      }}
    >
      <TeamCard
        portrait={makePortrait("av1")}
        name="Arian Zargaran"
        role="Founder, Engineering"
        bio="Builds production AI systems end-to-end for senior-only consulting practices."
        contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
      />
      <TeamCard
        portrait={makePortrait("av2")}
        name="Jamie Chen"
        role="Partner, Strategy"
        bio="Advises on AI adoption for enterprise teams. Short bio."
        contact={<EmailLink email="jamie@pouk.ai" variant="muted" />}
      />
      <TeamCard
        portrait={makePortrait("av3")}
        name="Sam Okonkwo"
        role="Principal, Systems"
        bio="Closes the gap between pilot and production infrastructure. A longer bio paragraph that extends over several lines to verify that grid alignment holds when card heights differ across a row of three."
        contact={<EmailLink email="sam@pouk.ai" variant="muted" />}
      />
    </div>
  </div>
);

/** HorizontalCollapse — layout="horizontal" at a constrained viewport width (<768px).
 *  Open this story in the Ladle viewport tool at ≤767px to verify the stacked collapse. */
export const HorizontalCollapse: Story = () => (
  <div
    style={{
      /* Constrained to simulate a mobile viewport — verifies the media query fires. */
      maxWidth: "360px",
      background: "var(--bg)",
      padding: "var(--space-4)",
    }}
  >
    <TeamCard
      layout="horizontal"
      portrait={makePortrait("hc1", 400)}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** EyebrowReactNode — eyebrow={<Eyebrow variant="solid">…</Eyebrow>} pass-through.
 *  Verifies no double-wrapping; solid variant renders at full contrast. */
export const EyebrowReactNode: Story = () => (
  <div style={{ maxWidth: "20rem", background: "var(--bg)", padding: "var(--space-4)" }}>
    <TeamCard
      eyebrow={<Eyebrow variant="solid">Partners</Eyebrow>}
      portrait={makePortrait("ern1")}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
  </div>
);

/** ContactVariants — two cards: one with EmailLink, one with a plain anchor.
 *  Verifies contact slot accepts arbitrary ReactNode without style interference. */
export const ContactVariants: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "var(--space-8)",
      maxWidth: "40rem",
      background: "var(--bg)",
      padding: "var(--space-4)",
    }}
  >
    <TeamCard
      portrait={makePortrait("cv1")}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Contact via EmailLink atom."
      contact={<EmailLink email="arian@pouk.ai" variant="muted" />}
    />
    <TeamCard
      portrait={makePortrait("cv2")}
      name="Jamie Chen"
      role="Partner, Strategy"
      bio="Contact via plain anchor (LinkedIn)."
      contact={
        <a
          href="https://linkedin.com/in/jamie-chen"
          style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}
        >
          linkedin.com/in/jamie-chen
        </a>
      }
    />
  </div>
);

/** NameHeadingLevels — three instances: nameAs="h2", "h3" (default), "h4".
 *  Verifies each renders the correct element; confirms typography scale is consistent. */
export const NameHeadingLevels: Story = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-8)",
      maxWidth: "var(--content-max)",
      background: "var(--bg)",
      padding: "var(--space-4)",
    }}
  >
    <TeamCard
      portrait={makePortrait("nh2")}
      nameAs="h2"
      name="Arian Zargaran (h2)"
      role="Founder, Engineering"
      bio="nameAs='h2' — for standalone person pages."
    />
    <TeamCard
      portrait={makePortrait("nh3")}
      nameAs="h3"
      name="Jamie Chen (h3)"
      role="Partner, Strategy"
      bio="nameAs='h3' — default; correct inside a Section with an h2."
    />
    <TeamCard
      portrait={makePortrait("nh4")}
      nameAs="h4"
      name="Sam Okonkwo (h4)"
      role="Principal, Systems"
      bio="nameAs='h4' — for deeply nested contexts."
    />
  </div>
);
