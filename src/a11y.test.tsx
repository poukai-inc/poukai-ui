import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { Wordmark } from "./atoms/Wordmark";
import { StatusBadge } from "./atoms/StatusBadge";
import { Button } from "./atoms/Button";
import { Stat } from "./atoms/Stat";
import { Eyebrow } from "./atoms/Eyebrow";
import { EmailLink } from "./atoms/EmailLink";
import { Tag } from "./atoms/Tag";
import { Hero } from "./molecules/Hero";
import { RoleCard } from "./molecules/RoleCard";
import { Principle } from "./molecules/Principle";
import { FailureMode } from "./molecules/FailureMode";
import { Statement } from "./molecules/Statement";
import { Section } from "./molecules/Section";
import { Pull } from "./molecules/Pull";
import { LinkCard } from "./molecules/LinkCard";
import { TeamCard } from "./molecules/TeamCard";
import { Portrait } from "./molecules/Portrait";
import { FeatureCard } from "./molecules/FeatureCard";
import { FieldNote } from "./molecules/FieldNote";
import { Quote } from "./molecules/Quote";
import { Avatar } from "./atoms/Avatar";
import { SiteShell } from "./organisms/SiteShell";
import { Footer } from "./organisms/Footer";
import { Dialog, DialogBasic } from "./organisms/Dialog";
import { Tabs, TabsBasic } from "./organisms/Tabs";
import { Input } from "./molecules/Input";
import { Textarea } from "./molecules/Textarea";
import { Field } from "./molecules/Field";
import { Banner } from "./molecules/Banner";
import { Form } from "./organisms/Form";

/**
 * a11y gate — every component is mounted in isolation and scanned with axe.
 *
 * Per migration-plan §3.3 the DS publishes only on a "green Playwright +
 * size-limit + a11y CI" — this file is the a11y leg of that gate.
 *
 * Isolated CT mounts are not full documents: axe best-practice rules such as
 * `landmark-one-main`, `page-has-heading-one`, and `region` fire on the empty
 * harness. Those are suppressed by default here. Full chrome (e.g. `SiteShell`)
 * opts into strict document semantics via `fullPageSemantics: true`.
 */

const AXE_ISOLATED_MOUNT_RULES = ["landmark-one-main", "page-has-heading-one", "region"] as const;

type ExpectAxeCleanOptions = {
  /** Run axe without suppressing document-level best-practice rules (use for organisms that model a real page). */
  fullPageSemantics?: boolean;
  configure?: (b: AxeBuilder) => AxeBuilder;
};

async function expectAxeClean(
  page: import("@playwright/test").Page,
  options?: ExpectAxeCleanOptions,
) {
  let base = new AxeBuilder({ page });
  if (!options?.fullPageSemantics) {
    base = base.disableRules([...AXE_ISOLATED_MOUNT_RULES]);
  }
  const configured = options?.configure ? options.configure(base) : base;
  const { violations } = await configured.analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

/* ---------- atoms ---------- */

test("a11y — Wordmark", async ({ mount, page }) => {
  await mount(<Wordmark />);
  await expectAxeClean(page);
});

test("a11y — StatusBadge (all states)", async ({ mount, page }) => {
  await mount(
    <div>
      <StatusBadge status="available">Available copy.</StatusBadge>
      <StatusBadge status="idle">Idle copy.</StatusBadge>
      <StatusBadge status="closed">Closed copy.</StatusBadge>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Button (variants × sizes)", async ({ mount, page }) => {
  await mount(
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Stat", async ({ mount, page }) => {
  await mount(
    <Stat value="85%" caption="of teams adopting AI plateau at pilot." source="MIT Sloan, 2025" />,
  );
  await expectAxeClean(page);
});

test("a11y — EmailLink (variants)", async ({ mount, page }) => {
  await mount(
    <div>
      <EmailLink email="hello@pouk.ai" />
      <EmailLink email="hello@pouk.ai" variant="muted" />
      <EmailLink email="founder@pouk.ai" qualifier="Arian" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Eyebrow (all variants)", async ({ mount, page }) => {
  await mount(
    <div>
      <Eyebrow variant="muted">Role 01</Eyebrow>
      <Eyebrow variant="solid">Engineering</Eyebrow>
      <Eyebrow variant="numbered" numeral="FM-03">
        Failure Mode
      </Eyebrow>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Tag (both tones, with and without icon)", async ({ mount, page }) => {
  await mount(
    <div>
      <Tag>Engineering</Tag>
      <Tag tone="muted">Draft</Tag>
      <Tag
        icon={
          <svg width={12} height={12} aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
      >
        Featured
      </Tag>
      <Tag
        tone="muted"
        icon={
          <svg width={12} height={12} aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        }
      >
        Optional
      </Tag>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Avatar (image+alt, initials+name, empty+name)", async ({ mount, page }) => {
  await mount(
    <div>
      <Avatar
        mode="image"
        src="https://picsum.photos/seed/a11y-av/80/80"
        alt="Test person — a11y scan"
      />
      <Avatar mode="initials" initials="AZ" name="Arian Zargaran" />
      <Avatar name="Unknown person" />
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- molecules ---------- */

test("a11y — Hero (with status + cta)", async ({ mount, page }) => {
  await mount(
    <Hero
      status={<StatusBadge status="available">Status copy.</StatusBadge>}
      title={
        <>
          Title with <em>emphasis</em>.
        </>
      }
      lede="Lede copy that gives the reader the gist."
      cta={
        <Button asChild>
          <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
        </Button>
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — RoleCard (with icon and footer)", async ({ mount, page }) => {
  await mount(
    <RoleCard
      icon={
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        </svg>
      }
      eyebrow="Role 01"
      title="Builder"
      body="Ships production systems end-to-end."
      hiredBy="Anthropic · Vercel"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Principle", async ({ mount, page }) => {
  await mount(
    <Principle numeral="i." title="Ship the smallest real thing.">
      <p>Pilots fail because they're rehearsals.</p>
    </Principle>,
  );
  await expectAxeClean(page);
});

test("a11y — Statement (full variant)", async ({ mount, page }) => {
  await mount(
    <Statement
      hairline
      statement={
        <>
          Custom AI builds. <em>Automations.</em> Advisory engagements.
        </>
      }
      supporting="For teams who'd rather ship than speculate."
    />,
  );
  await expectAxeClean(page);
});

test("a11y — FailureMode", async ({ mount, page }) => {
  await mount(
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
    </FailureMode>,
  );
  await expectAxeClean(page);
});

test("a11y — Section (full header + children)", async ({ mount, page }) => {
  await mount(
    <Section
      eyebrow="01 · Approach"
      title="The rules we ship by."
      lede="Supporting copy that gives the reader the gist."
    >
      <p>Body content.</p>
    </Section>,
  );
  await expectAxeClean(page);
});

test("a11y — Section (as='article')", async ({ mount, page }) => {
  await mount(
    <Section as="article" title="Press mention" lede="Independently distributable content." />,
  );
  await expectAxeClean(page);
});

test("a11y — Pull (default blockquote, serif, with attribution)", async ({ mount, page }) => {
  await mount(
    <Pull attribution="— from §3, Engineering culture">
      The smallest real deployment teaches more than six months of staging.
    </Pull>,
  );
  await expectAxeClean(page);
});

test("a11y — Pull (as='aside', sans variant)", async ({ mount, page }) => {
  await mount(
    <Pull as="aside" variant="sans" attribution="— from §3, Engineering culture">
      The smallest real deployment teaches more than six months of staging.
    </Pull>,
  );
  await expectAxeClean(page);
});

test("a11y — FieldNote (body only, no label)", async ({ mount, page }) => {
  await mount(
    <FieldNote>
      In 2024 we ran the same prompt across three model families and saw consistent degradation
      after context exceeded 16k tokens.
    </FieldNote>,
  );
  await expectAxeClean(page);
});

test("a11y — FieldNote (with label)", async ({ mount, page }) => {
  await mount(
    <FieldNote label="Note">
      These numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress and results may
      differ.
    </FieldNote>,
  );
  await expectAxeClean(page);
});

test("a11y — FieldNote (with inline link)", async ({ mount, page }) => {
  await mount(
    <FieldNote label="Note">
      The latency figures come from our <a href="/methodology">public methodology doc</a>, updated
      monthly.
    </FieldNote>,
  );
  await expectAxeClean(page);
});

test("a11y — Quote (full: quote, name, role, avatar img)", async ({ mount, page }) => {
  await mount(
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
      avatar={
        <img
          src="https://picsum.photos/seed/sarah-a11y-gate/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Quote (no avatar, no role)", async ({ mount, page }) => {
  await mount(
    <Quote quote="The feedback loop closed in days, not quarters." name="Tomás Rivera" />,
  );
  await expectAxeClean(page);
});

test("a11y — LinkCard (default, full slots)", async ({ mount, page }) => {
  await mount(
    <LinkCard
      href="/work/case"
      eyebrow="Design"
      title="Redesigning the onboarding flow"
      body="A three-month engagement that cut time-to-value by 40%."
      footer="Read more →"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — LinkCard (quiet variant)", async ({ mount, page }) => {
  await mount(
    <LinkCard href="/posts/1" variant="quiet" title="Post title" body="Post body copy." />,
  );
  await expectAxeClean(page);
});

test("a11y — LinkCard (external with sr-only span)", async ({ mount, page }) => {
  await mount(<LinkCard href="https://example.com" external title="External resource" />);
  await expectAxeClean(page);
});

test("a11y — LinkCard (title-only, minimal)", async ({ mount, page }) => {
  await mount(<LinkCard href="/work" title="Minimal card" />);
  await expectAxeClean(page);
});

test("a11y — TeamCard (default stacked, all slots)", async ({ mount, page }) => {
  await mount(
    <TeamCard
      portrait={
        <Portrait
          src="https://picsum.photos/seed/a11y-tc/800/800"
          alt="Test person — headshot for a11y scan"
          aspect="1:1"
          width={800}
        />
      }
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end for senior-only consulting practices."
      contact={<a href="mailto:arian@pouk.ai">arian@pouk.ai</a>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TeamCard (horizontal layout)", async ({ mount, page }) => {
  await mount(
    <TeamCard
      layout="horizontal"
      portrait={
        <Portrait
          src="https://picsum.photos/seed/a11y-tc-h/400/400"
          alt="Test person — headshot for a11y scan horizontal"
          aspect="1:1"
          width={400}
        />
      }
      name="Arian Zargaran"
      role="Founder, Engineering"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TeamCard (as='div', minimal)", async ({ mount, page }) => {
  await mount(
    <TeamCard
      as="div"
      portrait={
        <Portrait
          src="https://picsum.photos/seed/a11y-tc-d/800/800"
          alt="Test person — headshot for a11y scan div"
          aspect="1:1"
          width={800}
        />
      }
      name="Arian Zargaran"
      role="Founder"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Portrait (3:4 aspect, standard load)", async ({ mount, page }) => {
  await mount(
    <Portrait
      src="https://picsum.photos/seed/a11y-portrait/1800/2400"
      alt="Test person — headshot for a11y scan"
      aspect="3:4"
      width={1800}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureCard (default variant, full slots)", async ({ mount, page }) => {
  await mount(
    <FeatureCard
      icon={
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
        </svg>
      }
      eyebrow="Platform"
      title="Observability"
      body="Every inference logged, traced, and alertable."
      footer={<a href="/docs/observability">Learn more →</a>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureCard (bordered variant)", async ({ mount, page }) => {
  await mount(
    <FeatureCard
      variant="bordered"
      title="Secure by default"
      body="Every pipeline is air-gapped, audited, and compliant."
    />,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureCard (as='li' inside ul)", async ({ mount, page }) => {
  await mount(
    <ul style={{ listStyle: "none", padding: 0 }}>
      <FeatureCard as="li" title="List feature" body="Feature description copy." />
    </ul>,
  );
  await expectAxeClean(page);
});

test("a11y — Banner (all four tones)", async ({ mount, page }) => {
  await mount(
    <div>
      <Banner tone="info">Session will expire in 15 minutes.</Banner>
      <Banner tone="warning">API key expires in 3 days.</Banner>
      <Banner tone="danger">Deployment failed. Check the logs.</Banner>
      <Banner tone="success">Deployment complete. Changes are live.</Banner>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Portrait (lazy default, eager above-fold)", async ({ mount, page }) => {
  await mount(
    <div>
      <Portrait
        src="https://picsum.photos/seed/a11y-portrait/1800/2400"
        alt="Arian Zargaran, founder of Poukai — headshot in natural light"
        aspect="3:4"
        width={1800}
      />
      <Portrait
        src="https://picsum.photos/seed/a11y-portrait-eager/800/800"
        alt="Team member headshot for a11y gate scan"
        aspect="1:1"
        width={800}
        loading="eager"
        fetchPriority="high"
      />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureCard (as='section')", async ({ mount, page }) => {
  await mount(<FeatureCard as="section" title="Section feature" body="Section body copy." />);
  await expectAxeClean(page);
});

/* ---------- organisms ---------- */

test("a11y — Footer (as=div, with links)", async ({ mount, page }) => {
  await mount(
    <div>
      <Footer
        copyright="© Pouk AI INC 2026"
        email="hello@pouk.ai"
        links={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "https://github.com/poukai-inc", label: "GitHub ↗", external: true },
        ]}
      />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Dialog (compound API, open)", async ({ mount, page }) => {
  await mount(
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Accessible dialog</Dialog.Title>
          <Dialog.Description>
            This dialog has a title and description for screen readers.
          </Dialog.Description>
          <p>Body content.</p>
          <Dialog.Close asChild>
            <Button variant="ghost">Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  );
  await expectAxeClean(page);
});

test("a11y — Footer (as=footer, standalone, no links)", async ({ mount, page }) => {
  await mount(<Footer as="footer" copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />);
  await expectAxeClean(page);
});

test("a11y — Footer (as=footer, with custom emailLabel)", async ({ mount, page }) => {
  await mount(
    <Footer
      as="footer"
      copyright="© Pouk AI INC 2026"
      email="hello@pouk.ai"
      emailLabel="Contact"
      links={[{ href: "/privacy", label: "Privacy" }]}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — DialogBasic (open, all slots)", async ({ mount, page }) => {
  await mount(
    <DialogBasic
      open={true}
      onOpenChange={() => {}}
      title="A11y central gate dialog"
      description="This dialog is rendered open for the axe scan."
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </>
      }
    >
      <p>Body content for the accessibility gate scan.</p>
    </DialogBasic>,
  );
  await expectAxeClean(page);
});

test("a11y — Tabs (compound API, horizontal)", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="approach">Approach</Tabs.Trigger>
        <Tabs.Trigger value="results">Results</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <p>Overview panel content for the a11y gate scan.</p>
      </Tabs.Content>
      <Tabs.Content value="approach">
        <p>Approach panel content for the a11y gate scan.</p>
      </Tabs.Content>
      <Tabs.Content value="results">
        <p>Results panel content for the a11y gate scan.</p>
      </Tabs.Content>
    </Tabs.Root>,
  );
  await expectAxeClean(page);
});

test("a11y — Tabs (compound API, vertical)", async ({ mount, page }) => {
  await mount(
    <Tabs.Root defaultValue="build" orientation="vertical">
      <Tabs.List>
        <Tabs.Trigger value="build">Build</Tabs.Trigger>
        <Tabs.Trigger value="automate">Automate</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="build">
        <p>Build panel for the a11y gate scan.</p>
      </Tabs.Content>
      <Tabs.Content value="automate">
        <p>Automate panel for the a11y gate scan.</p>
      </Tabs.Content>
    </Tabs.Root>,
  );
  await expectAxeClean(page);
});

test("a11y — TabsBasic", async ({ mount, page }) => {
  await mount(
    <TabsBasic
      tabs={[
        {
          value: "overview",
          label: "Overview",
          content: <p>Overview panel content for the a11y gate scan.</p>,
        },
        {
          value: "approach",
          label: "Approach",
          content: <p>Approach panel content for the a11y gate scan.</p>,
        },
      ]}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Field + Input (email, with helper)", async ({ mount, page }) => {
  await mount(
    <Field label="Email address" id="a11y-gate-field-input" helper="We'll never share your email.">
      <Input type="email" placeholder="you@example.com" />
    </Field>,
  );
  await expectAxeClean(page);
});

test("a11y — Field + Textarea (message, with helper)", async ({ mount, page }) => {
  await mount(
    <Field label="Message" id="a11y-gate-field-ta" helper="Tell us about your project.">
      <Textarea placeholder="Your message…" />
    </Field>,
  );
  await expectAxeClean(page);
});

test("a11y — Field with error state", async ({ mount, page }) => {
  await mount(
    <Field
      label="Email address"
      id="a11y-gate-field-error"
      error="Please enter a valid email address."
    >
      <Input type="email" defaultValue="not-an-email" />
    </Field>,
  );
  await expectAxeClean(page);
});

test("a11y — Field required + Input", async ({ mount, page }) => {
  await mount(
    <Field label="Full name" id="a11y-gate-field-required" required>
      <Input placeholder="Arian Zargaran" />
    </Field>,
  );
  await expectAxeClean(page);
});

test("a11y — SiteShell (full chrome)", async ({ mount, page }) => {
  await mount(
    <SiteShell
      currentRoute="/roles"
      routes={[
        { href: "/why-ai", label: "Why AI" },
        { href: "/roles", label: "Roles" },
        { href: "/principles", label: "Principles" },
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
      <h1>Page heading</h1>
      <p>Body copy.</p>
    </SiteShell>,
  );
  await expectAxeClean(page, { fullPageSemantics: true });
});

test("a11y — Form (with Field + Input + Textarea + Button)", async ({ mount, page }) => {
  await mount(
    <Form onSubmit={() => undefined}>
      <Field label="Email" id="a11y-form-email">
        <Input type="email" name="email" />
      </Field>
      <Field label="Message" id="a11y-form-message">
        <Textarea name="message" rows={4} />
      </Field>
      <Button variant="primary" type="submit">
        Send
      </Button>
    </Form>,
  );
  await expectAxeClean(page);
});
