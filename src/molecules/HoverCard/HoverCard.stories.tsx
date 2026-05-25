import type { Story, StoryDefault } from "@ladle/react";
import { HoverCard } from "./HoverCard";
import { Avatar } from "../../atoms/Avatar";
import { StatusBadge } from "../../atoms/StatusBadge";

export default {
  title: "Molecules / HoverCard",
} satisfies StoryDefault;

/** Default — author link trigger with name, role, and bio.
 *  Verifies compound Root → Trigger → Content composition with arrow. */
export const Default: Story = () => (
  <div
    style={{
      padding: "var(--space-16)",
      display: "flex",
      justifyContent: "center",
      background: "var(--bg)",
    }}
  >
    <HoverCard.Root openDelay={300} closeDelay={200}>
      <HoverCard.Trigger>
        <a href="/profile" style={{ color: "var(--accent)" }}>
          Arian Zargaran
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Avatar mode="initials" initials="AZ" size="md" shape="circle" alt="Arian Zargaran" />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "var(--fs-meta)",
                  lineHeight: "var(--lh-meta)",
                  color: "var(--fg)",
                }}
              >
                Arian Zargaran
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--fs-meta)",
                  lineHeight: "var(--lh-meta)",
                  color: "var(--fg-muted)",
                }}
              >
                Founder, Engineering
              </span>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-meta)",
              lineHeight: "var(--lh-body)",
              color: "var(--fg-muted)",
            }}
          >
            Builds production AI systems end-to-end for senior-only consulting practices.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  </div>
);

/** OnLink — trigger is a plain text link (most common pattern).
 *  Verifies asChild passes through anchor semantics correctly. */
export const OnLink: Story = () => (
  <div
    style={{
      padding: "var(--space-16)",
      display: "flex",
      justifyContent: "center",
      background: "var(--bg)",
    }}
  >
    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)", color: "var(--fg)" }}>
      Read the full case study from{" "}
      <HoverCard.Root openDelay={400} closeDelay={200}>
        <HoverCard.Trigger>
          <a href="/team/arian">Arian Zargaran</a>
        </HoverCard.Trigger>
        <HoverCard.Content width="sm" side="top" align="start">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "var(--fs-meta)",
                lineHeight: "var(--lh-meta)",
                color: "var(--fg)",
              }}
            >
              Arian Zargaran
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--fs-meta)",
                lineHeight: "var(--lh-meta)",
                color: "var(--fg-muted)",
              }}
            >
              Founder — Poukai
            </span>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>{" "}
      on AI adoption in enterprise.
    </p>
  </div>
);

/** WithAvatar — full author preview: avatar + name + role + availability badge.
 *  Primary usage pattern for editorial bylines and team grids. */
export const WithAvatar: Story = () => (
  <div
    style={{
      padding: "var(--space-16)",
      display: "flex",
      justifyContent: "center",
      background: "var(--bg)",
    }}
  >
    <HoverCard.Root openDelay={500} closeDelay={300}>
      <HoverCard.Trigger>
        <a
          href="/team/arian"
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
        >
          <Avatar mode="initials" initials="AZ" size="sm" shape="circle" alt="Arian Zargaran" />
          <span>Arian Zargaran</span>
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content width="md" side="bottom" align="start">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Avatar mode="initials" initials="AZ" size="md" shape="circle" alt="Arian Zargaran" />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: "var(--fs-meta)",
                  lineHeight: "var(--lh-meta)",
                  color: "var(--fg)",
                }}
              >
                Arian Zargaran
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--fs-meta)",
                  lineHeight: "var(--lh-meta)",
                  color: "var(--fg-muted)",
                }}
              >
                Founder, Engineering
              </span>
            </div>
          </div>

          {/* Bio */}
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-meta)",
              lineHeight: "var(--lh-body)",
              color: "var(--fg-muted)",
            }}
          >
            Builds production AI systems end-to-end for senior-only consulting practices.
          </p>

          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <StatusBadge status="available">Available</StatusBadge>
          </div>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  </div>
);

/** LongContent — verifies the card handles multi-paragraph body gracefully.
 *  Smoke test for overflow and width capping. */
export const LongContent: Story = () => (
  <div
    style={{
      padding: "var(--space-16)",
      display: "flex",
      justifyContent: "center",
      background: "var(--bg)",
    }}
  >
    <HoverCard.Root openDelay={300} closeDelay={200}>
      <HoverCard.Trigger>
        <a href="/project/poukai">Poukai</a>
      </HoverCard.Trigger>
      <HoverCard.Content width="md" side="bottom" align="center" showArrow={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "var(--fs-meta)",
              lineHeight: "var(--lh-meta)",
              color: "var(--fg)",
            }}
          >
            Poukai
          </span>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-meta)",
              lineHeight: "var(--lh-body)",
              color: "var(--fg-muted)",
            }}
          >
            A senior-only AI consulting practice. We build production systems, not slide decks. Our
            team of senior engineers ships infrastructure that outlasts the engagement.
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--fs-meta)",
              lineHeight: "var(--lh-body)",
              color: "var(--fg-muted)",
            }}
          >
            Founded in 2024. Based in Vancouver.
          </p>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  </div>
);
