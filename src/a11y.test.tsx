import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { Wordmark } from "./atoms/Wordmark";
import { StatusBadge } from "./atoms/StatusBadge";
import { Button } from "./atoms/Button";
import { Stat } from "./atoms/Stat";
import { Eyebrow } from "./atoms/Eyebrow";
import { EmailLink } from "./atoms/EmailLink";
import { Tag } from "./atoms/Tag";
import { Divider } from "./atoms/Divider";
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
import { Spinner } from "./atoms/Spinner";
import { ProgressBar } from "./atoms/ProgressBar";
import { Skeleton } from "./atoms/Skeleton";
import { IconFixture } from "./atoms/Icon/Icon.fixtures";
import { Link } from "./atoms/Link";
import { Text } from "./atoms/Text";
import { VisuallyHidden } from "./atoms/VisuallyHidden";
import { Code } from "./atoms/Code";
import { Kbd } from "./atoms/Kbd";
import { Image } from "./atoms/Image";
import { Logo } from "./atoms/Logo";
import { SkipLink } from "./atoms/SkipLink";
import { Mark } from "./atoms/Mark";
import { Spacer } from "./atoms/Spacer";
import { SiteShell } from "./organisms/SiteShell";
import { Footer } from "./organisms/Footer";
import { Dialog, DialogBasic } from "./organisms/Dialog";
import { Tabs, TabsBasic } from "./organisms/Tabs";
import { Input } from "./atoms/Input";
import { Select } from "./atoms/Select";
import { Checkbox } from "./atoms/Checkbox";
import { Switch } from "./atoms/Switch";
import { Textarea } from "./atoms/Textarea";
import { Field } from "./molecules/Field";
import { Banner } from "./molecules/Banner";
import { Byline } from "./molecules/Byline";
import { Form } from "./organisms/Form";
import { Harness as ToastHarness, ToastA11yHarness } from "./organisms/Toast/__test_harness__";
import { Label } from "./atoms/Label";
import { NumberFormat } from "./atoms/NumberFormat";
import { Heading } from "./atoms/Heading";
import { IconButtonVariantFixture } from "./atoms/IconButton/IconButton.fixtures";
import { Prose } from "./atoms/Prose";
import { Time } from "./atoms/Time";
import { Radio, RadioGroup } from "./atoms/Radio";

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

test("a11y — Text (size × tone matrix)", async ({ mount, page }) => {
  await mount(
    <div>
      <Text>Body default.</Text>
      <Text size="lede" tone="muted">
        Lede muted — the canonical pairing.
      </Text>
      <Text size="caption" tone="muted">
        Caption muted.
      </Text>
      <Text size="micro" tone="muted">
        Micro muted.
      </Text>
      <div style={{ background: "var(--bg-warm-accent)", padding: "var(--space-4)" }}>
        <Text tone="on-warm">On warm body.</Text>
      </div>
    </div>,
  );
  await expectAxeClean(page);
});

/**
 * `tone="on-warm-muted"` is a brand-sanctioned decorative ceiling tone
 * (see `meta/brand.md` and the `--fg-on-warm-muted` token comment). It does
 * not meet WCAG AA 4.5:1 against `--bg-warm-accent` at normal text sizes —
 * measured ratio is ~3.9:1. It is intended only for non-essential supporting
 * copy in the warm editorial band. Therefore the axe scan for this tone is
 * scoped to disable the `color-contrast` rule, matching the documented
 * brand-tier exception rather than asserting a contrast it cannot meet.
 */
test("a11y — Text on-warm-muted (brand ceiling — color-contrast suppressed)", async ({
  mount,
  page,
}) => {
  await mount(
    <div style={{ background: "var(--bg-warm-accent)", padding: "var(--space-4)" }}>
      <Text tone="on-warm-muted">Supporting copy on the warm band.</Text>
    </div>,
  );
  await expectAxeClean(page, {
    configure: (b) => b.disableRules([...AXE_ISOLATED_MOUNT_RULES, "color-contrast"]),
  });
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

test("a11y — Divider (horizontal default, hr)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above the rule</p>
      <Divider />
      <p>Below the rule</p>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Divider (vertical, div with role+aria-orientation)", async ({ mount, page }) => {
  await mount(
    <div style={{ display: "flex", height: "3rem" }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Divider (muted tone, horizontal)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above</p>
      <Divider tone="muted" />
      <p>Below</p>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Icon (decorative default)", async ({ mount, page }) => {
  await mount(<IconFixture name="mail" size="sm" />);
  await expectAxeClean(page);
});

test("a11y — Icon (semantic with aria-label)", async ({ mount, page }) => {
  await mount(
    <IconFixture name="heart" size="md" decorative={false} aria-label="Add to favourites" />,
  );
  await expectAxeClean(page);
});

test("a11y — Skeleton (block and circle variants)", async ({ mount, page }) => {
  await mount(
    <div aria-busy="true">
      <Skeleton width={200} height={24} radius="sm" />
      <Skeleton width="100%" height={16} radius="md" />
      <Skeleton width={120} height={40} radius="lg" />
      <Skeleton width={40} height={40} radius="circle" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Skeleton (as=span inline)", async ({ mount, page }) => {
  await mount(
    <p aria-busy="true">
      Posted by <Skeleton as="span" width={80} height={14} radius="sm" />
    </p>,
  );
  await expectAxeClean(page);
});

test("a11y — Link (all three variants)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>
        Read the{" "}
        <Link href="/about" variant="default">
          full case study
        </Link>{" "}
        for context.
      </p>
      <nav aria-label="Test nav">
        <Link href="/why-ai" variant="quiet">
          Why AI
        </Link>
      </nav>
      <footer>
        <Link href="mailto:hello@pouk.ai" variant="muted-link">
          hello@pouk.ai
        </Link>
      </footer>
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

test("a11y — VisuallyHidden (default span)", async ({ mount, page }) => {
  await mount(
    <div>
      <VisuallyHidden>Accessible label for an adjacent element</VisuallyHidden>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Code (inline in prose)", async ({ mount, page }) => {
  await mount(
    <p>
      Override the <Code>--accent</Code> token to change the link color, then run{" "}
      <Code>pnpm build</Code>.
    </p>,
  );
  await expectAxeClean(page);
});

test("a11y — Kbd (single, symbol with aria-label, combination)", async ({ mount, page }) => {
  await mount(
    <p>
      Press <Kbd>Esc</Kbd> to close. Reopen with <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd>.
    </p>,
  );
  await expectAxeClean(page);
});

const IMAGE_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

test("a11y — Image (descriptive alt)", async ({ mount, page }) => {
  await mount(<Image src={IMAGE_PIXEL} alt="Poukai logo" width={200} height={50} />);
  await expectAxeClean(page);
});

test("a11y — Image (decorative alt='')", async ({ mount, page }) => {
  await mount(<Image src={IMAGE_PIXEL} alt="" width={800} height={300} radius="lg" />);
  await expectAxeClean(page);
});

test("a11y — SkipLink (rest + focused)", async ({ mount, page }) => {
  await mount(
    <div>
      <SkipLink href="#main" />
      <main id="main" tabIndex={-1}>
        <p>Main content</p>
      </main>
    </div>,
  );
  await expectAxeClean(page);
  await page.keyboard.press("Tab");
  await expectAxeClean(page);
});

test("a11y — Mark (inline highlight in prose)", async ({ mount, page }) => {
  await mount(
    <p>
      The smallest real deployment teaches more than <Mark>six months of staging</Mark>, and that is
      where the work lives.
    </p>,
  );
  await expectAxeClean(page);
});

test("a11y — Spacer (block default, between paragraphs)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>Above the spacer</p>
      <Spacer size="4" />
      <p>Below the spacer</p>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Spacer (inline span between inline content)", async ({ mount, page }) => {
  await mount(
    <p>
      Left
      <Spacer as="span" axis="inline" size="3" />
      Right
    </p>,
  );
  await expectAxeClean(page);
});

test("a11y — VisuallyHidden (as=div, aria-live)", async ({ mount, page }) => {
  await mount(
    <div>
      <VisuallyHidden as="div" aria-live="polite" aria-atomic="true">
        Slide 2 of 5
      </VisuallyHidden>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Label (default tone, bound to input)", async ({ mount, page }) => {
  await mount(
    <div>
      <Label htmlFor="a11y-label-default">Email address</Label>
      <input id="a11y-label-default" type="email" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Label (required indicator, bound to input)", async ({ mount, page }) => {
  await mount(
    <div>
      <Label htmlFor="a11y-label-required" required>
        Email address
      </Label>
      <input id="a11y-label-required" type="email" aria-required="true" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Time (formats + children override)", async ({ mount, page }) => {
  const ANCHOR = "2026-05-21T14:30:00.000Z";
  await mount(
    <div>
      <p>
        <Time dateTime={ANCHOR} format="absolute" locale="en-US" />
      </p>
      <p>
        <Time dateTime={ANCHOR} format="long" locale="en-US" />
      </p>
      <p>
        <Time dateTime={ANCHOR} format="time-only" locale="en-US" />
      </p>
      <p>
        <Time dateTime={ANCHOR}>Last Wednesday</Time>
      </p>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Checkbox (unchecked, checked, indeterminate, disabled, invalid)", async ({
  mount,
  page,
}) => {
  await mount(
    <div style={{ display: "flex", gap: 12 }}>
      <Checkbox aria-label="Unchecked" />
      <Checkbox checked aria-label="Checked" />
      <Checkbox checked="indeterminate" aria-label="Indeterminate" />
      <Checkbox disabled aria-label="Disabled" />
      <Checkbox aria-invalid="true" aria-label="Invalid" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Switch (off, on, disabled)", async ({ mount, page }) => {
  await mount(
    <div style={{ display: "flex", gap: 12 }}>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled off" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Switch with htmlFor label", async ({ mount, page }) => {
  await mount(
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Switch id="a11y-sw" />
      <label htmlFor="a11y-sw">Enable notifications</label>
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

test("a11y — Byline (all props)", async ({ mount, page }) => {
  await mount(
    <Byline
      avatar="https://i.pravatar.cc/64?img=5"
      name="Jane Doe"
      role="Editor"
      publishedAt="2026-05-21T10:00:00Z"
      readTime="6 min read"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Byline (name only, no trailing content)", async ({ mount, page }) => {
  await mount(<Byline name="Jane Doe" />);
  await expectAxeClean(page);
});

test("a11y — Byline (initials fallback)", async ({ mount, page }) => {
  await mount(
    <Byline initials="JD" name="Jane Doe" role="Editor" publishedAt="2026-05-21T10:00:00Z" />,
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

/* ---------- Select ---------- */

test("a11y — Select (default, with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-select">Country</label>
      <Select id="a11y-select" defaultValue="us">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Select (invalid, with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-select-invalid">Plan</label>
      <Select id="a11y-select-invalid" invalid defaultValue="">
        <option value="" disabled>
          Select…
        </option>
        <option value="pro">Pro</option>
      </Select>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Field + Select", async ({ mount, page }) => {
  await mount(
    <Field label="Country" id="a11y-field-select" helper="Used for tax calculation.">
      <Select defaultValue="us">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>
    </Field>,
  );
  await expectAxeClean(page);
});

/* ---------- Toast ---------- */

/**
 * Toast a11y gate — one toast per tone rendered open.
 * Both ToastHarness (wraps Provider) and ToastA11yHarness (auto-fires show())
 * live in src/organisms/Toast/__test_harness__.tsx because Playwright CT
 * forbids inline component definitions in test files.
 */

test("a11y — Toast (info tone, open)", async ({ mount, page }) => {
  await mount(
    <ToastHarness position="bottom-right" defaultDuration={60000}>
      <ToastA11yHarness tone="info" />
    </ToastHarness>,
  );
  await expect(page.locator("[data-tone]", { hasText: "A11y gate: info toast." })).toBeVisible();
  await expectAxeClean(page);
});

test("a11y — Toast (success tone, open)", async ({ mount, page }) => {
  await mount(
    <ToastHarness position="bottom-right" defaultDuration={60000}>
      <ToastA11yHarness tone="success" />
    </ToastHarness>,
  );
  await expect(page.locator("[data-tone]", { hasText: "A11y gate: success toast." })).toBeVisible();
  await expectAxeClean(page);
});

test("a11y — Toast (warning tone, open)", async ({ mount, page }) => {
  await mount(
    <ToastHarness position="bottom-right" defaultDuration={60000}>
      <ToastA11yHarness tone="warning" />
    </ToastHarness>,
  );
  await expect(page.locator("[data-tone]", { hasText: "A11y gate: warning toast." })).toBeVisible();
  await expectAxeClean(page);
});

/* ---------- Spinner ---------- */

test("a11y — Spinner (default)", async ({ mount, page }) => {
  await mount(<Spinner />);
  await expectAxeClean(page);
});

test("a11y — Spinner (all sizes)", async ({ mount, page }) => {
  await mount(
    <div>
      <Spinner size="sm" label="Loading small" />
      <Spinner size="md" label="Loading medium" />
      <Spinner size="lg" label="Loading large" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Spinner (custom label)", async ({ mount, page }) => {
  await mount(<Spinner label="Submitting your request" />);
  await expectAxeClean(page);
});

test("a11y — Spinner (reduced-motion fallback)", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(<Spinner label="Loading" />);
  await expectAxeClean(page);
});

/* ---------- Radio + RadioGroup ---------- */

test("a11y — RadioGroup + Radio (unselected, with labels)", async ({ mount, page }) => {
  await mount(
    <RadioGroup aria-label="Billing plan">
      <label>
        <Radio value="monthly" />
        Monthly
      </label>
      <label>
        <Radio value="annual" />
        Annual
      </label>
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup + Radio (controlled selection)", async ({ mount, page }) => {
  await mount(
    <RadioGroup value="annual" onValueChange={() => undefined} aria-label="Billing plan">
      <label>
        <Radio value="monthly" />
        Monthly
      </label>
      <label>
        <Radio value="annual" />
        Annual
      </label>
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup horizontal (with labels)", async ({ mount, page }) => {
  await mount(
    <RadioGroup defaultValue="m" orientation="horizontal" aria-label="T-shirt size">
      {["s", "m", "l"].map((s) => (
        <label key={s}>
          <Radio value={s} />
          {s.toUpperCase()}
        </label>
      ))}
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with disabled item", async ({ mount, page }) => {
  await mount(
    <RadioGroup defaultValue="standard" aria-label="Shipping speed">
      <label>
        <Radio value="standard" />
        Standard
      </label>
      <label>
        <Radio value="express" disabled />
        Express (unavailable)
      </label>
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup disabled group", async ({ mount, page }) => {
  await mount(
    <RadioGroup disabled defaultValue="monthly" aria-label="Billing plan (disabled)">
      <label>
        <Radio value="monthly" />
        Monthly
      </label>
      <label>
        <Radio value="annual" />
        Annual
      </label>
    </RadioGroup>,
  );
  await expectAxeClean(page);
});

test("a11y — RadioGroup with aria-labelledby", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="a11y-rg-label">Choose a billing plan</p>
      <RadioGroup defaultValue="monthly" aria-labelledby="a11y-rg-label">
        <label>
          <Radio value="monthly" />
          Monthly
        </label>
        <label>
          <Radio value="annual" />
          Annual
        </label>
      </RadioGroup>
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- Toast ---------- */

test("a11y — Toast (danger tone, open)", async ({ mount, page }) => {
  await mount(
    <ToastHarness position="bottom-right" defaultDuration={60000}>
      <ToastA11yHarness tone="danger" />
    </ToastHarness>,
  );
  await expect(page.locator("[data-tone]", { hasText: "A11y gate: danger toast." })).toBeVisible();
  await expectAxeClean(page);
});

/* ---------- NumberFormat ---------- */

test("a11y — NumberFormat (notations + dl semantics)", async ({ mount, page }) => {
  await mount(
    <div>
      <p>
        Revenue: <NumberFormat value={1_234_567} locale="en-US" />. Margin:{" "}
        <NumberFormat value={0.42} notation="percent" locale="en-US" />. Cap:{" "}
        <NumberFormat value={1_234.56} notation="currency" currency="USD" locale="en-US" />.
        Compact: <NumberFormat value={4_500_000} notation="compact" locale="en-US" />.
      </p>
      <dl>
        <dt>Total users</dt>
        <NumberFormat as="dd" value={48_921} locale="en-US" />
        <dt>MRR</dt>
        <NumberFormat as="dd" value={12_750} notation="currency" currency="USD" locale="en-US" />
      </dl>
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- ProgressBar ---------- */

test("a11y — ProgressBar (determinate, aria-label)", async ({ mount, page }) => {
  await mount(<ProgressBar value={60} aria-label="Uploading report" />);
  await expectAxeClean(page);
});

test("a11y — ProgressBar (determinate, aria-labelledby)", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="pb-a11y-label">Generating AI response</p>
      <ProgressBar value={42} aria-labelledby="pb-a11y-label" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — ProgressBar (indeterminate, aria-label)", async ({ mount, page }) => {
  await mount(<ProgressBar aria-label="Loading results" />);
  await expectAxeClean(page);
});

test("a11y — ProgressBar (indeterminate, aria-labelledby)", async ({ mount, page }) => {
  await mount(
    <div>
      <p id="pb-a11y-indet-label">Background sync in progress</p>
      <ProgressBar aria-labelledby="pb-a11y-indet-label" />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — ProgressBar (reduced-motion, indeterminate)", async ({ mount, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mount(<ProgressBar aria-label="Reduced motion progress" />);
  await expectAxeClean(page);
});

test("a11y — ProgressBar (all tones, determinate)", async ({ mount, page }) => {
  await mount(
    <div>
      <ProgressBar value={60} tone="default" aria-label="Default tone progress" />
      <ProgressBar value={60} tone="success" aria-label="Success tone progress" />
      <ProgressBar value={60} tone="warning" aria-label="Warning tone progress" />
      <ProgressBar value={60} tone="danger" aria-label="Danger tone progress" />
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- Logo ---------- */

const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

test("a11y — Logo (default tone + size)", async ({ mount, page }) => {
  await mount(<Logo src={PIXEL} alt="Acme Corp" />);
  await expectAxeClean(page);
});

test("a11y — Logo (tone=color)", async ({ mount, page }) => {
  await mount(<Logo src={PIXEL} alt="Acme Corp" tone="color" />);
  await expectAxeClean(page);
});

test("a11y — Logo (tone=muted)", async ({ mount, page }) => {
  await mount(<Logo src={PIXEL} alt="Acme Corp" tone="muted" />);
  await expectAxeClean(page);
});

test("a11y — Logo (all sizes)", async ({ mount, page }) => {
  await mount(
    <div>
      <Logo src={PIXEL} alt="Small logo" size="sm" />
      <Logo src={PIXEL} alt="Medium logo" size="md" />
      <Logo src={PIXEL} alt="Large logo" size="lg" />
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- Heading ---------- */

test("a11y — Heading (h1 through h6 in document order)", async ({ mount, page }) => {
  await mount(
    <article>
      <Heading as="h1">Page title</Heading>
      <Heading as="h2">Section</Heading>
      <Heading as="h3">Subsection</Heading>
      <Heading as="h4">Tertiary</Heading>
      <Heading as="h5">Quaternary</Heading>
      <Heading as="h6">Quinary</Heading>
    </article>,
  );
  await expectAxeClean(page);
});

test("a11y — Heading (decoupled as + size — h2 element styled as h1)", async ({ mount, page }) => {
  await mount(
    <article>
      <Heading as="h1">Real document title</Heading>
      <Heading as="h2" size="h1">
        Visual h1 rendered as h2 for outline integrity
      </Heading>
    </article>,
  );
  await expectAxeClean(page);
});

/* ---------- IconButton ---------- */

test("a11y — IconButton (all variants × sizes, each with aria-label)", async ({ mount, page }) => {
  await mount(<IconButtonVariantFixture />);
  await expectAxeClean(page);
});

/* ---------- Prose ---------- */

test("a11y — Prose (long-form HTML, width=reading)", async ({ mount, page }) => {
  await mount(
    <Prose width="reading">
      <h2>A short essay</h2>
      <p>
        First paragraph with <a href="#anchor">an inline link</a>, <em>emphasis</em>, and{" "}
        <strong>strong emphasis</strong>.
      </p>
      <ul>
        <li>One item</li>
        <li>Another item</li>
      </ul>
      <blockquote>A quoted aside that sits between paragraphs.</blockquote>
      <p>Closing paragraph.</p>
    </Prose>,
  );
  await expectAxeClean(page);
});

test("a11y — Prose (default width=full, inline content only)", async ({ mount, page }) => {
  await mount(
    <Prose>
      <p>Standalone paragraph in default-width Prose.</p>
    </Prose>,
  );
  await expectAxeClean(page);
});
