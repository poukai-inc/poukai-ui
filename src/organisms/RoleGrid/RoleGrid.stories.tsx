import type { Story, StoryDefault } from "@ladle/react";
import { RoleGrid } from "./RoleGrid";
import { RoleCard } from "../../molecules/RoleCard";

export default {
  title: "Components / RoleGrid",
} satisfies StoryDefault;

const builderCard = (
  <RoleCard
    eyebrow="Role 01"
    title="Builder"
    body="Ships production AI systems end-to-end. Owns the pipeline from raw data to deployed inference."
    hiredBy="Anthropic · Vercel · Stripe"
  />
);

const operatorCard = (
  <RoleCard
    eyebrow="Role 02"
    title="Operator"
    body="Manages and scales running AI systems. Ensures reliability, cost control, and observability."
    hiredBy="AWS · Datadog · Grafana Labs"
  />
);

const strategistCard = (
  <RoleCard
    eyebrow="Role 03"
    title="Strategist"
    body="Shapes an organisation's AI direction. Translates business needs into deployment priorities."
    hiredBy="McKinsey · BCG · a16z"
  />
);

const researcherCard = (
  <RoleCard
    eyebrow="Role 04"
    title="Researcher"
    body="Advances model capabilities and evaluation methods. Publishes findings that move the field."
    hiredBy="DeepMind · OpenAI · Meta AI"
  />
);

/** Default three-column layout — the canonical "who it's for" trio. */
export const Default: Story = () => (
  <RoleGrid heading="Who it's for" eyebrow="Roles" columns={3}>
    {builderCard}
    {operatorCard}
    {strategistCard}
  </RoleGrid>
);

/** Two-column layout — binary audience split. */
export const TwoColumns: Story = () => (
  <RoleGrid heading="Two audiences" eyebrow="Who we serve" columns={2}>
    {builderCard}
    {operatorCard}
  </RoleGrid>
);

/** Four-column layout — maximum desktop density. */
export const FourColumns: Story = () => (
  <RoleGrid heading="All four roles" eyebrow="Roles" columns={4}>
    {builderCard}
    {operatorCard}
    {strategistCard}
    {researcherCard}
  </RoleGrid>
);

/** Section-band surface — applies `--surface-section` background. */
export const SectionSurface: Story = () => (
  <RoleGrid heading="Who it's for" eyebrow="Roles" surface="section" columns={3}>
    {builderCard}
    {operatorCard}
    {strategistCard}
  </RoleGrid>
);

/** Full "Who it's for" page composition — mirrors production site usage. */
export const WhoItsFor: Story = () => (
  <div>
    <RoleGrid
      heading="Who it's for"
      eyebrow="01 · Roles"
      columns={3}
      data-testid="who-its-for-grid"
    >
      {builderCard}
      {operatorCard}
      {strategistCard}
    </RoleGrid>
  </div>
);
