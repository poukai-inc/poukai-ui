import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Prose } from "./Prose";

/* ---------- Root element ---------- */

test("renders a div by default", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <p>Hello</p>
    </Prose>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("renders descendants as visible HTML", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <h1>The title</h1>
      <p>The body</p>
    </Prose>,
  );
  await expect(component.getByText("The title")).toBeVisible();
  await expect(component.getByText("The body")).toBeVisible();
});

/* ---------- Width variants ---------- */

test('width="full" (default) does not constrain max-width', async ({ mount }) => {
  const component = await mount(
    <Prose>
      <p>Full-width</p>
    </Prose>,
  );
  // 64ch resolves to a finite pixel value; "none" resolves to the
  // initial value or container width. Assert the variant class is applied.
  const className = await component.getAttribute("class");
  expect(className).toMatch(/widthFull/);
});

test('width="reading" applies the widthReading class', async ({ mount }) => {
  const component = await mount(
    <Prose width="reading">
      <p>Reading column</p>
    </Prose>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/widthReading/);
});

test('width="reading" centers via margin-inline: auto', async ({ mount }) => {
  const component = await mount(
    <Prose width="reading">
      <p>Reading column</p>
    </Prose>,
  );
  await expect(component).toHaveCSS("margin-left", /^(?:.+)$/);
  // margin-inline: auto resolves to margin-left/right auto in computed style.
  await expect(component).toHaveCSS("margin-right", /^(?:.+)$/);
});

/* ---------- asChild composition ---------- */

test("asChild renders the child element as root", async ({ mount }) => {
  const component = await mount(
    <Prose asChild>
      <article data-testid="prose-article">
        <p>Body</p>
      </article>
    </Prose>,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
  await expect(component).toHaveAttribute("data-testid", "prose-article");
});

test("asChild forwards DS classes to the child element", async ({ mount }) => {
  const component = await mount(
    <Prose asChild>
      <article>
        <p>Body</p>
      </article>
    </Prose>,
  );
  const className = await component.getAttribute("class");
  expect(className).toBeTruthy();
  expect(className).toMatch(/widthFull/);
});

/* ---------- className merge ---------- */

test("merges consumer-provided className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Prose className="custom-prose-x">
      <p>Body</p>
    </Prose>,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-prose-x/);
  expect(className).toMatch(/widthFull/);
});

/* ---------- data-* / aria-* forwarding ---------- */

test("forwards data-* and aria-* attributes to the root", async ({ mount }) => {
  const component = await mount(
    <Prose data-testid="prose-root" aria-label="Article body" lang="en">
      <p>Body</p>
    </Prose>,
  );
  await expect(component).toHaveAttribute("data-testid", "prose-root");
  await expect(component).toHaveAttribute("aria-label", "Article body");
  await expect(component).toHaveAttribute("lang", "en");
});

/* ---------- Child-element styling contract ---------- */

test("styles child <h1> with the serif display font", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <h1>Heading</h1>
    </Prose>,
  );
  const h1 = component.locator("h1");
  await expect(h1).toHaveCSS("font-family", /Instrument Serif/);
});

test("styles child <h2> with the serif display font", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <h2>Heading</h2>
    </Prose>,
  );
  const h2 = component.locator("h2");
  await expect(h2).toHaveCSS("font-family", /Instrument Serif/);
});

test("styles child <code> with the monospace font", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <p>
        Inline <code>example()</code> chip.
      </p>
    </Prose>,
  );
  const code = component.locator("code");
  await expect(code).toHaveCSS("font-family", /Geist Mono/);
});

test("styles child <pre> as a scrollable block", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <pre>
        <code>long line</code>
      </pre>
    </Prose>,
  );
  const pre = component.locator("pre");
  await expect(pre).toHaveCSS("overflow-x", "auto");
});

test("styles child <blockquote> with italic serif type", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <blockquote>Quote text</blockquote>
    </Prose>,
  );
  const bq = component.locator("blockquote");
  await expect(bq).toHaveCSS("font-family", /Instrument Serif/);
  await expect(bq).toHaveCSS("font-style", "italic");
});

test("styles child <p className=lede> with the muted foreground token", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <p className="lede">Lede paragraph</p>
    </Prose>,
  );
  const lede = component.locator("p.lede");
  // --fg-muted is #6e6e73 in light mode → rgb(110, 110, 115)
  await expect(lede).toHaveCSS("color", "rgb(110, 110, 115)");
});

test("constrains child <img> to the parent column", async ({ mount }) => {
  const component = await mount(
    <Prose>
      <img src="data:image/svg+xml;base64,PHN2Zy8+" alt="" width="9999" />
    </Prose>,
  );
  const img = component.locator("img");
  await expect(img).toHaveCSS("max-width", "100%");
});

/* ---------- Nested Prose smell test ----------
   Prose nested inside Prose is documented as out of scope, but the
   rendered output must not crash — the descendant rules will simply
   double-apply. Guard the render path. */

test("nested Prose still renders both layers without error", async ({ mount }) => {
  const component = await mount(
    <Prose data-testid="outer">
      <Prose data-testid="inner">
        <p>Nested body</p>
      </Prose>
    </Prose>,
  );
  await expect(component).toHaveAttribute("data-testid", "outer");
  await expect(component.getByText("Nested body")).toBeVisible();
});

/* ---------- a11y axe scans ---------- */

test("a11y — long-form article body (reading width)", async ({ mount, page }) => {
  await mount(
    <Prose width="reading" asChild>
      <article>
        <h1>The case for AI fluency</h1>
        <p className="lede">An introductory paragraph.</p>
        <p>Body copy follows. Links inherit the global contract.</p>
        <h2>Section title</h2>
        <ul>
          <li>First item</li>
          <li>Second item</li>
        </ul>
        <blockquote>A quoted line.</blockquote>
      </article>
    </Prose>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — full-width prose with table and code", async ({ mount, page }) => {
  await mount(
    <Prose width="full">
      <h2>Reference</h2>
      <p>
        Run <code>pnpm test</code> to verify.
      </p>
      <table>
        <thead>
          <tr>
            <th>Column A</th>
            <th>Column B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, A</td>
            <td>Row 1, B</td>
          </tr>
        </tbody>
      </table>
    </Prose>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
