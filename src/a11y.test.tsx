import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { Wordmark } from "./atoms/Wordmark";
import { StatusBadge } from "./atoms/StatusBadge";
import { Button } from "./atoms/Button";
import { Stat } from "./atoms/Stat";
import { Hero } from "./molecules/Hero";
import { RoleCard } from "./molecules/RoleCard";
import { Principle } from "./molecules/Principle";
import { FailureMode } from "./molecules/FailureMode";
import { SiteShell } from "./organisms/SiteShell";

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

test("a11y — FailureMode", async ({ mount, page }) => {
  await mount(
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>Most teams stop here. The demo dazzles; the production loop never closes.</p>
    </FailureMode>,
  );
  await expectAxeClean(page);
});

/* ---------- organisms ---------- */

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
