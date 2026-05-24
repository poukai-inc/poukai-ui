import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { TableOfContents } from "./TableOfContents";

const ITEMS = [
  { id: "intro", label: "Introduction" },
  { id: "approach", label: "Approach" },
  { id: "results", label: "Results" },
];

const ITEMS_WITH_DEPTH = [
  { id: "intro", label: "Introduction" },
  { id: "approach", label: "Approach" },
  { id: "methodology", label: "Methodology", depth: 2 as const },
  { id: "results", label: "Results" },
];

/* ---------- Root element ---------- */

test("root element is <nav>", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

test("root has aria-label='Table of contents'", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  await expect(component).toHaveAttribute("aria-label", "Table of contents");
});

/* ---------- Items render ---------- */

test("renders a <ul> inside nav", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const ul = component.locator("ul");
  await expect(ul).toHaveCount(1);
});

test("renders one <li> per item", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const lis = component.locator("li");
  await expect(lis).toHaveCount(3);
});

test("renders anchor links with correct hrefs", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const links = component.locator("a");
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute("href", "#intro");
  await expect(links.nth(1)).toHaveAttribute("href", "#approach");
  await expect(links.nth(2)).toHaveAttribute("href", "#results");
});

test("renders item labels as link text", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const links = component.locator("a");
  await expect(links.nth(0)).toContainText("Introduction");
  await expect(links.nth(1)).toContainText("Approach");
  await expect(links.nth(2)).toContainText("Results");
});

/* ---------- Optional heading ---------- */

test("does not render heading element when heading prop is omitted", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const p = component.locator("p");
  await expect(p).toHaveCount(0);
});

test("renders heading <p> when heading prop is provided", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} heading="On this page" />);
  const p = component.locator("p");
  await expect(p).toHaveCount(1);
  await expect(p).toContainText("On this page");
});

/* ---------- Controlled activeId ---------- */

test("controlled activeId sets aria-current on the active anchor", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} activeId="approach" />);
  const activeLink = component.locator("[aria-current='true']");
  await expect(activeLink).toHaveCount(1);
  await expect(activeLink).toContainText("Approach");
});

test("controlled activeId: non-active items do not have aria-current", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} activeId="intro" />);
  const allLinks = component.locator("a");
  // Only intro should have aria-current
  await expect(component.locator("[aria-current='true']")).toHaveCount(1);
  await expect(allLinks.nth(1)).not.toHaveAttribute("aria-current");
  await expect(allLinks.nth(2)).not.toHaveAttribute("aria-current");
});

test("when no activeId, no anchor has aria-current", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  await expect(component.locator("[aria-current]")).toHaveCount(0);
});

/* ---------- depth=2 sub-items ---------- */

test("depth=2 item renders in the list", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS_WITH_DEPTH} />);
  const links = component.locator("a");
  await expect(links).toHaveCount(4);
  await expect(links.nth(2)).toContainText("Methodology");
  await expect(links.nth(2)).toHaveAttribute("href", "#methodology");
});

/* ---------- className / data-* / ref forwarding ---------- */

test("merges consumer className onto root", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} className="my-toc" />);
  const className = await component.getAttribute("class");
  expect(className).toMatch(/my-toc/);
});

test("forwards data-testid to root element", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} data-testid="toc-root" />);
  await expect(component).toHaveAttribute("data-testid", "toc-root");
});

test("ref is forwarded to the root <nav>", async ({ mount }) => {
  const component = await mount(<TableOfContents items={ITEMS} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("nav");
});

/* ---------- Scroll / IntersectionObserver active-section ---------- */

test("IntersectionObserver sets active item on scroll", async ({ mount, page }) => {
  // Mount a full-document harness with real heading elements and a scrollable container.
  await mount(
    <div style={{ height: "100vh", overflowY: "auto" }} id="scroll-root">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
        <article>
          <section id="s-intro" style={{ height: "200vh", paddingTop: "40px" }}>
            <h2>Introduction</h2>
          </section>
          <section id="s-approach" style={{ height: "200vh", paddingTop: "40px" }}>
            <h2>Approach</h2>
          </section>
          <section id="s-results" style={{ height: "200vh", paddingTop: "40px" }}>
            <h2>Results</h2>
          </section>
        </article>
        <aside>
          <TableOfContents
            items={[
              { id: "s-intro", label: "Introduction" },
              { id: "s-approach", label: "Approach" },
              { id: "s-results", label: "Results" },
            ]}
          />
        </aside>
      </div>
    </div>,
  );

  // Scroll "s-approach" into view so it becomes the active section.
  await page.evaluate(() => {
    const el = document.getElementById("s-approach");
    if (el) el.scrollIntoView();
  });

  // Give the IntersectionObserver a tick to fire.
  await page.waitForTimeout(200);

  // The "Approach" anchor should now carry aria-current="true".
  const activeLink = page.locator("[aria-current='true']");
  await expect(activeLink).toHaveCount(1);
  await expect(activeLink).toContainText("Approach");
});

/* ---------- a11y ---------- */

test("a11y — default (no heading, no active)", async ({ mount, page }) => {
  await mount(<TableOfContents items={ITEMS} />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with heading and activeId", async ({ mount, page }) => {
  await mount(<TableOfContents heading="On this page" items={ITEMS} activeId="approach" />);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with depth-2 items", async ({ mount, page }) => {
  await mount(
    <TableOfContents heading="Contents" items={ITEMS_WITH_DEPTH} activeId="methodology" />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
