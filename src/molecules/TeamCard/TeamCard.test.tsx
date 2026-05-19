import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { TeamCard } from "./TeamCard";
import { Portrait } from "../Portrait";
import { EmailLink } from "../../atoms/EmailLink";
import { Eyebrow } from "../../atoms/Eyebrow";

/* ── Fixtures ─────────────────────────────────────────────────────────────── */

const PORTRAIT = (
  <Portrait
    src="https://picsum.photos/seed/tc-test/800/800"
    alt="Test person — headshot"
    aspect="1:1"
    width={800}
  />
);

const CONTACT = <EmailLink email="test@pouk.ai" variant="muted" />;

/* ── Root element ─────────────────────────────────────────────────────────── */

test("renders <article> root by default", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component).toHaveRole("article");
});

test("as='section' swaps root to <section>", async ({ mount }) => {
  const component = await mount(
    <TeamCard as="section" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  // component IS the root element in Playwright CT — assert its tag name directly
  await expect(component).toHaveRole("region");
});

test("as='div' renders a <div> root", async ({ mount }) => {
  const component = await mount(
    <TeamCard as="div" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.locator("div").first()).toBeVisible();
  // No article or section element at the root
  await expect(component.locator("article")).toHaveCount(0);
  await expect(component.locator("section")).toHaveCount(0);
});

/* ── Name slot ────────────────────────────────────────────────────────────── */

test("name renders as h3 by default", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("Arian Zargaran");
});

test("nameAs='h2' renders name as h2", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} nameAs="h2" name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.getByRole("heading", { level: 2 })).toHaveText("Arian Zargaran");
});

test("nameAs='h4' renders name as h4", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} nameAs="h4" name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.getByRole("heading", { level: 4 })).toHaveText("Arian Zargaran");
});

/* ── Role slot ────────────────────────────────────────────────────────────── */

test("role renders as visible text", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder, Engineering" />,
  );
  await expect(component.getByText("Founder, Engineering")).toBeVisible();
});

/* ── Bio slot ─────────────────────────────────────────────────────────────── */

test("bio renders when provided", async ({ mount }) => {
  const component = await mount(
    <TeamCard
      portrait={PORTRAIT}
      name="Arian Zargaran"
      role="Founder"
      bio="Builds production AI systems."
    />,
  );
  await expect(component.getByText("Builds production AI systems.")).toBeVisible();
});

test("bio is absent when not provided — no empty paragraph", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  // Only the role <p> should be present; no bio <p>
  await expect(component.locator("p")).toHaveCount(1);
});

/* ── Contact slot ─────────────────────────────────────────────────────────── */

test("contact slot renders when provided", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" contact={CONTACT} />,
  );
  await expect(component.getByRole("link")).toBeVisible();
});

test("contact slot is absent when not provided", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.getByRole("link")).toHaveCount(0);
});

/* ── Eyebrow slot ─────────────────────────────────────────────────────────── */

test("eyebrow string is wrapped in Eyebrow (renders visible text)", async ({ mount }) => {
  const component = await mount(
    <TeamCard eyebrow="Founding team" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component.getByText("Founding team")).toBeVisible();
});

test("eyebrow ReactNode passes through without double-wrapping", async ({ mount }) => {
  const component = await mount(
    <TeamCard
      eyebrow={<Eyebrow variant="solid">Partners</Eyebrow>}
      portrait={PORTRAIT}
      name="Arian Zargaran"
      role="Founder"
    />,
  );
  await expect(component.getByText("Partners")).toBeVisible();
});

test("eyebrow is absent when not provided", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  // No eyebrow-slot element present
  await expect(component.locator("[class*='eyebrowSlot']")).toHaveCount(0);
});

/* ── aria-labelledby wiring ───────────────────────────────────────────────── */

test("aria-labelledby on article root points to name heading id", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  // component IS the root element in Playwright CT — getAttribute on component directly
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();

  const nameHeading = component.getByRole("heading", { level: 3 });
  const nameId = await nameHeading.getAttribute("id");
  expect(nameId).toBeTruthy();
  expect(labelledById).toBe(nameId);
});

test("aria-labelledby on section root points to name heading id", async ({ mount }) => {
  const component = await mount(
    <TeamCard as="section" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();

  const nameHeading = component.getByRole("heading", { level: 3 });
  const nameId = await nameHeading.getAttribute("id");
  expect(labelledById).toBe(nameId);
});

test("aria-labelledby is absent on div root", async ({ mount }) => {
  const component = await mount(
    <TeamCard as="div" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />,
  );
  await expect(component).not.toHaveAttribute("aria-labelledby");
});

/* ── className merge + arbitrary prop forwarding ──────────────────────────── */

test("className is merged onto root element", async ({ mount }) => {
  const component = await mount(
    <TeamCard portrait={PORTRAIT} name="Arian Zargaran" role="Founder" className="custom-class" />,
  );
  // component IS the root element — check class on it directly
  await expect(component).toHaveClass(/custom-class/);
});

test("forwards data-* and aria-* props to root", async ({ mount }) => {
  const component = await mount(
    <TeamCard
      portrait={PORTRAIT}
      name="Arian Zargaran"
      role="Founder"
      data-testid="tc-root"
      aria-describedby="some-desc"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "tc-root");
  await expect(component).toHaveAttribute("aria-describedby", "some-desc");
});

/* ── axe scan ─────────────────────────────────────────────────────────────── */

test("axe — no violations (default stacked, all slots)", async ({ mount, page }) => {
  await mount(
    <TeamCard
      portrait={PORTRAIT}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end."
      contact={CONTACT}
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — no violations (horizontal layout)", async ({ mount, page }) => {
  await mount(
    <TeamCard
      layout="horizontal"
      portrait={PORTRAIT}
      name="Arian Zargaran"
      role="Founder, Engineering"
      bio="Builds production AI systems end-to-end."
      contact={CONTACT}
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("axe — no violations (as='div', minimal)", async ({ mount, page }) => {
  await mount(<TeamCard as="div" portrait={PORTRAIT} name="Arian Zargaran" role="Founder" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
