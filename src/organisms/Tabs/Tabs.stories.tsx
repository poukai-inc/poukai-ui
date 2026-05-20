import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Tabs } from "./Tabs";
import { TabsBasic } from "./TabsBasic";

export default {
  title: "Components / Tabs",
} satisfies StoryDefault;

/* ─── TabsBasic (default — uncontrolled) ─────────────────── */

export const Default: Story = () => (
  <TabsBasic
    tabs={[
      {
        value: "overview",
        label: "Overview",
        content: (
          <div>
            <h3 style={{ margin: "0 0 var(--space-4)" }}>Overview</h3>
            <p style={{ margin: 0 }}>
              pouk.ai builds production AI systems end-to-end for senior-only consulting practices.
              This is the overview tab content.
            </p>
          </div>
        ),
      },
      {
        value: "approach",
        label: "Approach",
        content: (
          <div>
            <h3 style={{ margin: "0 0 var(--space-4)" }}>Approach</h3>
            <p style={{ margin: 0 }}>
              We ship the smallest real thing that closes a production feedback loop. Pilots fail
              because they are rehearsals.
            </p>
          </div>
        ),
      },
      {
        value: "results",
        label: "Results",
        content: (
          <div>
            <h3 style={{ margin: "0 0 var(--space-4)" }}>Results</h3>
            <p style={{ margin: 0 }}>
              85% of teams adopting AI plateau at pilot. We close the loop. Every engagement ships
              to production.
            </p>
          </div>
        ),
      },
    ]}
  />
);

/* ─── TabsBasic (controlled) ─────────────────────────────── */

export const Controlled: Story = () => {
  const [active, setActive] = useState("services");

  return (
    <div>
      <p
        style={{
          marginBottom: "var(--space-4)",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-meta)",
        }}
      >
        Active tab (controlled): <strong style={{ color: "var(--fg)" }}>{active}</strong>
      </p>
      <TabsBasic
        value={active}
        onValueChange={setActive}
        tabs={[
          {
            value: "services",
            label: "Services",
            content: (
              <p style={{ margin: 0 }}>Custom AI builds. Automations. Advisory engagements.</p>
            ),
          },
          {
            value: "pricing",
            label: "Pricing",
            content: (
              <p style={{ margin: 0 }}>
                Scope-defined retainer. No hourly billing. No scope creep.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
};

/* ─── Compound API — horizontal ──────────────────────────── */

export const CompoundHorizontal: Story = () => (
  <Tabs.Root defaultValue="principles">
    <Tabs.List>
      <Tabs.Trigger value="principles">Principles</Tabs.Trigger>
      <Tabs.Trigger value="failure-modes">Failure Modes</Tabs.Trigger>
      <Tabs.Trigger value="team">Team</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="principles">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>Ship the smallest real thing.</h3>
      <p style={{ margin: 0 }}>
        The only metric that matters is a production feedback loop closing. A pilot that never ships
        is a rehearsal.
      </p>
    </Tabs.Content>

    <Tabs.Content value="failure-modes">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>The chatbot-on-top-of-RAG plateau.</h3>
      <p style={{ margin: 0 }}>
        Most teams stop here. The demo dazzles; the production loop never closes. The fix is not a
        better model — it is a tighter feedback loop.
      </p>
    </Tabs.Content>

    <Tabs.Content value="team">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>Senior-only.</h3>
      <p style={{ margin: 0 }}>
        No juniors, no coordinators, no project managers. Every person on an engagement is someone
        you would hire directly.
      </p>
    </Tabs.Content>
  </Tabs.Root>
);

/* ─── Compound API — vertical ────────────────────────────── */

export const CompoundVertical: Story = () => (
  <Tabs.Root defaultValue="build" orientation="vertical">
    <Tabs.List>
      <Tabs.Trigger value="build">Build</Tabs.Trigger>
      <Tabs.Trigger value="automate">Automate</Tabs.Trigger>
      <Tabs.Trigger value="advise">Advise</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="build">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>Custom AI builds</h3>
      <p style={{ margin: 0 }}>
        Full-stack production AI systems built end-to-end. From architecture to deployment.
      </p>
    </Tabs.Content>

    <Tabs.Content value="automate">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>Automations</h3>
      <p style={{ margin: 0 }}>
        Workflow automation that replaces manual processes with closed-loop inference pipelines.
      </p>
    </Tabs.Content>

    <Tabs.Content value="advise">
      <h3 style={{ margin: "0 0 var(--space-3)" }}>Advisory</h3>
      <p style={{ margin: 0 }}>
        Embedded advisory engagements for leadership teams navigating AI adoption.
      </p>
    </Tabs.Content>
  </Tabs.Root>
);

/* ─── With overflow (5+ tabs forcing horizontal scroll) ───── */

export const WithOverflow: Story = () => (
  <div style={{ maxWidth: "400px" }}>
    <TabsBasic
      tabs={[
        {
          value: "overview",
          label: "Overview",
          content: <p style={{ margin: 0 }}>Overview content panel.</p>,
        },
        {
          value: "approach",
          label: "Approach",
          content: <p style={{ margin: 0 }}>Approach content panel.</p>,
        },
        {
          value: "services",
          label: "Services",
          content: <p style={{ margin: 0 }}>Services content panel.</p>,
        },
        {
          value: "results",
          label: "Results",
          content: <p style={{ margin: 0 }}>Results content panel.</p>,
        },
        {
          value: "team",
          label: "Team",
          content: <p style={{ margin: 0 }}>Team content panel.</p>,
        },
        {
          value: "process",
          label: "Process",
          content: <p style={{ margin: 0 }}>Process content panel.</p>,
        },
        {
          value: "faq",
          label: "FAQ",
          content: <p style={{ margin: 0 }}>FAQ content panel.</p>,
        },
      ]}
    />
  </div>
);
