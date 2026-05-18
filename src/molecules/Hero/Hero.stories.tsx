import type { Story, StoryDefault } from "@ladle/react";
import { Hero, type HeroAlign, type HeroEntrance, type HeroSize } from "./Hero";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";
import { SiteShell } from "../../organisms/SiteShell";

export default {
  title: "Components / Hero",
  args: {
    align: "start",
    size: "display",
    entrance: undefined,
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
    entrance: {
      options: [undefined, "stagger"] satisfies (HeroEntrance | undefined)[],
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

export const Playground: Story<{ align: HeroAlign; size: HeroSize; entrance: HeroEntrance }> = ({
  align,
  size,
  entrance,
}) => (
  <Hero
    align={align}
    size={size}
    entrance={entrance}
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

export const EntranceStagger: Story = () => (
  <Hero
    entrance="stagger"
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

export const EntranceStaggerIntimate: Story = () => (
  <Hero
    size="intimate"
    entrance="stagger"
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

export const EntranceStaggerTextOnly: Story = () => (
  <Hero entrance="stagger" title={sampleTitle} lede={sampleLede} />
);

export const EditorialDoorwayNoTitle: Story = () => (
  <Hero
    variant="no-title"
    eyebrow="About"
    lede="One to two sentences setting up the page. Context for what follows — not a summary of everything below."
  />
);

export const EditorialDoorwayNoTitleWithCta: Story = () => (
  <Hero
    variant="no-title"
    eyebrow="About"
    lede="One to two sentences setting up the page. Context for what follows — not a summary of everything below."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">Get in touch</a>
      </Button>
    }
  />
);

export const EditorialDoorwayNoTitleWithSiteShell: Story = () => (
  <SiteShell
    currentRoute="/about"
    routes={[
      { href: "/why-ai", label: "Why AI" },
      { href: "/roles", label: "Roles" },
      { href: "/about", label: "About" },
    ]}
    footer={
      <p>
        © Pouk AI INC ·{" "}
        <a href="mailto:hello@pouk.ai" className="muted-link">
          hello@pouk.ai
        </a>
      </p>
    }
  >
    <Hero
      variant="no-title"
      eyebrow="About"
      lede="One to two sentences setting up the page. Context for what follows — not a summary of everything below."
    />
    <h1>About Pouk AI</h1>
    <p>
      Body content follows the doorway band. The page&apos;s <code>&lt;h1&gt;</code> lives here, not
      in the Hero.
    </p>
  </SiteShell>
);
