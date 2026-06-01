import type { Story, StoryDefault } from "@ladle/react";
import { SiteShell } from "./SiteShell";

const sampleRoutes = [
  { href: "/why-ai", label: "Why AI" },
  { href: "/roles", label: "Roles" },
  { href: "/principles", label: "Principles" },
];

const nestedRoutes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/analytics", label: "Analytics" },
  {
    label: "More",
    items: [
      { href: "/settings", label: "Settings" },
      { href: "/integrations", label: "Integrations" },
      { href: "/billing", label: "Billing" },
    ],
  },
];

export default {
  title: "Organisms / SiteShell",
  args: {
    currentRoute: "/roles",
    homeHref: "/",
    navLabel: "Primary",
  },
  argTypes: {
    currentRoute: {
      control: { type: "text" },
    },
    homeHref: {
      control: { type: "text" },
    },
    navLabel: {
      control: { type: "text" },
    },
  },
} satisfies StoryDefault;

/* ─── Existing stories (unchanged) ─────────────────────────────── */

export const Playground: Story<{
  currentRoute: string;
  homeHref: string;
  navLabel: string;
}> = ({ currentRoute, homeHref, navLabel }) => (
  <SiteShell
    routes={sampleRoutes}
    currentRoute={currentRoute}
    homeHref={homeHref}
    navLabel={navLabel}
    footer={
      <p>
        © Pouk AI INC 2026 ·{" "}
        <a href="mailto:hello@pouk.ai" className="muted-link">
          hello@pouk.ai
        </a>
      </p>
    }
  >
    <h1>Roles</h1>
    <p className="lede">
      The four shapes a Poukai engagement takes. Pick the one closest to the gap your team can't
      close on its own.
    </p>
    <p>
      Page contents go here. The shell only owns the chrome — nav above, hairline footer below, and
      a sensible content max-width in between.
    </p>
  </SiteShell>
);

export const NoNav: Story = () => (
  <SiteShell footer={<p>© Pouk AI INC 2026</p>}>
    <h1>Holding page</h1>
    <p className="lede">
      Routes omitted — the shell renders the wordmark on its own. Used on <code>/</code> while the
      rest of the site is still draft.
    </p>
  </SiteShell>
);

export const NoFooter: Story = () => (
  <SiteShell routes={sampleRoutes} currentRoute="/why-ai">
    <h1>Why AI</h1>
    <p>No footer slot — the main column simply runs to the bottom.</p>
  </SiteShell>
);

export const HomeRouteActive: Story = () => (
  <SiteShell
    routes={[{ href: "/", label: "Home" }, ...sampleRoutes]}
    currentRoute="/"
    footer={<p>© Pouk AI INC 2026</p>}
  >
    <h1>Home</h1>
    <p>The home route is marked active via `currentRoute="/"`.</p>
  </SiteShell>
);

/* ─── New stories ────────────────────────────────────────────────── */

export const Sticky: Story = () => (
  <SiteShell sticky routes={sampleRoutes} currentRoute="/roles" footer={<p>© Pouk AI INC 2026</p>}>
    <h1>Sticky Header</h1>
    <p>
      The header sticks to the top of the viewport as you scroll. A hairline border-bottom appears
      below the bar and block padding is reduced to <code>--space-4</code> for a compact bar.
    </p>
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i}>
        Scroll content paragraph {i + 1}. The header remains fixed to the viewport top while this
        content scrolls behind it.
      </p>
    ))}
  </SiteShell>
);

export const WithEndSlot: Story = () => (
  <SiteShell
    routes={sampleRoutes}
    currentRoute="/roles"
    end={
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
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
            fontFamily: "var(--font-sans)",
            color: "var(--fg-muted)",
          }}
          aria-label="User avatar placeholder"
        >
          AZ
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
    }
    footer={<p>© Pouk AI INC 2026</p>}
  >
    <h1>With End Slot</h1>
    <p>
      The <code>end</code> prop accepts any ReactNode. SiteShell places it at the right edge of the
      header. The consumer owns the auth controls.
    </p>
  </SiteShell>
);

export const WithNestedDropdown: Story = () => (
  <SiteShell routes={nestedRoutes} currentRoute="/dashboard" footer={<p>© Pouk AI INC 2026</p>}>
    <h1>Nested Dropdown Nav</h1>
    <p>
      The <strong>More</strong> item has no <code>href</code> and an <code>items</code> array. On
      desktop it renders as a Radix dropdown trigger with a chevron. On mobile (narrow the viewport)
      it renders as an inline disclosure.
    </p>
  </SiteShell>
);

export const AppShellLoggedIn: Story = () => (
  <SiteShell
    sticky
    currentRoute="/dashboard"
    routes={nestedRoutes}
    end={
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
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
            fontFamily: "var(--font-sans)",
            color: "var(--fg-muted)",
          }}
          aria-label="User avatar: Arian Zargaran"
        >
          AZ
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
    }
  >
    <h1>App Shell — Logged in</h1>
    <p>
      Sticky header, nested "More" dropdown, and a consumer-assembled end slot (avatar + sign-out).
      SiteShell requires no auth prop — the consumer passes different routes and end content for
      logged-in vs marketing usage.
    </p>
    {Array.from({ length: 8 }, (_, i) => (
      <p key={i}>App content paragraph {i + 1}.</p>
    ))}
  </SiteShell>
);

export const AppShellMarketing: Story = () => (
  <SiteShell
    currentRoute="/why-ai"
    routes={sampleRoutes}
    end={
      <a
        href="/contact"
        style={{
          fontSize: "var(--fs-meta)",
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
          background: "var(--fg)",
          borderRadius: "var(--radius-2)",
          padding: "var(--space-2) var(--space-4)",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        <span style={{ color: "var(--bg)" }}>Contact</span>
      </a>
    }
    footer={
      <p>
        © Pouk AI INC 2026 ·{" "}
        <a href="mailto:hello@pouk.ai" className="muted-link">
          hello@pouk.ai
        </a>
      </p>
    }
  >
    <h1>App Shell — Marketing (logged out)</h1>
    <p>
      Same SiteShell, different <code>routes</code> and <code>end</code>. The consumer decides the
      auth-appropriate composition. SiteShell is purely compositional.
    </p>
  </SiteShell>
);

export const MobileNarrow: Story = () => (
  <div style={{ maxWidth: 390, margin: "0 auto", border: "1px solid var(--hairline)" }}>
    <SiteShell
      routes={nestedRoutes}
      currentRoute="/dashboard"
      end={
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              fontSize: "var(--fs-meta)",
              fontFamily: "var(--font-sans)",
              color: "var(--fg-muted)",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      }
      footer={<p>© Pouk AI INC 2026</p>}
    >
      <h1>Mobile Viewport</h1>
      <p>
        Below <code>--bp-md</code> the nav collapses to a hamburger button. The panel slides in from
        above. Nested items render as inline disclosures. The end slot appears at the bottom of the
        panel.
      </p>
    </SiteShell>
  </div>
);
