import type { Story, StoryDefault } from "@ladle/react";
import { TeamGrid } from "./TeamGrid";
import { TeamCard } from "../../molecules/TeamCard";
import { Portrait } from "../../molecules/Portrait";

export default {
  title: "Organisms / TeamGrid",
} satisfies StoryDefault;

const IMAGE_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const sampleCard = (name: string, role: string) => (
  <TeamCard
    portrait={<Portrait src={IMAGE_PIXEL} alt={`${name} — headshot`} aspect="1:1" width={400} />}
    name={name}
    role={role}
  />
);

export const Default: Story = () => (
  <TeamGrid heading="Meet the team">
    {sampleCard("Arian Zargaran", "Founder, Engineering")}
    {sampleCard("Jane Doe", "Design Lead")}
    {sampleCard("John Smith", "Engineering")}
  </TeamGrid>
);

export const TheTeam: Story = () => (
  <TeamGrid
    heading="The team"
    eyebrow="Who we are"
    lede="The practitioners behind Poukai. Senior-only, no juniors, no bloat."
  >
    {sampleCard("Arian Zargaran", "Founder, Engineering")}
    {sampleCard("Jane Doe", "Design Lead")}
    {sampleCard("John Smith", "Engineering")}
    {sampleCard("Sara Lee", "Product")}
  </TeamGrid>
);

export const TwoColumn: Story = () => (
  <TeamGrid heading="The team" columns={2}>
    {sampleCard("Arian Zargaran", "Founder, Engineering")}
    {sampleCard("Jane Doe", "Design Lead")}
  </TeamGrid>
);

export const SectionTone: Story = () => (
  <TeamGrid heading="The team" eyebrow="About us" tone="section">
    {sampleCard("Arian Zargaran", "Founder, Engineering")}
    {sampleCard("Jane Doe", "Design Lead")}
    {sampleCard("John Smith", "Engineering")}
  </TeamGrid>
);
