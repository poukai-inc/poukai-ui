import type { Story, StoryDefault } from "@ladle/react";
import { Hero, type HeroAlign, type HeroSize } from "./Hero";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";

export default {
  title: "Components / Hero",
  args: {
    align: "start",
    size: "display",
  },
  argTypes: {
    align: {
      options: ["start", "center"] satisfies HeroAlign[],
      control: { type: "radio" },
    },
    size: {
      header: "size",
      options: ["display", "intimate"] satisfies HeroSize[],
      control: { type: "radio" },
    },
  },
} satisfies StoryDefault;

const sampleTitle = (
  <>
    Technical consulting for teams shipping with <em>AI</em>.
  </>
);

const sampleLede =
  "We work alongside founders and platform teams to close the gap between pilot and production — small, senior engagements, no juniors, no theatre.";

export const Playground: Story<{ align: HeroAlign; size: HeroSize }> = ({ align, size }) => (
  <Hero
    align={align}
    size={size}
    status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    title={sampleTitle}
    lede={sampleLede}
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const TextOnly: Story = () => <Hero title={sampleTitle} lede={sampleLede} />;

export const WithStatusNoCta: Story = () => (
  <Hero
    status={<StatusBadge status="idle">Reviewing scope — next intake in two weeks.</StatusBadge>}
    title={sampleTitle}
    lede={sampleLede}
  />
);

export const WithCtaNoStatus: Story = () => (
  <Hero
    title={sampleTitle}
    lede={sampleLede}
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const Centered: Story = () => (
  <Hero
    align="center"
    status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    title={sampleTitle}
    lede={sampleLede}
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const ShortHeadline: Story = () => (
  <Hero
    title={<>Close the gap.</>}
    lede="Senior technical consulting for AI-native product teams."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const SizeDisplay: Story = () => (
  <Hero size="display" title={sampleTitle} lede={sampleLede} />
);

export const SizeIntimate: Story = () => (
  <Hero size="intimate" title={sampleTitle} lede={sampleLede} />
);
