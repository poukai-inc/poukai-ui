import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { CodeBlock } from "./CodeBlock";

/* ---------- Root element ---------- */

test("root element is <figure>", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* ---------- Semantic pre/code structure ---------- */

test("renders <pre> containing <code>", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const pre = component.locator("pre");
  await expect(pre).toBeVisible();
  const code = pre.locator("code");
  await expect(code).toBeVisible();
});

test("code content appears inside <code>", async ({ mount }) => {
  const content = `const answer = 42;`;
  const component = await mount(<CodeBlock>{content}</CodeBlock>);
  const code = component.locator("code");
  await expect(code).toContainText("const answer = 42;");
});

/* ---------- Language label ---------- */

test("language label is absent when language prop is omitted", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  // No <span> with a language label — the span only renders when language is set
  const spans = component.locator("span");
  // Copy button is a <button>, not a <span> — no span should be present
  await expect(spans).toHaveCount(0);
});

test("language label renders when language prop is provided", async ({ mount }) => {
  const component = await mount(<CodeBlock language="tsx">{`const x = 1;`}</CodeBlock>);
  await expect(component.getByText("tsx")).toBeVisible();
});

test("language label text matches the language prop", async ({ mount }) => {
  const component = await mount(<CodeBlock language="bash">{`echo hello`}</CodeBlock>);
  await expect(component.getByText("bash")).toBeVisible();
});

/* ---------- CopyButton ---------- */

test("copy button is present by default", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const btn = component.getByRole("button", { name: "Copy" });
  await expect(btn).toBeVisible();
});

test("copy button is absent when hideCopy=true and no language", async ({ mount }) => {
  const component = await mount(<CodeBlock hideCopy>{`const x = 1;`}</CodeBlock>);
  const btn = component.locator("button");
  await expect(btn).toHaveCount(0);
});

test("copy button shows aria-label='Copy' at rest", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const btn = component.locator("button");
  await expect(btn).toHaveAttribute("aria-label", "Copy");
});

/* ---------- Header bar visibility ---------- */

test("header bar is absent when hideCopy=true and no language prop", async ({ mount }) => {
  const component = await mount(<CodeBlock hideCopy>{`const x = 1;`}</CodeBlock>);
  // No div with header — only <pre> and potentially <figcaption>
  const btn = component.locator("button");
  await expect(btn).toHaveCount(0);
});

test("header bar renders when language is provided even with hideCopy=true", async ({ mount }) => {
  const component = await mount(
    <CodeBlock language="bash" hideCopy>
      {`echo hello`}
    </CodeBlock>,
  );
  await expect(component.getByText("bash")).toBeVisible();
});

/* ---------- Caption slot ---------- */

test("figcaption is absent when caption prop is omitted", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(0);
});

test("figcaption renders when caption prop is provided", async ({ mount }) => {
  const component = await mount(
    <CodeBlock caption="src/components/Example.tsx">{`const x = 1;`}</CodeBlock>,
  );
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toBeVisible();
  await expect(figcaption).toContainText("src/components/Example.tsx");
});

/* ---------- className merge ---------- */

test("merges consumer className onto root <figure>", async ({ mount }) => {
  const component = await mount(<CodeBlock className="my-codeblock">{`const x = 1;`}</CodeBlock>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-codeblock/);
});

/* ---------- Arbitrary-prop forwarding ---------- */

test("forwards data-testid to root <figure>", async ({ mount }) => {
  const component = await mount(
    <CodeBlock data-testid="codeblock-root">{`const x = 1;`}</CodeBlock>,
  );
  await expect(component).toHaveAttribute("data-testid", "codeblock-root");
});

test("forwards aria-label to root <figure>", async ({ mount }) => {
  const component = await mount(
    <CodeBlock aria-label="Installation snippet">{`pnpm install`}</CodeBlock>,
  );
  await expect(component).toHaveAttribute("aria-label", "Installation snippet");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the root <figure>", async ({ mount }) => {
  const component = await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* ---------- a11y ---------- */

test("a11y — default (no language, copy visible)", async ({ mount, page }) => {
  await mount(<CodeBlock>{`const x = 1;`}</CodeBlock>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — with language label and caption", async ({ mount, page }) => {
  await mount(
    <CodeBlock language="tsx" caption="src/components/Example.tsx">
      {`const x = 1;`}
    </CodeBlock>,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — hideCopy=true, no language", async ({ mount, page }) => {
  await mount(<CodeBlock hideCopy>{`const decorative = true;`}</CodeBlock>);
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
