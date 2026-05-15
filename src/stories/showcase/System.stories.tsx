import type { CSSProperties, ReactNode } from "react";
import type { Story, StoryDefault } from "@ladle/react";

import { Wordmark } from "../../atoms/Wordmark";

import { Swatch } from "./pieces/Swatch";
import { TypeSpec, type TypeFamily } from "./pieces/TypeSpec";
import { TypeScale } from "./pieces/TypeScale";
import { SpacingScale } from "./pieces/SpacingScale";
import { LayoutSpec } from "./pieces/LayoutSpec";
import { EasingCard, type Easing } from "./pieces/EasingCard";
import { DurationsSpec } from "./pieces/DurationsSpec";
import { RadiiSpec } from "./pieces/RadiiSpec";
import { StatusBadges } from "./pieces/StatusBadges";
import { ButtonMatrix } from "./pieces/ButtonMatrix";
import { StatPair, StatLarge, StatInverted } from "./pieces/StatPair";
import { HeroFull, HeroCentered, HeroTextOnly } from "./pieces/HeroFull";
import { RoleCardSingle, RoleCardGrid } from "./pieces/RoleCardGrid";
import { PrincipleList } from "./pieces/PrincipleList";
import { FailureModeList } from "./pieces/FailureModeList";
import { SiteShellFull } from "./pieces/SiteShellFull";
import { BrandAssets } from "./pieces/BrandAssets";

import showcase from "./Showcase.module.css";

export default {
  title: "System / Reference",
} satisfies StoryDefault;

/* ─── Data ─────────────────────────────────────────────────── */

interface Color {
  name: string;
  hex: string;
  caption: string;
  dark: boolean;
}

const COLORS: Color[] = [
  {
    name: "--bg",
    hex: "#FBFBFD",
    caption: "Page background. Never pure white; matches apple.com canvas.",
    dark: false,
  },
  {
    name: "--bg-elevated",
    hex: "#FFFFFF",
    caption: "Front-most layer: popovers, sheets, dialogs.",
    dark: false,
  },
  {
    name: "--surface",
    hex: "#F5F5F7",
    caption: "Recessed elevation — code blocks, quote blocks, inline keys.",
    dark: false,
  },
  { name: "--fg", hex: "#1D1D1F", caption: "Primary text, wordmark, sigil stroke.", dark: true },
  { name: "--fg-muted", hex: "#6E6E73", caption: "Secondary copy, footer, captions.", dark: true },
  {
    name: "--hairline",
    hex: "#D2D2D7",
    caption: "Dividers, 1px rules, card borders.",
    dark: false,
  },
  { name: "--accent", hex: "#0071E3", caption: "Status dot, link grow, focus ring.", dark: true },
];

const TYPE_FAMILIES: TypeFamily[] = [
  {
    name: "--font-serif",
    role: "Display — one moment per page",
    stack: '"Instrument Serif", Georgia, "Times New Roman", serif',
    sample: (
      <>
        Technical consulting for teams shipping with <em>AI</em>.
      </>
    ),
    style: {
      fontFamily: "var(--font-serif)",
      fontSize: "3rem",
      lineHeight: 1.1,
      letterSpacing: "-0.005em",
    },
  },
  {
    name: "--font-sans",
    role: "UI, body copy, labels",
    stack: '"Geist", -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
    sample: "The quick brown fox jumps over the lazy dog — 0123456789",
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  {
    name: "--font-mono",
    role: "Source lines, eyebrows, code",
    stack: '"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
    sample: "ROLE 01 · MIT SLOAN, 2025 · §1.2 · v0.1.0",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "1rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
  },
];

const EASINGS: Easing[] = [
  {
    name: "--easing",
    curve: "cubic-bezier(0.16, 1, 0.3, 1)",
    caption: "Expo-out. Entrances.",
  },
  {
    name: "--easing-link",
    curve: "cubic-bezier(0.2, 0, 0, 1)",
    caption: "Link underline grow.",
  },
];

const SECTIONS: { id: string; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing & layout" },
  { id: "motion", label: "Motion & shape" },
  { id: "atoms", label: "Atoms" },
  { id: "molecules", label: "Molecules" },
  { id: "organisms", label: "Organisms" },
];

/* ─── Section primitives ───────────────────────────────────── */

const pageStyle: CSSProperties = {
  padding: "var(--space-12) var(--space-8) var(--space-24)",
  maxWidth: "var(--content-max)",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-24)",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
  marginBottom: "var(--space-8)",
};

const sectionEyebrowStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
  margin: 0,
};

const sectionTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.5rem)",
  margin: 0,
};

const sectionSubtitleStyle: CSSProperties = {
  color: "var(--fg-muted)",
  maxWidth: "44rem",
  margin: "var(--space-2) 0 0",
};

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

function Section({ id, eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <header style={sectionHeaderStyle}>
        <p style={sectionEyebrowStyle}>{eyebrow}</p>
        <h2 id={`${id}-title`} style={sectionTitleStyle}>
          {title}
        </h2>
        <p style={sectionSubtitleStyle}>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

/* ─── Section recipes ──────────────────────────────────────── */

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "var(--space-6)",
};

function BrandSection() {
  return (
    <Section
      id="brand"
      eyebrow="01"
      title="Brand"
      subtitle="The horizontal Wordmark drives the SiteShell header; the stacked lockup, isotype, banner, and avatar variants ship as static assets for surfaces the component doesn't cover."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "1fr" }}>
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div className={showcase.spec}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
                justifyContent: "center",
                flex: 1,
              }}
            >
              {[20, 48, 88].map((h) => (
                <div
                  key={h}
                  style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-6)" }}
                >
                  <Wordmark height={h} />
                  <span className="meta">
                    h={h}
                    {h === 20 ? " · header" : h === 88 ? " · hero" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className={[showcase.spec, showcase.specDark, showcase.specCenter].join(" ")}
            style={{ minHeight: "20rem" }}
          >
            <Wordmark height={88} />
          </div>
        </div>
        <BrandAssets />
      </div>
    </Section>
  );
}

function ColorSection() {
  return (
    <Section
      id="color"
      eyebrow="02"
      title="Color"
      subtitle="Apple-light palette. Six tokens. Dark mode is a content decision — not a token set."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
        {COLORS.map((c) => (
          <Swatch key={c.name} {...c} />
        ))}
      </div>
    </Section>
  );
}

function TypographySection() {
  return (
    <Section
      id="typography"
      eyebrow="03"
      title="Typography"
      subtitle="Three families. Instrument Serif for display; Geist for UI; Geist Mono for meta."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "1fr" }}>
        {TYPE_FAMILIES.map((f) => (
          <TypeSpec key={f.name} family={f} />
        ))}
        <TypeScale />
      </div>
    </Section>
  );
}

function SpacingSection() {
  return (
    <Section
      id="spacing"
      eyebrow="04"
      title="Spacing & layout"
      subtitle="4-px base. Three container widths. Cards and rules share the same hairline."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))" }}>
        <SpacingScale />
        <LayoutSpec />
      </div>
    </Section>
  );
}

function MotionSection() {
  return (
    <Section
      id="motion"
      eyebrow="05"
      title="Motion & shape"
      subtitle="Two easings (entrance vs. link); three durations; a 2 / 4 / 8 px radius stack."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))" }}>
        {EASINGS.map((e) => (
          <EasingCard key={e.name} ease={e} />
        ))}
        <DurationsSpec />
        <RadiiSpec />
      </div>
    </Section>
  );
}

function AtomsSection() {
  return (
    <Section
      id="atoms"
      eyebrow="06"
      title="Atoms"
      subtitle="Wordmark · StatusBadge · Button · Stat. One job each, no children of their own."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "1fr" }}>
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}>
          <StatusBadges />
          <ButtonMatrix />
        </div>
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}>
          <StatPair />
          <StatLarge />
          <StatInverted />
        </div>
      </div>
    </Section>
  );
}

function MoleculesSection() {
  return (
    <Section
      id="molecules"
      eyebrow="07"
      title="Molecules"
      subtitle="Hero · RoleCard · Principle · FailureMode. Editorial rhythm; atoms in slots."
    >
      <div style={{ ...gridStyle, gridTemplateColumns: "1fr" }}>
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))" }}>
          <HeroFull />
          <HeroCentered />
          <HeroTextOnly />
        </div>
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))" }}>
          <RoleCardSingle />
        </div>
        <RoleCardGrid />
        <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))" }}>
          <PrincipleList />
          <FailureModeList />
        </div>
      </div>
    </Section>
  );
}

function OrganismsSection() {
  return (
    <Section
      id="organisms"
      eyebrow="08"
      title="Organisms"
      subtitle="SiteShell. Top nav · main slot · hairline footer. No router awareness."
    >
      <SiteShellFull />
    </Section>
  );
}

/* ─── Top-of-page TOC + masthead ───────────────────────────── */

const tocStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2) var(--space-6)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--fs-micro)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--fg-muted)",
  borderTop: "1px solid var(--hairline)",
  borderBottom: "1px solid var(--hairline)",
  padding: "var(--space-4) 0",
  margin: "var(--space-8) 0 0",
  listStyle: "none",
};

function Masthead() {
  return (
    <header>
      <Wordmark height={32} />
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--fs-micro)",
          color: "var(--fg-muted)",
          margin: "var(--space-4) 0 0",
        }}
      >
        @poukai-inc/ui · System / Reference
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "var(--fs-tagline)",
          lineHeight: 1.15,
          margin: "var(--space-4) 0 var(--space-2)",
        }}
      >
        One page. Every layer.
      </h1>
      <p style={{ color: "var(--fg-muted)", maxWidth: "44rem", margin: 0 }}>
        Color · type · spacing · motion · atoms · molecules · organisms. Tokens and components in
        sync with the package — if this page drifts from the production output, the page is wrong.
      </p>
      <ul style={tocStyle}>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="muted-link">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

/* ─── Story ────────────────────────────────────────────────── */

/**
 * Single-page system reference. Built from the real component package; the
 * pan/zoom canvas from the prototype is replaced by vertically-stacked
 * sections with a sticky-ish TOC at the top.
 */
export const All: Story = () => (
  <article style={pageStyle}>
    <Masthead />
    <BrandSection />
    <ColorSection />
    <TypographySection />
    <SpacingSection />
    <MotionSection />
    <AtomsSection />
    <MoleculesSection />
    <OrganismsSection />
  </article>
);
