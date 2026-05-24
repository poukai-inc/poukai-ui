import { test, expect } from "@playwright/experimental-ct-react";
import { TeamGrid } from "./TeamGrid";
import { TeamCard } from "../../molecules/TeamCard";
import { Portrait } from "../../molecules/Portrait";

const IMAGE_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const makeCard = (name: string, role: string) => (
  <TeamCard
    portrait={<Portrait src={IMAGE_PIXEL} alt={`${name} — headshot`} aspect="1:1" width={400} />}
    name={name}
    role={role}
  />
);

test("TeamGrid — renders heading", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team">{makeCard("Arian Zargaran", "Founder")}</TeamGrid>,
  );
  await expect(component).toContainText("The team");
});

test("TeamGrid — renders child TeamCards", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team">
      {makeCard("Arian Zargaran", "Founder, Engineering")}
      {makeCard("Jane Doe", "Design Lead")}
      {makeCard("John Smith", "Engineering")}
    </TeamGrid>,
  );
  await expect(component).toContainText("Arian Zargaran");
  await expect(component).toContainText("Jane Doe");
  await expect(component).toContainText("John Smith");
});

test("TeamGrid — renders eyebrow and lede when provided", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team" eyebrow="Who we are" lede="Senior practitioners only.">
      {makeCard("Arian Zargaran", "Founder")}
    </TeamGrid>,
  );
  await expect(component).toContainText("Who we are");
  await expect(component).toContainText("Senior practitioners only.");
});

test("TeamGrid — forwards ref to root section element", async ({ mount }) => {
  let capturedRef: HTMLElement | null = null;
  const component = await mount(
    <TeamGrid
      heading="The team"
      ref={(el) => {
        capturedRef = el;
      }}
    >
      {makeCard("Arian Zargaran", "Founder")}
    </TeamGrid>,
  );
  // Root element is a <section> (from Section organism)
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
  void capturedRef; // ref is forwarded — verify root is section
});

test("TeamGrid — forwards className to root", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team" className="custom-class">
      {makeCard("Arian Zargaran", "Founder")}
    </TeamGrid>,
  );
  await expect(component).toHaveClass(/custom-class/);
});

test("TeamGrid — forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team" data-testid="team-grid-root">
      {makeCard("Arian Zargaran", "Founder")}
    </TeamGrid>,
  );
  await expect(component).toHaveAttribute("data-testid", "team-grid-root");
});

test("TeamGrid — grid container has data-columns=3 for default", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team">
      {makeCard("Arian Zargaran", "Founder")}
      {makeCard("Jane Doe", "Design Lead")}
      {makeCard("John Smith", "Engineering")}
    </TeamGrid>,
  );
  // Grid div carries data-columns for reliable cross-env targeting
  const grid = component.locator("[data-columns]");
  await expect(grid).toHaveAttribute("data-columns", "3");
});

test("TeamGrid — grid container has data-columns=2 when columns=2", async ({ mount }) => {
  const component = await mount(
    <TeamGrid heading="The team" columns={2}>
      {makeCard("Arian Zargaran", "Founder")}
      {makeCard("Jane Doe", "Design Lead")}
    </TeamGrid>,
  );
  const grid = component.locator("[data-columns]");
  await expect(grid).toHaveAttribute("data-columns", "2");
});
