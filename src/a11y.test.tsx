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
import { PriceTier } from "./molecules/PriceTier";
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
import { NavLink } from "./molecules/NavLink";
import { StatList } from "./molecules/StatList";
import { Caption } from "./molecules/Caption";
import { Byline } from "./molecules/Byline";
import { HoverCard } from "./molecules/HoverCard";
import { Stepper } from "./molecules/Stepper";
import { SearchField } from "./molecules/SearchField";
import { LinkList } from "./molecules/LinkList";
import { MetaList } from "./molecules/MetaList";
import { Form } from "./organisms/Form";
import { Harness as ToastHarness, ToastA11yHarness } from "./organisms/Toast/__test_harness__";
import { Label } from "./atoms/Label";
import { NumberFormat } from "./atoms/NumberFormat";
import { Heading } from "./atoms/Heading";
import { IconButtonVariantFixture } from "./atoms/IconButton/IconButton.fixtures";
import { Prose } from "./atoms/Prose";
import { Time } from "./atoms/Time";
import { Radio, RadioGroup } from "./atoms/Radio";
import { ShorthandHarness as TooltipShorthandHarness } from "./atoms/Tooltip/__test_harness__";
import { NewsletterField } from "./molecules/NewsletterField";
import { CtaBlock } from "./molecules/CtaBlock";
import { TagList } from "./molecules/TagList";
import { MenuItem } from "./molecules/MenuItem";
import { Alert } from "./molecules/Alert";
import { ContextMenu } from "./molecules/ContextMenu";
import { Disclosure } from "./molecules/Disclosure";
import { FormRow } from "./molecules/FormRow";
import { TimelineItem } from "./molecules/TimelineItem";
import { Fieldset } from "./molecules/Fieldset";
import { TeamGrid } from "./organisms/TeamGrid";
import { FailureModeList } from "./organisms/FailureModeList";
import { LogoCloud } from "./organisms/LogoCloud";
import { PrincipleList } from "./organisms/PrincipleList";
import { FeatureGrid } from "./organisms/FeatureGrid";
import { RoleGrid } from "./organisms/RoleGrid";
import { ShareLinks } from "./molecules/ShareLinks";
import { TableOfContents } from "./molecules/TableOfContents";
import { PopoverA11yHarness } from "./molecules/Popover/__test_harness__";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "./molecules/Table";
import { Figure } from "./molecules/Figure";
import { CopyButton } from "./molecules/CopyButton";
import { Pagination } from "./molecules/Pagination";
import { EmptyState } from "./molecules/EmptyState";
import { TimePicker } from "./atoms/TimePicker";
import { TestimonialBlock } from "./organisms/TestimonialBlock";
import { ContactBlock } from "./organisms/ContactBlock";
import { BlogPostCard } from "./organisms/BlogPostCard";
import { PricingTable } from "./organisms/PricingTable";
import { CodeBlock } from "./molecules/CodeBlock";
import { Carousel } from "./molecules/Carousel";
import { DatePicker } from "./molecules/DatePicker";
import { A11yHarness as DropdownMenuA11yHarness } from "./atoms/DropdownMenu/__test_harness__";
import { VideoEmbed } from "./molecules/VideoEmbed";

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

test("a11y — CtaBlock (stacked, with body)", async ({ mount, page }) => {
  await mount(
    <CtaBlock
      heading="Ready to start?"
      body="We work with senior-only teams who'd rather ship than speculate."
      actions={<button type="button">Get a demo</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — CtaBlock (horizontal, center-aligned, two actions)", async ({ mount, page }) => {
  await mount(
    <CtaBlock
      orientation="horizontal"
      align="center"
      heading="Interested in working together?"
      body="Senior-only teams. Production from day one."
      actions={
        <>
          <button type="button">Start a project</button>
          <button type="button">Learn more</button>
        </>
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — CtaBlock (no body, headingAs=h3)", async ({ mount, page }) => {
  await mount(
    <CtaBlock
      headingAs="h3"
      heading="Section closing moment."
      actions={<button type="button">Act</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — CTASection (default surface, centered)", async ({ mount, page }) => {
  await mount(
    <CTASection
      heading="Ready to start?"
      body="Spin up your first project in minutes."
      actions={<button type="button">Get a demo</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — CTASection (recessed surface)", async ({ mount, page }) => {
  await mount(
    <CTASection
      surface="recessed"
      heading="Ready to start?"
      body="We work with senior-only teams."
      actions={<button type="button">Get a demo</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — CTASection (align=start, size=tight, headingAs=h3)", async ({ mount, page }) => {
  await mount(
    <CTASection
      align="start"
      size="tight"
      headingAs="h3"
      heading="Interested in this role?"
      actions={<button type="button">Apply now</button>}
    />,
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

test("a11y — TagList (default, multiple Tags)", async ({ mount, page }) => {
  await mount(
    <TagList>
      <Tag>Engineering</Tag>
      <Tag>Design Systems</Tag>
      <Tag tone="muted">Draft</Tag>
    </TagList>,
  );
  await expectAxeClean(page);
});

test("a11y — TagList (with max overflow pill)", async ({ mount, page }) => {
  await mount(
    <TagList max={2}>
      <Tag>Engineering</Tag>
      <Tag>Design Systems</Tag>
      <Tag>A11y</Tag>
      <Tag>React</Tag>
    </TagList>,
  );
  await expectAxeClean(page);
});

test("a11y — TagList (gap=sm)", async ({ mount, page }) => {
  await mount(
    <TagList gap="sm">
      <Tag>Engineering</Tag>
      <Tag>Design Systems</Tag>
    </TagList>,
  );
  await expectAxeClean(page);
});

test("a11y — FormRow (two Fields, default gap)", async ({ mount, page }) => {
  await mount(
    <FormRow>
      <Field label="First name" id="a11y-formrow-first">
        <Input placeholder="Arian" />
      </Field>
      <Field label="Last name" id="a11y-formrow-last">
        <Input placeholder="Zargaran" />
      </Field>
    </FormRow>,
  );
  await expectAxeClean(page);
});

test("a11y — TimelineItem (with body)", async ({ mount, page }) => {
  await mount(
    <ol>
      <TimelineItem date="2026-05-22" title="Series A closed" body="$12M led by Acme Ventures." />
      <TimelineItem date="2025-01-10" title="Company founded" connector={false} />
    </ol>,
  );
  await expectAxeClean(page);
});

test("a11y — FormRow (three Fields, tight gap, explicit columns)", async ({ mount, page }) => {
  await mount(
    <FormRow gap="tight" columns={3}>
      <Field label="City" id="a11y-formrow-city">
        <Input placeholder="San Francisco" />
      </Field>
      <Field label="State" id="a11y-formrow-state">
        <Input placeholder="CA" />
      </Field>
      <Field label="ZIP" id="a11y-formrow-zip">
        <Input placeholder="94103" />
      </Field>
    </FormRow>,
  );
  await expectAxeClean(page);
});

test("a11y — TimelineItem (title only, no connector)", async ({ mount, page }) => {
  await mount(
    <ol>
      <TimelineItem date="2025-01-10" title="Company founded" connector={false} />
    </ol>,
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

test("a11y — Stepper (middle step active)", async ({ mount, page }) => {
  await mount(
    <Stepper
      steps={[{ label: "Account" }, { label: "Profile" }, { label: "Confirm" }]}
      current={1}
      aria-label="Onboarding steps"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — Stepper (size='sm', labels hidden)", async ({ mount, page }) => {
  await mount(
    <Stepper
      steps={[{ label: "Account" }, { label: "Profile" }, { label: "Confirm" }]}
      current={0}
      size="sm"
      aria-label="Checkout progress"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureCard (as='section')", async ({ mount, page }) => {
  await mount(<FeatureCard as="section" title="Section feature" body="Section body copy." />);
  await expectAxeClean(page);
});

import { HeroSection } from "./organisms/HeroSection";
import { StepsSection } from "./organisms/StepsSection";
import { Sidebar } from "./organisms/Sidebar";
import { CTASection } from "./organisms/CTASection";
import { NewsletterSection } from "./organisms/NewsletterSection";
import { AnnouncementBar } from "./organisms/AnnouncementBar";
import { Header } from "./organisms/Header";
import { ComparisonTable } from "./organisms/ComparisonTable";

/* ---------- organisms ---------- */

test("a11y — Sidebar (grouped sections, active link)", async ({ mount, page }) => {
  await mount(
    <Sidebar label="Documentation">
      <Sidebar.Group heading="Getting started">
        <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
        <LinkList.Item href="/docs/install" current>
          Installation
        </LinkList.Item>
      </Sidebar.Group>
      <Sidebar.Group heading="Components">
        <LinkList.Item href="/docs/button">Button</LinkList.Item>
        <LinkList.Item href="/docs/heading">Heading</LinkList.Item>
      </Sidebar.Group>
    </Sidebar>,
  );
  await expectAxeClean(page);
});

test("a11y — Sidebar (no group headings)", async ({ mount, page }) => {
  await mount(
    <Sidebar>
      <Sidebar.Group>
        <LinkList.Item href="/docs/intro">Introduction</LinkList.Item>
        <LinkList.Item href="/docs/install">Installation</LinkList.Item>
      </Sidebar.Group>
    </Sidebar>,
  );
  await expectAxeClean(page);
});

test("a11y — Header (default, brand only)", async ({ mount, page }) => {
  await mount(<Header homeHref="/" />);
  await expectAxeClean(page);
});

test("a11y — Header (with nav and actions)", async ({ mount, page }) => {
  await mount(
    <Header homeHref="/" bordered>
      <Header.Nav>
        <li>
          <NavLink href="/why-ai">Why AI</NavLink>
        </li>
        <li>
          <NavLink href="/roles" active>
            Roles
          </NavLink>
        </li>
        <li>
          <NavLink href="/principles">Principles</NavLink>
        </li>
      </Header.Nav>
      <Header.Actions>
        <Button asChild variant="primary">
          <a href="mailto:hello@pouk.ai">Contact</a>
        </Button>
      </Header.Actions>
    </Header>,
  );
  await expectAxeClean(page);
});

test("a11y — Header (sticky + constrained)", async ({ mount, page }) => {
  await mount(
    <Header homeHref="/" sticky constrained>
      <Header.Nav>
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
      </Header.Nav>
    </Header>,
  );
  await expectAxeClean(page);
});

test("a11y — HeroSection (default, no media)", async ({ mount, page }) => {
  await mount(
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
    />,
  );
  await expectAxeClean(page, { fullPageSemantics: false });
});

test("a11y — HeroSection (with media slot)", async ({ mount, page }) => {
  await mount(
    <HeroSection
      title="Technical consulting for teams."
      lede="Close the gap between pilot and production."
      media={
        <Portrait
          src="https://picsum.photos/seed/a11y-herosection/900/1200"
          alt="Founder in a natural light workspace"
          aspect="3:4"
          width={900}
        />
      }
    />,
  );
  await expectAxeClean(page, { fullPageSemantics: false });
});

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

test("a11y — StepsSection (3 steps, marketing composition)", async ({ mount, page }) => {
  await mount(
    <StepsSection
      heading="How it works."
      eyebrow="Process"
      lede="Three steps to ship a working pilot."
      steps={[
        { label: "Sign up", body: "Create your account." },
        { label: "Connect data", body: "Link your data source." },
        { label: "Ship", body: "Publish your first project." },
      ]}
    />,
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

/* ---------- MenuItem ---------- */

test("a11y — MenuItem (default, label only)", async ({ mount, page }) => {
  await mount(<MenuItem>Copy</MenuItem>);
  await expectAxeClean(page);
});

test("a11y — MenuItem (with icon and shortcut)", async ({ mount, page }) => {
  await mount(
    <MenuItem
      shortcut="⌘C"
      icon={
        <svg width={16} height={16} aria-hidden="true" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        </svg>
      }
    >
      Copy
    </MenuItem>,
  );
  await expectAxeClean(page);
});

test("a11y — MenuItem (tone='danger')", async ({ mount, page }) => {
  await mount(<MenuItem tone="danger">Delete post</MenuItem>);
  await expectAxeClean(page);
});

test("a11y — MenuItem (disabled)", async ({ mount, page }) => {
  await mount(<MenuItem disabled>Paste</MenuItem>);
  // color-contrast suppressed: WCAG 1.4.3 exempts disabled UI components.
  // opacity: 0.4 is per spec §4 — communicates unavailability by convention.
  // All suppressed rules passed in one disableRules call so they don't clobber
  // the landmark rules already disabled by expectAxeClean.
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region", "color-contrast"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

/* ---------- Alert ---------- */

test("a11y — Alert (all variants)", async ({ mount, page }) => {
  await mount(
    <div>
      <Alert variant="info">Your session will expire in 15 minutes.</Alert>
      <Alert variant="success" title="Success">
        Profile updated successfully.
      </Alert>
      <Alert variant="warn" title="Warning">
        Your trial ends in 3 days.
      </Alert>
      <Alert variant="error" title="Submission failed">
        Please fix the highlighted fields and try again.
      </Alert>
      <Alert variant="note">This feature is in beta.</Alert>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Disclosure (closed, default tone)", async ({ mount, page }) => {
  await mount(
    <Disclosure summary="What is Poukai?">
      <p>Poukai is a senior-only AI consulting practice that ships production AI systems.</p>
    </Disclosure>,
  );
  await expectAxeClean(page);
});

test("a11y — Disclosure (open, muted tone)", async ({ mount, page }) => {
  await mount(
    <Disclosure summary="Advanced settings" defaultOpen tone="muted">
      <p>Additional configuration options for advanced users.</p>
    </Disclosure>,
  );
  await expectAxeClean(page);
});

test("a11y — Disclosure (divider variant)", async ({ mount, page }) => {
  await mount(
    <div>
      <Disclosure summary="First section" divider>
        <p>First section content.</p>
      </Disclosure>
      <Disclosure summary="Second section" divider>
        <p>Second section content.</p>
      </Disclosure>
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — NewsletterField (default)", async ({ mount, page }) => {
  await mount(<NewsletterField />);
  await expectAxeClean(page);
});

test("a11y — NewsletterField with note slot", async ({ mount, page }) => {
  await mount(<NewsletterField note="No spam. Unsubscribe any time." />);
  await expectAxeClean(page);
});

test("a11y — NewsletterField disabled", async ({ mount, page }) => {
  await mount(<NewsletterField disabled />);
  await expectAxeClean(page);
});

test("a11y — NewsletterField size=md with custom cta", async ({ mount, page }) => {
  await mount(<NewsletterField size="md" cta="Get early access" />);
  await expectAxeClean(page);
});

test("a11y — SearchField", async ({ mount, page }) => {
  await mount(<SearchField label="Search" value="" onValueChange={() => {}} />);
  await expectAxeClean(page);
});

test("a11y — LinkList (default, no heading)", async ({ mount, page }) => {
  await mount(
    <LinkList>
      <LinkList.Item href="/about">About</LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="/writing">Writing</LinkList.Item>
    </LinkList>,
  );
  await expectAxeClean(page);
});

test("a11y — MetaList (stacked, no dividers)", async ({ mount, page }) => {
  await mount(
    <MetaList
      items={[
        { label: "Published", value: "2026-05-22" },
        { label: "Reading time", value: "6 min" },
        { label: "Author", value: "Arian Zargaran" },
      ]}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — LinkList (with heading, divider, current, external)", async ({ mount, page }) => {
  await mount(
    <LinkList heading="Company" headingLevel={3} divider>
      <LinkList.Item href="/about" current>
        About
      </LinkList.Item>
      <LinkList.Item href="/work">Work</LinkList.Item>
      <LinkList.Item href="https://example.com" external>
        External reference
      </LinkList.Item>
    </LinkList>,
  );
  await expectAxeClean(page);
});

test("a11y — NavLink (rest + active)", async ({ mount, page }) => {
  await mount(
    <nav aria-label="Primary">
      <NavLink href="/about">About</NavLink>
      <NavLink href="/work" active>
        Work
      </NavLink>
    </nav>,
  );
  await expectAxeClean(page);
});

test("a11y — MetaList (horizontal, dividers)", async ({ mount, page }) => {
  await mount(
    <MetaList
      orientation="horizontal"
      labelWidth="8rem"
      dividers
      items={[
        { label: "Version", value: "2.1.0" },
        { label: "License", value: "MIT" },
      ]}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — StatList", async ({ mount, page }) => {
  await mount(
    <StatList>
      <Stat value="85%" caption="of AI pilots never ship." source="MIT Sloan, 2025" />
      <Stat value="$300B" caption="annual enterprise AI spend." source="IDC, 2025" />
      <Stat value="3.2×" caption="faster delivery with a working dev loop." />
    </StatList>,
  );
  await expectAxeClean(page);
});

test("a11y — Caption", async ({ mount, page }) => {
  await mount(<Caption>Caption</Caption>);
  await expectAxeClean(page);
});

test("a11y — Fieldset (default — billing address)", async ({ mount, page }) => {
  await mount(
    <Fieldset legend="Billing address">
      <Field label="Street" id="a11y-street">
        <Input placeholder="123 Main St" />
      </Field>
      <Field label="City" id="a11y-city">
        <Input placeholder="San Francisco" />
      </Field>
      <Field label="Postal code" id="a11y-postal">
        <Input placeholder="94105" />
      </Field>
    </Fieldset>,
  );
  await expectAxeClean(page);
});

test("a11y — StatList with dividers", async ({ mount, page }) => {
  await mount(
    <StatList dividers>
      <Stat value="12k" caption="Users" />
      <Stat value="200" caption="Customers" />
      <Stat value="99.9%" caption="Uptime" />
    </StatList>,
  );
  await expectAxeClean(page);
});

test("a11y — Fieldset (bordered + spacious)", async ({ mount, page }) => {
  await mount(
    <Fieldset legend="Payment details" bordered spacing="spacious">
      <Field label="Card number" id="a11y-card">
        <Input placeholder="1234 5678 9012 3456" />
      </Field>
      <Field label="Expiry" id="a11y-expiry">
        <Input placeholder="MM / YY" />
      </Field>
    </Fieldset>,
  );
  await expectAxeClean(page);
});

test("a11y — Fieldset (muted legend)", async ({ mount, page }) => {
  await mount(
    <Fieldset legend="Optional preferences" legendTone="muted">
      <Field label="Email notifications" id="a11y-notif">
        <Input placeholder="you@example.com" />
      </Field>
    </Fieldset>,
  );
  await expectAxeClean(page);
});

// ---------------------------------------------------------------------------
// StatsSection organism
// ---------------------------------------------------------------------------

import { StatsSection } from "./organisms/StatsSection";

test("a11y — StatsSection (default, no heading, no fill)", async ({ mount, page }) => {
  await mount(
    <StatsSection>
      <Stat value="12k" caption="Users onboarded" />
      <Stat value="99.9%" caption="Uptime SLA" />
      <Stat value="200" caption="Customers" />
    </StatsSection>,
  );
  await expectAxeClean(page);
});

test("a11y — TeamGrid (default 3-column, 3 cards)", async ({ mount, page }) => {
  const IMAGE_PIXEL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  await mount(
    <TeamGrid heading="The team" eyebrow="Who we are" lede="Senior practitioners only.">
      <TeamCard
        portrait={
          <Portrait src={IMAGE_PIXEL} alt="Arian Zargaran — headshot" aspect="1:1" width={400} />
        }
        name="Arian Zargaran"
        role="Founder, Engineering"
      />
      <TeamCard
        portrait={<Portrait src={IMAGE_PIXEL} alt="Jane Doe — headshot" aspect="1:1" width={400} />}
        name="Jane Doe"
        role="Design Lead"
      />
      <TeamCard
        portrait={
          <Portrait src={IMAGE_PIXEL} alt="John Smith — headshot" aspect="1:1" width={400} />
        }
        name="John Smith"
        role="Engineering"
      />
    </TeamGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — StatsSection (with heading + dividers + fill)", async ({ mount, page }) => {
  await mount(
    <StatsSection heading="By the numbers" dividers fill>
      <Stat value="12k" caption="Users onboarded" />
      <Stat value="99.9%" caption="Uptime SLA" />
      <Stat value="200" caption="Customers" />
    </StatsSection>,
  );
  await expectAxeClean(page);
});

test("a11y — TeamGrid (columns=2, tone=section)", async ({ mount, page }) => {
  const IMAGE_PIXEL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  await mount(
    <TeamGrid heading="The team" columns={2} tone="section">
      <TeamCard
        portrait={
          <Portrait src={IMAGE_PIXEL} alt="Arian Zargaran — headshot" aspect="1:1" width={400} />
        }
        name="Arian Zargaran"
        role="Founder, Engineering"
      />
      <TeamCard
        portrait={<Portrait src={IMAGE_PIXEL} alt="Jane Doe — headshot" aspect="1:1" width={400} />}
        name="Jane Doe"
        role="Design Lead"
      />
    </TeamGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — FailureModeList (with heading + lede)", async ({ mount, page }) => {
  await mount(
    <FailureModeList
      eyebrow="Where things fail"
      heading="How this breaks"
      lede="Common failure modes in AI product teams."
    >
      <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
        <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
      </FailureMode>
      <FailureMode index={2} title="Evals as afterthought.">
        <p>Shipped without a measurement loop.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expectAxeClean(page);
});

test("a11y — FailureModeList (no heading)", async ({ mount, page }) => {
  await mount(
    <FailureModeList>
      <FailureMode index={1} title="Prompt engineering as strategy.">
        <p>Brittle. Undocumented. Impossible to regression-test at scale.</p>
      </FailureMode>
    </FailureModeList>,
  );
  await expectAxeClean(page);
});

/* ---------- AnnouncementBar ---------- */

test("a11y — AnnouncementBar (warm tone, default)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-warm">
      We&apos;re launching Phase 2 — new components, new primitives.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (neutral tone)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-neutral" tone="neutral">
      Scheduled maintenance on Sunday at 02:00 UTC.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (success tone)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-success" tone="success">
      Deployment complete. All services are running normally.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (danger tone)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-danger" tone="danger">
      Service degradation detected. Our team is investigating.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (warning tone)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-warning" tone="warning">
      Your API key expires in 3 days.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (dismissable=false)", async ({ mount, page }) => {
  await mount(
    <AnnouncementBar id="a11y-mandatory" tone="danger" dismissable={false}>
      Critical maintenance in progress. Read-only mode is active.
    </AnnouncementBar>,
  );
  await expectAxeClean(page);
});

test("a11y — LogoCloud (grid, with heading)", async ({ mount, page }) => {
  await mount(
    <LogoCloud heading="Trusted by" eyebrow="Customers">
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />
    </LogoCloud>,
  );
  await expectAxeClean(page);
});

test("a11y — LogoCloud (grid, aria-label, no heading)", async ({ mount, page }) => {
  await mount(
    <LogoCloud aria-label="Our partners">
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />
    </LogoCloud>,
  );
  await expectAxeClean(page);
});

test("a11y — LogoCloud (strip, aria-label)", async ({ mount, page }) => {
  await mount(
    <LogoCloud variant="strip" aria-label="Partner logos">
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Acme" alt="Acme" />
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Globex" alt="Globex" />
      <Logo src="https://placehold.co/160x60/f5f5f7/6e6e73?text=Initech" alt="Initech" />
    </LogoCloud>,
  );
  await expectAxeClean(page);
});

/* ---------- PrincipleList ---------- */

test("a11y — PrincipleList (default, three principles)", async ({ mount, page }) => {
  await mount(
    <PrincipleList
      eyebrow="01 · Approach"
      heading="The rules we ship by."
      lede="Three principles that define how we work."
    >
      <Principle numeral="i." title="Ship the smallest real thing.">
        <p>Production is the only proving ground.</p>
      </Principle>
      <Principle numeral="ii." title="Senior, end-to-end, no handoff theatre.">
        <p>No PMs translating, no juniors carrying.</p>
      </Principle>
      <Principle numeral="iii." title="Evaluation is part of the system.">
        <p>Evals are infrastructure, not analytics.</p>
      </Principle>
    </PrincipleList>,
  );
  await expectAxeClean(page);
});

/* ---------- organisms ---------- */

test("a11y — FeatureGrid (three-column, titled)", async ({ mount, page }) => {
  await mount(
    <FeatureGrid
      eyebrow="Platform"
      heading="What you get"
      lede="Every capability your team needs to ship AI reliably."
    >
      <FeatureCard title="Ship faster" body="From prototype to production in days." />
      <FeatureCard title="Scale reliably" body="Automatic routing across providers." />
      <FeatureCard title="Observe everything" body="Every inference logged and traced." />
    </FeatureGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — FeatureGrid (two-column, no heading)", async ({ mount, page }) => {
  await mount(
    <FeatureGrid columns={2}>
      <FeatureCard title="Enterprise SSO" body="SAML 2.0 and OIDC integrations." />
      <FeatureCard title="Audit logs" body="Immutable, tamper-evident logs." />
    </FeatureGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — RoleGrid (default three-column, with RoleCards)", async ({ mount, page }) => {
  await mount(
    <RoleGrid heading="Who it's for" eyebrow="Roles" columns={3}>
      <RoleCard
        eyebrow="Role 01"
        title="Builder"
        body="Ships production AI systems end-to-end."
        hiredBy="Anthropic · Vercel"
      />
      <RoleCard
        eyebrow="Role 02"
        title="Operator"
        body="Manages and scales running AI systems."
        hiredBy="AWS · Datadog"
      />
      <RoleCard
        eyebrow="Role 03"
        title="Strategist"
        body="Shapes an organisation's AI direction."
        hiredBy="McKinsey · BCG"
      />
    </RoleGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — RoleGrid (surface=section)", async ({ mount, page }) => {
  await mount(
    <RoleGrid heading="Who it's for" surface="section" columns={2}>
      <RoleCard eyebrow="Role 01" title="Builder" body="Ships production systems." />
      <RoleCard eyebrow="Role 02" title="Operator" body="Manages running systems." />
    </RoleGrid>,
  );
  await expectAxeClean(page);
});

test("a11y — TableOfContents (heading + active item)", async ({ mount, page }) => {
  await mount(
    <TableOfContents
      heading="On this page"
      items={[
        { id: "intro", label: "Introduction" },
        { id: "approach", label: "Approach" },
        { id: "methodology", label: "Methodology", depth: 2 },
        { id: "results", label: "Results" },
      ]}
      activeId="approach"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — NewsletterSection", async ({ mount, page }) => {
  await mount(
    <NewsletterSection
      heading="Get monthly updates"
      body="One email a month. No spam."
      field={<NewsletterField action="/api/subscribe" />}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TableOfContents (no heading, no active)", async ({ mount, page }) => {
  await mount(
    <TableOfContents
      items={[
        { id: "context", label: "Context" },
        { id: "findings", label: "Findings" },
        { id: "conclusion", label: "Conclusion" },
      ]}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TestimonialBlock (default — quote + byline)", async ({ mount, page }) => {
  await mount(
    <TestimonialBlock
      quote="Changed how our team ships. We went from six-week release cycles to continuous delivery."
      byline={<Byline name="Jane Doe" role="Head of Design, Acme" />}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TestimonialBlock (horizontal + start-aligned)", async ({ mount, page }) => {
  await mount(
    <TestimonialBlock
      orientation="horizontal"
      align="start"
      quote="Accelerated our roadmap by a full quarter."
      byline={<Byline name="Alex Kim" role="CTO, Startupco" />}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — PriceTier (default, with bullets + CTA)", async ({ mount, page }) => {
  await mount(
    <PriceTier
      name="Starter"
      price="$0"
      bullets={["5 projects", "1 GB storage", "Community support"]}
      cta={<button type="button">Get started free</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — PriceTier (featured with badge)", async ({ mount, page }) => {
  await mount(
    <PriceTier
      featured
      name="Pro"
      price="$29"
      per="month"
      bullets={["Unlimited projects", "Priority support"]}
      cta={<button type="button">Start free trial</button>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — HoverCard (trigger rest state)", async ({ mount, page }) => {
  await mount(
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a href="/people/jane">Jane Doe</a>
      </HoverCard.Trigger>
      <HoverCard.Content>Author preview content</HoverCard.Content>
    </HoverCard.Root>,
  );
  await expectAxeClean(page);
});

test("a11y — Popover (open, compound API)", async ({ mount, page }) => {
  await mount(<PopoverA11yHarness />);
  await expect(page.locator("[aria-label='Accessibility test popover']")).toBeVisible();
  await expectAxeClean(page);
});

test("a11y — Tooltip (shorthand, open)", async ({ mount, page }) => {
  await mount(<TooltipShorthandHarness content="Settings" defaultOpen />);
  await expect(page.locator("[role='tooltip']")).toBeVisible();
  await expectAxeClean(page);
});

/* ---------- Table ---------- */

test("a11y — Table (comfortable density, default tone)", async ({ mount, page }) => {
  await mount(
    <Table aria-label="Team members">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Role</TableHeaderCell>
          <TableHeaderCell align="end">Joined</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Arian Zargaran</TableCell>
          <TableCell>Founder</TableCell>
          <TableCell align="end">2023</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Sam Rivera</TableCell>
          <TableCell>Engineer</TableCell>
          <TableCell align="end">2024</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expectAxeClean(page);
});

test("a11y — Table (compact density, subtle tone)", async ({ mount, page }) => {
  await mount(
    <Table aria-label="Engagement metrics" density="compact" tone="subtle">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Post</TableHeaderCell>
          <TableHeaderCell align="end">Views</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Why AI fails</TableCell>
          <TableCell align="end">12,400</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  await expectAxeClean(page);
});

test("a11y — Figure (with caption)", async ({ mount, page }) => {
  await mount(
    <Figure caption="Photographer: Jane Doe">
      <img src="https://placehold.co/400x300" alt="A placeholder image for axe testing" />
    </Figure>,
  );
  await expectAxeClean(page);
});

test("a11y — Figure (no caption)", async ({ mount, page }) => {
  await mount(
    <Figure>
      <img src="https://placehold.co/400x300" alt="A placeholder image without a caption" />
    </Figure>,
  );
  await expectAxeClean(page);
});

/* ---------- CopyButton ---------- */

test("a11y — CopyButton (default, with label)", async ({ mount, page }) => {
  await mount(<CopyButton value="npm install @poukai-inc/ui" />);
  await expectAxeClean(page);
});

test("a11y — CopyButton (icon-only with aria-label)", async ({ mount, page }) => {
  await mount(<CopyButton value="sk-proj-abc123" label={false} aria-label="Copy API key" />);
  await expectAxeClean(page);
});

test("a11y — CopyButton (disabled)", async ({ mount, page }) => {
  await mount(<CopyButton value="test" disabled />);
  await expectAxeClean(page);
});

test("a11y — ShareLinks", async ({ mount, page }) => {
  await mount(<ShareLinks url="https://poukai.com/blog/post" title="Test Post" />);
  await expectAxeClean(page);
});

test("a11y — Pagination (page 5 of 10)", async ({ mount, page }) => {
  await mount(<Pagination page={5} pageCount={10} onPageChange={() => undefined} />);
  await expectAxeClean(page);
});

/* ---------- EmptyState ---------- */

test("a11y — EmptyState (default tone, title only)", async ({ mount, page }) => {
  await mount(<EmptyState title="No scheduled posts" />);
  await expectAxeClean(page);
});

test("a11y — EmptyState (with icon, description, and action)", async ({ mount, page }) => {
  await mount(
    <EmptyState
      title="No scheduled posts"
      description="Schedule your first post to start building your content calendar."
      icon={
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      }
      action={
        <button
          type="button"
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            borderRadius: "var(--radius-2)",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--fs-body)",
            padding: "var(--space-2) var(--space-4)",
            cursor: "pointer",
          }}
        >
          Schedule a post
        </button>
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — ContactBlock (minimal)", async ({ mount, page }) => {
  await mount(<ContactBlock email="hello@pouk.ai" />);
  await expectAxeClean(page);
});

test("a11y — ContactBlock (full composition)", async ({ mount, page }) => {
  await mount(
    <ContactBlock
      heading="Get in touch"
      email="hello@pouk.ai"
      emailLabel="Say hello"
      status={<StatusBadge status="available">Open for projects.</StatusBadge>}
      actions={
        <Button asChild>
          <a href="/book">Book a call</a>
        </Button>
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — EmptyState (tone='subtle')", async ({ mount, page }) => {
  await mount(
    <EmptyState
      tone="subtle"
      title="No conversations yet"
      description="When someone messages you, it will appear here."
    />,
  );
  await expectAxeClean(page);
});

/* ---------- TimePicker ---------- */

test("a11y — TimePicker (default, with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-tp-main">Start time</label>
      <TimePicker id="a11y-tp-main" />
    </div>,
  );
  await expectAxeClean(page);
});

/* ---------- Carousel ---------- */

test("a11y — Carousel (three slides, indicators)", async ({ mount, page }) => {
  await mount(
    <Carousel.Root aria-label="Feature highlights">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>First slide content.</Carousel.Slide>
          <Carousel.Slide>Second slide content.</Carousel.Slide>
          <Carousel.Slide>Third slide content.</Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
      <Carousel.Indicators />
    </Carousel.Root>,
  );
  await expectAxeClean(page);
});

/* ---------- PriceTier ---------- */

test("a11y — PriceTier (standard, full slots)", async ({ mount, page }) => {
  await mount(
    <PriceTier
      name="Pro"
      price="$49"
      cadence="per month"
      description="For growing teams that need more power."
      features={["Unlimited projects", "Priority support", "Custom domain"]}
      cta={
        <button
          type="button"
          style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}
        >
          Get started with Pro
        </button>
      }
    />,
  );
  await expectAxeClean(page);
});

import { ArticleHeader } from "./organisms/ArticleHeader";

test("a11y — ArticleHeader (default, no share)", async ({ mount, page }) => {
  await mount(
    <article>
      <ArticleHeader
        eyebrow="Engineering"
        title={
          <>
            Why we build with <em>AI</em>.
          </>
        }
        lede="A short summary of the article for readers skimming the page."
        byline={
          <Byline
            name="Arian Zargaran"
            role="Founder"
            publishedAt="2026-05-24"
            readTime="4 min read"
          />
        }
      />
    </article>,
  );
  await expectAxeClean(page);
});

/* ---------- BlogPostCard ---------- */

test("a11y — BlogPostCard (text only)", async ({ mount, page }) => {
  await mount(
    <BlogPostCard
      href="/blog/test-post"
      title="Shipping with AI"
      lede="How we closed the gap between pilot and production."
      byline={<Byline name="Arian Zargaran" publishedAt="2024-06-01" readTime="5 min read" />}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TimePicker (invalid, with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-tp-inv">Start time</label>
      <TimePicker id="a11y-tp-inv" invalid />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — PriceTier (featured)", async ({ mount, page }) => {
  await mount(
    <PriceTier
      featured
      name="Pro"
      price="$49"
      cadence="per month"
      features={["Unlimited projects", "Priority support"]}
      cta={
        <button
          type="button"
          style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body)" }}
        >
          Get started with Pro
        </button>
      }
    />,
  );
  await expectAxeClean(page);
});

test("a11y — BlogPostCard (with cover and tags)", async ({ mount, page }) => {
  await mount(
    <BlogPostCard
      href="/blog/design-systems"
      title="Design Systems at Scale"
      lede="Token-first component architecture for teams shipping across multiple surfaces."
      byline={<Byline name="Arian Zargaran" publishedAt="2024-04-15" readTime="7 min read" />}
      tags={
        <TagList>
          <Tag>Design Systems</Tag>
          <Tag>Tokens</Tag>
        </TagList>
      }
      cover={{
        src: "https://picsum.photos/seed/a11y-cover/960/540",
        alt: "Design token graph illustration",
      }}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — TimePicker (disabled, with label)", async ({ mount, page }) => {
  await mount(
    <div>
      <label htmlFor="a11y-tp-dis">Start time</label>
      <TimePicker id="a11y-tp-dis" disabled />
    </div>,
  );
  await expectAxeClean(page);
});

test("a11y — Carousel (no indicators, loop)", async ({ mount, page }) => {
  await mount(
    <Carousel.Root aria-label="Gallery" loop indicators={false}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>Image one.</Carousel.Slide>
          <Carousel.Slide>Image two.</Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
    </Carousel.Root>,
  );
  await expectAxeClean(page);
});

/* ---------- Sheet ---------- */

import { Sheet } from "./organisms/Sheet";

test("a11y — Sheet (right, open, title + description)", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="right" size="md">
        <Sheet.Title>Accessible sheet</Sheet.Title>
        <Sheet.Description>
          This sheet has a title and description for screen readers.
        </Sheet.Description>
        <p>Body content.</p>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>,
  );
  await expectAxeClean(page);
});

/* ---------- CodeBlock ---------- */

test("a11y — CodeBlock (default, copy visible)", async ({ mount, page }) => {
  await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  await expectAxeClean(page);
});

test("a11y — CodeBlock (with language label and caption)", async ({ mount, page }) => {
  await mount(
    <CodeBlock language="tsx" caption="src/components/Example.tsx">
      {`const x = 1;`}
    </CodeBlock>,
  );
  await expectAxeClean(page);
});

test("a11y — CodeBlock (hideCopy, no language — no header bar)", async ({ mount, page }) => {
  await mount(<CodeBlock hideCopy>{`const decorative = true;`}</CodeBlock>);
  await expectAxeClean(page);
});

/* ---------- PricingTable ---------- */

test("a11y — PricingTable (3-tier default)", async ({ mount, page }) => {
  await mount(
    <PricingTable
      heading={
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", margin: 0 }}>
          Choose your plan
        </h2>
      }
    >
      <PriceTier
        name="Starter"
        price="$0"
        cadence="free forever"
        features={["5 projects", "Community support"]}
        cta={
          <button type="button" style={{ fontFamily: "var(--font-sans)" }}>
            Get started with Starter
          </button>
        }
      />
      <PriceTier
        featured
        name="Pro"
        price="$49"
        cadence="per month"
        features={["Unlimited projects", "Priority support"]}
        cta={
          <button type="button" style={{ fontFamily: "var(--font-sans)" }}>
            Get started with Pro
          </button>
        }
      />
      <PriceTier
        name="Enterprise"
        price="Custom"
        cadence="contact us"
        cta={
          <button type="button" style={{ fontFamily: "var(--font-sans)" }}>
            Contact sales
          </button>
        }
      />
    </PricingTable>,
  );
  await expectAxeClean(page);
});

test("a11y — PricingTable (aria-label, no heading)", async ({ mount, page }) => {
  await mount(
    <PricingTable aria-label="Pricing plans">
      <PriceTier name="Starter" price="$0" cadence="free forever" />
      <PriceTier featured name="Pro" price="$49" cadence="per month" />
    </PricingTable>,
  );
  await expectAxeClean(page);
});

test("a11y — ComparisonTable", async ({ mount, page }) => {
  await mount(
    <ComparisonTable
      caption="Plan feature comparison"
      tiers={[{ label: "Free" }, { label: "Pro", featured: true }, { label: "Team" }]}
      rows={[
        { group: "Storage" },
        { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
        { feature: "Members", values: ["1", "5", "Unlimited"] },
        { group: "Support" },
        { feature: "SLA", values: ["—", "Email", "Priority"] },
      ]}
    />,
  );
  await expectAxeClean(page);
});

/* ---------- VideoEmbed ---------- */

test("a11y — VideoEmbed (default 16/9)", async ({ mount, page }) => {
  await mount(
    <VideoEmbed
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Rick Astley — Never Gonna Give You Up"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — ArticleHeader (with share slot + divider)", async ({ mount, page }) => {
  await mount(
    <article>
      <ArticleHeader
        eyebrow="Design"
        title="The token architecture behind our design system."
        lede="How we structure CSS custom properties to express brand decisions."
        byline={<Byline name="Arian Zargaran" role="Founder" publishedAt="2026-05-24" />}
        share={
          <div aria-label="Share article">
            <a href="https://twitter.com" aria-label="Share on Twitter">
              Twitter
            </a>
          </div>
        }
        divider
      />
    </article>,
  );
  await expectAxeClean(page);
});

test("a11y — BlogPostCard (tone=subtle)", async ({ mount, page }) => {
  await mount(
    <BlogPostCard
      href="/blog/observability"
      title="Observability for AI Systems"
      lede="Tracing and alerting patterns that work when behavior is non-deterministic."
      byline={<Byline name="Arian Zargaran" publishedAt="2024-03-12" />}
      tone="subtle"
    />,
  );
  await expectAxeClean(page);
});

test("a11y — VideoEmbed (bordered with caption)", async ({ mount, page }) => {
  await mount(
    <VideoEmbed
      src="https://player.vimeo.com/video/148751763"
      title="Design system walkthrough"
      aspectRatio="4/3"
      bordered
      caption={<figcaption>Fig. 1 — design system walkthrough, Q4 2024.</figcaption>}
    />,
  );
  await expectAxeClean(page);
});

test("a11y — AnnouncementBar (warm tone, color-contrast suppressed for warm band)", async ({
  mount,
  page,
}) => {
  await mount(
    <AnnouncementBar id="a11y-warm-action" tone="warm" action={<a href="/blog">Read more</a>}>
      Phase 2 is now live.
    </AnnouncementBar>,
  );
  // The action slot link on --bg-warm-accent uses global <a> underline which has
  // --accent (#0071E3) — insufficient contrast on the warm band (open question §1
  // in the spec). Suppress color-contrast for this variant per spec acknowledgement.
  await expectAxeClean(page, {
    configure: (b) => b.disableRules([...AXE_ISOLATED_MOUNT_RULES, "color-contrast"]),
  });
});
/* ---------- DatePicker ---------- */

test("a11y — DatePicker (trigger closed)", async ({ mount, page }) => {
  await mount(<DatePicker aria-label="Event date" />);
  await expectAxeClean(page);
});
test("a11y — Sheet (bottom, open)", async ({ mount, page }) => {
  await mount(
    <Sheet.Root defaultOpen>
      <Sheet.Content side="bottom" size="sm">
        <Sheet.Title>Bottom sheet</Sheet.Title>
        <Sheet.Description>A bottom-anchored panel.</Sheet.Description>
        <Sheet.Close asChild>
          <Button variant="ghost">Close</Button>
        </Sheet.Close>
      </Sheet.Content>
    </Sheet.Root>,
  );
  await expectAxeClean(page);
});
test("a11y — DropdownMenu (open, icons + separator + danger item)", async ({ mount, page }) => {
  await mount(<DropdownMenuA11yHarness />);
  // Menu is defaultOpen — content portalled to body, scan with it live
  await expect(page.getByRole("menu")).toBeVisible();
  // aria-hidden-focus is suppressed: Radix intentionally sets aria-hidden="true" on
  // #root (the Playwright CT mount container) when the portal opens, hiding the trigger
  // button from AT. This is correct Radix behavior for modal menus. The rule fires as
  // a false positive because the trigger is inside the aria-hidden container, not
  // because accessibility is broken. The portalled menu content (role="menu",
  // role="menuitem", aria-disabled) is fully scanned without suppression.
  await expectAxeClean(page, {
    configure: (b) => b.disableRules([...AXE_ISOLATED_MOUNT_RULES, "aria-hidden-focus"]),
  });
});
/* ---------- ContextMenu ---------- */

test("a11y — ContextMenu (trigger only, closed)", async ({ mount, page }) => {
  await mount(
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div style={{ padding: "1rem", border: "1px dashed gray" }}>Right-click me</div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Action</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>,
  );
  await expectAxeClean(page);
});
