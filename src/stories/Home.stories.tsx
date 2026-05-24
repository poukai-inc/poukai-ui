/**
 * Home — single-scroll showcase of every published component in @poukai-inc/ui.
 *
 * Acts as the Ladle default story. Each component renders a representative
 * variant so a reviewer can scan the entire system top-to-bottom without
 * clicking through 60+ sidebar entries.
 *
 * Grouping mirrors the sidebar:
 *   Atoms      — one-job primitives
 *   Molecules  — atoms composed into a unit of meaning
 *   Organisms  — page-chrome aware composites
 */

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { Star } from "lucide-react";

import { Wordmark } from "../atoms/Wordmark";
import { StatusBadge } from "../atoms/StatusBadge";
import { Button } from "../atoms/Button";
import { Stat } from "../atoms/Stat";
import { Eyebrow } from "../atoms/Eyebrow";
import { EmailLink } from "../atoms/EmailLink";
import { Tag } from "../atoms/Tag";
import { Avatar } from "../atoms/Avatar";
import { VisuallyHidden } from "../atoms/VisuallyHidden";
import { Skeleton } from "../atoms/Skeleton";
import { Icon } from "../atoms/Icon";
import { Link } from "../atoms/Link";
import { Divider } from "../atoms/Divider";
import { Spinner } from "../atoms/Spinner";
import { Heading } from "../atoms/Heading";
import { Prose } from "../atoms/Prose";
import { Code } from "../atoms/Code";
import { Kbd } from "../atoms/Kbd";
import { Image } from "../atoms/Image";
import { Logo } from "../atoms/Logo";
import { Mark } from "../atoms/Mark";
import { Text } from "../atoms/Text";
import { IconButton } from "../atoms/IconButton";
import { Checkbox } from "../atoms/Checkbox";
import { Switch } from "../atoms/Switch";
import { Label } from "../atoms/Label";
import { SkipLink } from "../atoms/SkipLink";
import { NumberFormat } from "../atoms/NumberFormat";
import { Time } from "../atoms/Time";
import { Spacer } from "../atoms/Spacer";
import { ProgressBar } from "../atoms/ProgressBar";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Textarea } from "../atoms/Textarea";
import { Radio, RadioGroup } from "../atoms/Radio";

import { Hero } from "../molecules/Hero";
import { RoleCard } from "../molecules/RoleCard";
import { Principle } from "../molecules/Principle";
import { FailureMode } from "../molecules/FailureMode";
import { Statement } from "../molecules/Statement";
import { Portrait } from "../molecules/Portrait";
import { Section } from "../molecules/Section";
import { Pull } from "../molecules/Pull";
import { LinkCard } from "../molecules/LinkCard";
import { TeamCard } from "../molecules/TeamCard";
import { FeatureCard } from "../molecules/FeatureCard";
import { FieldNote } from "../molecules/FieldNote";
import { Quote } from "../molecules/Quote";
import { Field } from "../molecules/Field";
import { Banner } from "../molecules/Banner";

import { Footer } from "../organisms/Footer";
import { DialogBasic } from "../organisms/Dialog";
import { TabsBasic } from "../organisms/Tabs";
import { Form } from "../organisms/Form";
import { ToastProvider, useToast } from "../organisms/Toast";

export default {
  title: "Home",
} satisfies StoryDefault;

/* ───────────────────────────── layout helpers ───────────────────────────── */

const PAGE_STYLE: CSSProperties = {
  maxWidth: "var(--measure-wide, 1100px)",
  margin: "0 auto",
  padding: "var(--space-10) var(--space-8) var(--space-16)",
  fontFamily: "var(--font-sans)",
  color: "var(--fg)",
  background: "var(--bg)",
};

const FAMILY_HEADER_STYLE: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h2)",
  lineHeight: "var(--lh-heading)",
  letterSpacing: "var(--tracking-tight)",
  margin: "var(--space-14) 0 var(--space-4)",
  paddingBottom: "var(--space-2)",
  borderBottom: "var(--hairline-w) solid var(--hairline)",
};

const ITEM_STYLE: CSSProperties = {
  padding: "var(--space-6) 0",
  borderBottom: "var(--hairline-w) solid var(--hairline)",
};

const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "var(--tracking-micro)",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
  marginBottom: "var(--space-3)",
};

const ROW_STYLE: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-3)",
  alignItems: "center",
};

function Item({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section style={ITEM_STYLE} aria-label={name}>
      <div style={LABEL_STYLE}>{name}</div>
      {children}
    </section>
  );
}

function Family({ name, children }: { name: string; children: ReactNode }) {
  return (
    <>
      <h2 style={FAMILY_HEADER_STYLE} id={`family-${name.toLowerCase()}`}>
        {name}
      </h2>
      {children}
    </>
  );
}

/* small reusable assets */

const PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const STAR_ICON = (
  <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="currentColor"
    />
  </svg>
);

/* ───────────────────────────── Toast trigger ───────────────────────────── */

function ToastDemo() {
  const { show } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() => show({ tone: "info", message: "Hello from the homepage." })}
    >
      Trigger toast
    </Button>
  );
}

/* ───────────────────────────── story ───────────────────────────── */

export const Showcase: Story = () => (
  <ToastProvider position="bottom-right">
    <main style={PAGE_STYLE}>
      <header>
        <Eyebrow variant="muted">@poukai-inc/ui</Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--fs-display)",
            lineHeight: "var(--lh-display)",
            letterSpacing: "var(--tracking-tight)",
            margin: "var(--space-3) 0 var(--space-2)",
          }}
        >
          Component showcase
        </h1>
        <Text size="lede" tone="muted">
          Every published atom, molecule, and organism on one scrollable page. Use the sidebar to
          jump into a single component for full variants, docs, and tests.
        </Text>
      </header>

      <Family name="Atoms">
        <Item name="Wordmark">
          <Wordmark height={40} />
        </Item>

        <Item name="Logo">
          <div style={ROW_STYLE}>
            <Logo src={PIXEL} alt="Acme" size="sm" />
            <Logo src={PIXEL} alt="Acme" size="md" />
            <Logo src={PIXEL} alt="Acme" size="lg" />
          </div>
        </Item>

        <Item name="Heading">
          <Heading as="h1" size="h2">
            The smallest real thing.
          </Heading>
        </Item>

        <Item name="Text">
          <Text>Body copy at the default size and tone.</Text>
          <Text size="lede" tone="muted">
            Lede muted — the canonical pairing.
          </Text>
        </Item>

        <Item name="Prose">
          <Prose width="reading">
            <p>
              Prose wraps long-form content with the canonical reading measure and inline element
              styles applied — links, <em>emphasis</em>, <strong>strong</strong>, and{" "}
              <Code>inline code</Code>.
            </p>
          </Prose>
        </Item>

        <Item name="Mark">
          <Text>
            The smallest real deployment teaches more than <Mark>six months of staging</Mark>.
          </Text>
        </Item>

        <Item name="Code">
          <Text>
            Override the <Code>--accent</Code> token to recolor links.
          </Text>
        </Item>

        <Item name="Kbd">
          <Text>
            Press <Kbd>Esc</Kbd> to close. Reopen with <Kbd aria-label="Command">⌘</Kbd>{" "}
            <Kbd>K</Kbd>.
          </Text>
        </Item>

        <Item name="Link">
          <div style={ROW_STYLE}>
            <Link href="#">default link</Link>
            <Link href="#" variant="quiet">
              quiet link
            </Link>
            <Link href="#" variant="muted-link">
              muted link
            </Link>
          </div>
        </Item>

        <Item name="EmailLink">
          <EmailLink email="hello@pouk.ai" />
        </Item>

        <Item name="Eyebrow">
          <div style={ROW_STYLE}>
            <Eyebrow variant="muted">Role 01</Eyebrow>
            <Eyebrow variant="solid">Engineering</Eyebrow>
            <Eyebrow variant="numbered" numeral="FM-03">
              Failure Mode
            </Eyebrow>
          </div>
        </Item>

        <Item name="Button">
          <div style={ROW_STYLE}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Item>

        <Item name="IconButton">
          <div style={ROW_STYLE}>
            <IconButton icon={Star} aria-label="Star" />
            <IconButton icon={Star} aria-label="Star" variant="secondary" />
            <IconButton icon={Star} aria-label="Star" variant="ghost" />
          </div>
        </Item>

        <Item name="Tag">
          <div style={ROW_STYLE}>
            <Tag>Engineering</Tag>
            <Tag tone="muted">Draft</Tag>
            <Tag icon={STAR_ICON}>Featured</Tag>
          </div>
        </Item>

        <Item name="StatusBadge">
          <div style={ROW_STYLE}>
            <StatusBadge status="available">Available copy.</StatusBadge>
            <StatusBadge status="idle">Idle copy.</StatusBadge>
            <StatusBadge status="closed">Closed copy.</StatusBadge>
          </div>
        </Item>

        <Item name="Stat">
          <Stat value="85%" caption="of teams adopting AI plateau at pilot." source="MIT Sloan" />
        </Item>

        <Item name="NumberFormat">
          <Text>
            Revenue: <NumberFormat value={1_234_567} locale="en-US" />. Margin:{" "}
            <NumberFormat value={0.42} notation="percent" locale="en-US" />.
          </Text>
        </Item>

        <Item name="Time">
          <Text>
            <Time dateTime="2026-05-23T14:30:00.000Z" format="long" locale="en-US" />
          </Text>
        </Item>

        <Item name="Avatar">
          <div style={ROW_STYLE}>
            <Avatar mode="initials" initials="AZ" name="Arian Zargaran" />
            <Avatar mode="initials" initials="JD" name="Jane Doe" size="lg" />
            <Avatar name="Unknown person" />
          </div>
        </Item>

        <Item name="Icon">
          <div style={ROW_STYLE}>
            <Icon icon={Star} size="sm" />
            <Icon icon={Star} size="md" />
            <Icon icon={Star} size="lg" />
          </div>
        </Item>

        <Item name="Image">
          <Image src={PIXEL} alt="Tiny placeholder" width={120} height={40} radius="md" />
        </Item>

        <Item name="Divider">
          <Divider />
          <Divider tone="muted" />
        </Item>

        <Item name="Spacer">
          <Text>Above</Text>
          <Spacer size="4" />
          <Text>Below</Text>
        </Item>

        <Item name="Spinner">
          <div style={ROW_STYLE}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" label="Loading" />
          </div>
        </Item>

        <Item name="Skeleton">
          <div aria-busy="true" style={{ display: "grid", gap: "var(--space-2)" }}>
            <Skeleton width={240} height={20} radius="sm" />
            <Skeleton width={180} height={16} radius="sm" />
            <Skeleton width={40} height={40} radius="circle" />
          </div>
        </Item>

        <Item name="ProgressBar">
          <ProgressBar value={60} aria-label="Uploading report" />
        </Item>

        <Item name="VisuallyHidden">
          <span>
            <VisuallyHidden>Hidden helper for screen readers</VisuallyHidden>
            Visible label
          </span>
        </Item>

        <Item name="SkipLink">
          <SkipLink href="#main">Skip to main</SkipLink>
        </Item>

        <Item name="Label + Input">
          <Label htmlFor="home-email">Email address</Label>
          <Input id="home-email" type="email" placeholder="you@example.com" />
        </Item>

        <Item name="Select">
          <Label htmlFor="home-country">Country</Label>
          <Select id="home-country" defaultValue="us">
            <option value="us">United States</option>
            <option value="ca">Canada</option>
          </Select>
        </Item>

        <Item name="Textarea">
          <Label htmlFor="home-msg">Message</Label>
          <Textarea id="home-msg" placeholder="Tell us about your project…" rows={3} />
        </Item>

        <Item name="Checkbox">
          <div style={ROW_STYLE}>
            <Checkbox aria-label="Unchecked" />
            <Checkbox checked aria-label="Checked" />
            <Checkbox checked="indeterminate" aria-label="Indeterminate" />
            <Checkbox disabled aria-label="Disabled" />
          </div>
        </Item>

        <Item name="Switch">
          <div style={ROW_STYLE}>
            <Switch aria-label="Off" />
            <Switch defaultChecked aria-label="On" />
            <Switch disabled aria-label="Disabled" />
          </div>
        </Item>

        <Item name="Radio + RadioGroup">
          <RadioGroup defaultValue="monthly" aria-label="Billing plan">
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Radio value="monthly" /> Monthly
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Radio value="annual" /> Annual
            </label>
          </RadioGroup>
        </Item>
      </Family>

      <Family name="Molecules">
        <Item name="Hero">
          <Hero
            status={<StatusBadge status="available">Available</StatusBadge>}
            title={
              <>
                Title with <em>emphasis</em>.
              </>
            }
            lede="Lede copy that gives the reader the gist."
            cta={
              <Button asChild>
                <a href="#contact">hello@pouk.ai</a>
              </Button>
            }
          />
        </Item>

        <Item name="Statement">
          <Statement
            hairline
            statement={
              <>
                Custom AI builds. <em>Automations.</em> Advisory engagements.
              </>
            }
            supporting="For teams who'd rather ship than speculate."
          />
        </Item>

        <Item name="Section">
          <Section
            eyebrow="01 · Approach"
            title="The rules we ship by."
            lede="Supporting copy that gives the reader the gist."
          >
            <p>Body content for the section.</p>
          </Section>
        </Item>

        <Item name="Principle">
          <Principle numeral="i." title="Ship the smallest real thing.">
            <p>Pilots fail because they're rehearsals.</p>
          </Principle>
        </Item>

        <Item name="FailureMode">
          <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
            <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
          </FailureMode>
        </Item>

        <Item name="RoleCard">
          <RoleCard
            icon={STAR_ICON}
            eyebrow="Role 01"
            title="Builder"
            body="Ships production systems end-to-end."
            hiredBy="Anthropic · Vercel"
          />
        </Item>

        <Item name="FeatureCard">
          <FeatureCard
            icon={STAR_ICON}
            eyebrow="Platform"
            title="Observability"
            body="Every inference logged, traced, and alertable."
            footer={<a href="#docs">Learn more →</a>}
          />
        </Item>

        <Item name="LinkCard">
          <LinkCard
            href="#case"
            eyebrow="Design"
            title="Redesigning the onboarding flow"
            body="A three-month engagement that cut time-to-value by 40%."
            footer="Read more →"
          />
        </Item>

        <Item name="TeamCard">
          <TeamCard
            portrait={<Avatar mode="initials" initials="AZ" name="Arian Zargaran" size="lg" />}
            name="Arian Zargaran"
            role="Founder, Engineering"
            bio="Builds production AI systems end-to-end."
          />
        </Item>

        <Item name="Portrait">
          <Portrait
            src="https://picsum.photos/seed/showcase/600/800"
            alt="Example portrait"
            aspect="3:4"
            width={600}
          />
        </Item>

        <Item name="Quote">
          <Quote
            quote="We went from weeks to hours."
            name="Sarah Chen"
            role="VP Engineering, Meridian Labs"
          />
        </Item>

        <Item name="Pull">
          <Pull attribution="— from §3, Engineering culture">
            The smallest real deployment teaches more than six months of staging.
          </Pull>
        </Item>

        <Item name="FieldNote">
          <FieldNote label="Note">
            Numbers reflect Q4 2023 benchmarks. The 2024 evals are in progress.
          </FieldNote>
        </Item>

        <Item name="Field + Input">
          <Field label="Email" id="home-field-email" helper="We'll never share your email.">
            <Input type="email" placeholder="you@example.com" />
          </Field>
        </Item>

        <Item name="Banner">
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Banner tone="info">Session will expire in 15 minutes.</Banner>
            <Banner tone="warning">API key expires in 3 days.</Banner>
            <Banner tone="danger">Deployment failed.</Banner>
            <Banner tone="success">Deployment complete.</Banner>
          </div>
        </Item>
      </Family>

      <Family name="Organisms">
        <Item name="Form">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Field label="Email" id="home-org-email">
              <Input type="email" name="email" />
            </Field>
            <Field label="Message" id="home-org-msg">
              <Textarea name="message" rows={3} />
            </Field>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Item>

        <Item name="Tabs">
          <TabsBasic
            tabs={[
              {
                value: "overview",
                label: "Overview",
                content: <p>Overview panel content.</p>,
              },
              {
                value: "approach",
                label: "Approach",
                content: <p>Approach panel content.</p>,
              },
              { value: "results", label: "Results", content: <p>Results panel content.</p> },
            ]}
          />
        </Item>

        <Item name="Dialog (closed; click to open)">
          <DialogBasicTrigger />
        </Item>

        <Item name="Toast">
          <ToastDemo />
        </Item>

        <Item name="SiteShell">
          <Text tone="muted">
            SiteShell is the full page chrome — see <Code>Organisms / SiteShell</Code> in the
            sidebar for the full mount.
          </Text>
        </Item>

        <Item name="Footer">
          <Footer
            as="div"
            copyright="© Pouk AI INC 2026"
            email="hello@pouk.ai"
            links={[
              { href: "#privacy", label: "Privacy" },
              { href: "#terms", label: "Terms" },
            ]}
          />
        </Item>
      </Family>
    </main>
  </ToastProvider>
);

/* DialogBasic needs local open state; keep it isolated so the rest of the page
   stays a pure functional component. */
function DialogBasicTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DialogBasic
        open={open}
        onOpenChange={setOpen}
        title="Homepage dialog"
        description="A representative dialog rendered from the homepage showcase."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Body content for the dialog.</p>
      </DialogBasic>
    </>
  );
}
