import type { CSSProperties, ReactNode } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "./Button";

export default {
  title: "Components / Button",
} satisfies StoryDefault;

/* ─── Layout helpers ──────────────────────────────────────── */

const wrapStyle: CSSProperties = {
  padding: "var(--space-8)",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
  gap: "var(--space-8)",
};

interface PanelProps {
  verdict: "do" | "dont";
  label: string;
  note: string;
  children: ReactNode;
}

const Panel = ({ verdict, label, note, children }: PanelProps) => (
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        marginBottom: "var(--space-3)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "50%",
          background: verdict === "do" ? "var(--accent)" : "#c00",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: verdict === "do" ? "var(--accent)" : "#c00",
        }}
      >
        {verdict === "do" ? "Do" : "Don't"}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          marginLeft: "var(--space-1)",
        }}
      >
        — {label}
      </span>
    </div>

    <div
      style={{
        border: `1px solid ${verdict === "do" ? "var(--hairline)" : "#f5c0c0"}`,
        borderRadius: "var(--radius-3)",
        padding: "var(--space-6)",
        background: verdict === "do" ? "var(--bg)" : "#fff8f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "6rem",
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </div>

    <p
      style={{
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      {note}
    </p>
  </div>
);

/* ─── Stories ─────────────────────────────────────────────── */

/**
 * Do / Don't pairs for Button usage.
 * These are the antipatterns most likely to slip through design review.
 */
export const DontDo: Story = () => (
  <div style={wrapStyle}>
    <Panel
      verdict="do"
      label="One primary per view"
      note="The primary CTA draws the eye. One per view is the rule — it signals the single most important action."
    >
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Button variant="primary">Get in touch</Button>
        <Button variant="ghost">Learn more</Button>
      </div>
    </Panel>

    <Panel
      verdict="dont"
      label="Two primaries compete"
      note="Two primary buttons create false urgency and split attention. Demote the secondary action to ghost or secondary variant."
    >
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Button variant="primary">Get in touch</Button>
        <Button variant="primary">Learn more</Button>
      </div>
    </Panel>

    <Panel
      verdict="do"
      label="Concise label"
      note="Button labels name the action clearly in two to four words. The label answers 'what happens if I click this?'"
    >
      <Button variant="primary">Get in touch</Button>
    </Panel>

    <Panel
      verdict="dont"
      label="Verbose label"
      note="Long labels break the button's visual rhythm and obscure the action. Cut to the verb and its direct object."
    >
      <Button variant="primary">Click here to get in touch with our team today</Button>
    </Panel>

    <Panel
      verdict="do"
      label="Use asChild for links"
      note="When the action navigates, render Button as an anchor via asChild. This preserves correct semantics and keyboard behaviour."
    >
      <Button variant="primary" asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    </Panel>

    <Panel
      verdict="dont"
      label="onClick navigation"
      note="A button that runs window.location.href = '...' is semantically a link. Use asChild with an <a> tag so users can open it in a new tab and screen readers announce it correctly."
    >
      <Button
        variant="primary"
        onClick={() => {
          /* anti-pattern: navigate via JS on a button */
        }}
      >
        hello@pouk.ai
      </Button>
    </Panel>

    <Panel
      verdict="do"
      label="Disabled state is communicated"
      note="The disabled prop applies opacity-50 and removes pointer events. Pair it with a visible reason nearby when the cause is not obvious."
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          alignItems: "flex-start",
        }}
      >
        <Button variant="primary" disabled>
          Submit
        </Button>
        <span style={{ fontSize: "var(--fs-meta)", color: "var(--fg-muted)" }}>
          Complete the form above first.
        </span>
      </div>
    </Panel>

    <Panel
      verdict="dont"
      label="Disabled with no context"
      note="A disabled button with no explanation is a dead end. Users can't understand why the action is unavailable or what to do next."
    >
      <Button variant="primary" disabled>
        Submit
      </Button>
    </Panel>
  </div>
);
