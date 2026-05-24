import type { Story, StoryDefault } from "@ladle/react";
import { HeroSection } from "./HeroSection";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";
import { Portrait } from "../../molecules/Portrait";

export default {
  title: "Components / HeroSection",
} satisfies StoryDefault;

export const Default: Story = () => (
  <HeroSection
    status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    title={
      <>
        Technical consulting for teams shipping with <em>AI</em>.
      </>
    }
    lede="We work alongside founders and platform teams to close the gap between pilot and production."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const WithMedia: Story = () => (
  <HeroSection
    status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    title={
      <>
        Technical consulting for teams shipping with <em>AI</em>.
      </>
    }
    lede="We work alongside founders and platform teams to close the gap between pilot and production."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
    media={
      <Portrait
        src="https://picsum.photos/seed/herosection-media/900/1200"
        alt="Founder in a natural light workspace"
        aspect="3:4"
        width={900}
        loading="eager"
        fetchPriority="high"
      />
    }
  />
);

export const NoMedia: Story = () => (
  <HeroSection
    title="Technical consulting for teams."
    lede="Close the gap between pilot and production."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);

export const MarketingPageComposition: Story = () => (
  <div style={{ fontFamily: "var(--font-sans)", background: "var(--bg)", minHeight: "100vh" }}>
    <header
      style={{
        padding: "var(--space-4) var(--page-pad)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "var(--content-max)",
        margin: "0 auto",
      }}
    >
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-wordmark)" }}>
        Poukai
      </span>
      <nav>
        <a
          href="/roles"
          style={{
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
            textDecoration: "none",
            marginLeft: "var(--space-6)",
          }}
        >
          Roles
        </a>
        <a
          href="/principles"
          style={{
            fontSize: "var(--fs-meta)",
            color: "var(--fg-muted)",
            textDecoration: "none",
            marginLeft: "var(--space-6)",
          }}
        >
          Principles
        </a>
      </nav>
    </header>
    <main>
      <HeroSection
        status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
        title={
          <>
            Technical consulting for teams shipping with <em>AI</em>.
          </>
        }
        lede="We work alongside founders and platform teams to close the gap between pilot and production."
        cta={
          <Button asChild>
            <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
          </Button>
        }
        media={
          <Portrait
            src="https://picsum.photos/seed/herosection-mktg/900/1200"
            alt="Founder in a natural light workspace"
            aspect="3:4"
            width={900}
            loading="eager"
            fetchPriority="high"
          />
        }
      />
    </main>
  </div>
);

export const SizeIntimate: Story = () => (
  <HeroSection
    size="intimate"
    sectionSize="tight"
    title="Advisory engagements for senior teams."
    lede="Short-form consulting for leadership decisions that can't wait for a long engagement."
    cta={
      <Button variant="secondary" asChild>
        <a href="/roles">See all roles</a>
      </Button>
    }
  />
);

export const EntranceStagger: Story = () => (
  <HeroSection
    entrance="stagger"
    status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    title={
      <>
        Technical consulting for teams shipping with <em>AI</em>.
      </>
    }
    lede="We work alongside founders and platform teams to close the gap between pilot and production."
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
  />
);
