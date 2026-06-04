import type { Story, StoryDefault } from "@ladle/react";
import { DashboardShell } from "./DashboardShell";

const sampleRoutes = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/team", label: "Team" },
  { href: "/dashboard/settings", label: "Settings" },
];

const routesWithIcons = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/dashboard/jobs",
    label: "Jobs",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="12" height="11" rx="1" />
        <path d="M5 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <line x1="5" y1="8" x2="11" y2="8" />
      </svg>
    ),
  },
  {
    href: "/dashboard/team",
    label: "Team",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 13c0-2.2 2.2-4 5-4" />
        <circle cx="12" cy="5" r="2" />
        <path d="M15 13c0-1.9-1.3-3.4-3-3.9" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="2" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M11.5 4.5l1.4-1.4M3.1 12.9l1.4-1.4" />
      </svg>
    ),
  },
];

const SampleFooter = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      fontSize: "var(--fs-meta)",
      fontFamily: "var(--font-sans)",
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "var(--surface)",
        border: "var(--hairline-w) solid var(--hairline)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--fs-meta)",
        color: "var(--fg-muted)",
        flexShrink: 0,
      }}
      aria-label="User avatar"
    >
      AZ
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: "var(--fg)", fontWeight: 500, lineHeight: "1.2" }}>Arian Zargaran</div>
      <div style={{ color: "var(--fg-muted)", lineHeight: "1.2" }}>Founder</div>
    </div>
    <button
      type="button"
      style={{
        background: "none",
        border: "none",
        fontSize: "var(--fs-meta)",
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        cursor: "pointer",
        padding: "var(--space-1) var(--space-2)",
      }}
    >
      Sign out
    </button>
  </div>
);

export default {
  title: "Organisms / DashboardShell",
  args: {
    currentRoute: "/dashboard/jobs",
    homeHref: "/",
    navLabel: "Sidebar",
  },
  argTypes: {
    currentRoute: { control: { type: "text" } },
    homeHref: { control: { type: "text" } },
    navLabel: { control: { type: "text" } },
  },
} satisfies StoryDefault;

/* ─── Stories ───────────────────────────────────────────────────── */

export const Playground: Story<{
  currentRoute: string;
  homeHref: string;
  navLabel: string;
}> = ({ currentRoute, homeHref, navLabel }) => (
  <DashboardShell
    routes={sampleRoutes}
    currentRoute={currentRoute}
    homeHref={homeHref}
    navLabel={navLabel}
    footer={<SampleFooter />}
  >
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Jobs
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      The active route is <code>/dashboard/jobs</code>. Change <code>currentRoute</code> in the
      controls panel to see the active accent mark move.
    </p>
  </DashboardShell>
);

export const WithIcons: Story = () => (
  <DashboardShell routes={routesWithIcons} currentRoute="/dashboard/jobs" footer={<SampleFooter />}>
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Jobs
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      Nav items with optional icon slots. Icons inherit <code>currentColor</code> from the link. Use
      16px icons (matching <code>--icon-sm</code>) for alignment with <code>--fs-meta</code> (14px)
      nav text.
    </p>
  </DashboardShell>
);

export const WithRailSlot: Story = () => (
  <DashboardShell
    routes={sampleRoutes}
    currentRoute="/dashboard"
    rail={
      <div
        style={{
          fontSize: "var(--fs-meta)",
          fontFamily: "var(--font-sans)",
          color: "var(--fg-muted)",
          padding: "var(--space-2) 0",
          borderRadius: "var(--radius-2)",
        }}
      >
        Acme Corp workspace
      </div>
    }
    footer={<SampleFooter />}
  >
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Overview
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      The <code>rail</code> prop renders a workspace label between the Wordmark and the nav.
      Intended for workspace selectors, environment badges, account switchers.
    </p>
  </DashboardShell>
);

export const NoNav: Story = () => (
  <DashboardShell footer={<SampleFooter />}>
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Shell without nav
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      Routes omitted — the rail shows only the Wordmark and footer slot. Valid for surfaces where
      nav is injected into <code>children</code>.
    </p>
  </DashboardShell>
);

export const NoFooter: Story = () => (
  <DashboardShell routes={sampleRoutes} currentRoute="/dashboard">
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Shell without footer
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      Footer slot omitted — no empty container is rendered. The nav fills the rail and the bottom is
      empty space.
    </p>
  </DashboardShell>
);

export const ManyRoutes: Story = () => (
  <DashboardShell
    routes={[
      { href: "/a", label: "Alpha" },
      { href: "/b", label: "Beta" },
      { href: "/c", label: "Gamma" },
      { href: "/d", label: "Delta" },
      { href: "/e", label: "Epsilon" },
      { href: "/f", label: "Zeta" },
      { href: "/g", label: "Eta" },
      { href: "/h", label: "Theta" },
      { href: "/i", label: "Iota" },
      { href: "/j", label: "Kappa" },
    ]}
    currentRoute="/e"
    footer={<SampleFooter />}
  >
    <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
      Many routes
    </h1>
    <p
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-body)",
      }}
    >
      The rail scrolls when nav items overflow <code>100vh</code>. The Wordmark stays at the top and
      the footer stays pinned at the bottom via <code>margin-top: auto</code>.
    </p>
  </DashboardShell>
);

export const MobileNarrow: Story = () => (
  <div style={{ maxWidth: 390, margin: "0 auto", border: "1px solid var(--hairline)" }}>
    <DashboardShell
      routes={routesWithIcons}
      currentRoute="/dashboard/jobs"
      footer={<SampleFooter />}
    >
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", marginTop: 0 }}>
        Mobile viewport
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-body)",
        }}
      >
        Below <code>--bp-md</code> the rail collapses. A sticky top bar (hamburger + Wordmark)
        appears. Tap the hamburger to slide in the off-canvas panel.
      </p>
      {Array.from({ length: 10 }, (_, i) => (
        <p
          key={i}
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--fg-muted)",
            fontSize: "var(--fs-body)",
          }}
        >
          Content paragraph {i + 1}. The off-canvas panel and backdrop overlay scrolled content
          because both are <code>position: fixed</code>.
        </p>
      ))}
    </DashboardShell>
  </div>
);
