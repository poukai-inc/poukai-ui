import type { Story, StoryDefault } from "@ladle/react";
import { SiteShell } from "./SiteShell";

const sampleRoutes = [
  { href: "/why-ai", label: "Why AI" },
  { href: "/roles", label: "Roles" },
  { href: "/principles", label: "Principles" },
];

export default {
  title: "Components / SiteShell",
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
