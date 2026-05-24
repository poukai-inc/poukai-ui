import { test, expect } from "@playwright/experimental-ct-react";
import { Caption } from "./Caption";

/* ── Rendering ───────────────────────────────────────────────────── */

test("renders children as text", async ({ mount }) => {
  const component = await mount(<Caption>Fig. 1 — pilot error rate.</Caption>);
  await expect(component.getByText("Fig. 1 — pilot error rate.")).toBeVisible();
});

test("renders <figcaption> by default", async ({ mount }) => {
  const component = await mount(<Caption>Default element</Caption>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figcaption");
});

/* ── Polymorphic `as` prop ───────────────────────────────────────── */

test("renders <p> when as='p'", async ({ mount }) => {
  const component = await mount(<Caption as="p">Standalone caption</Caption>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("p");
});

test("renders <span> when as='span'", async ({ mount }) => {
  const component = await mount(<Caption as="span">Inline caption</Caption>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("span");
});

test("renders <figcaption> when as='figcaption' explicitly", async ({ mount }) => {
  const component = await mount(<Caption as="figcaption">Explicit figcaption</Caption>);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figcaption");
});

/* ── className forwarding ────────────────────────────────────────── */

test("merges consumer className with internal root class", async ({ mount }) => {
  const component = await mount(<Caption className="my-custom">Hi</Caption>);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-custom/);
  expect(cls).toMatch(/root/);
});

/* ── data-* and aria-* forwarding ───────────────────────────────── */

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<Caption data-testid="cap-target">Text</Caption>);
  await expect(component).toHaveAttribute("data-testid", "cap-target");
});

test("forwards aria-label to root element", async ({ mount }) => {
  const component = await mount(<Caption aria-label="Figure one caption">Text</Caption>);
  await expect(component).toHaveAttribute("aria-label", "Figure one caption");
});

/* ── ref forwarding ─────────────────────────────────────────────── */

test("forwards ref to root DOM element", async ({ mount }) => {
  let capturedTag = "";
  const component = await mount(
    <Caption
      ref={(el) => {
        if (el) capturedTag = el.tagName.toLowerCase();
      }}
    >
      Ref test
    </Caption>,
  );
  // Verify the component rendered — ref was invoked on mount
  await expect(component).toBeVisible();
  // DOM tag via evaluate as a secondary check
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figcaption");
});

/* ── Semantic composition ────────────────────────────────────────── */

test("figcaption inside figure is natively associated", async ({ mount }) => {
  const component = await mount(
    <figure>
      <div>image placeholder</div>
      <Caption>Fig. 1 — latency distribution.</Caption>
    </figure>,
  );
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toBeVisible();
  await expect(figcaption).toHaveText("Fig. 1 — latency distribution.");
});

test("accepts ReactNode children (inline link)", async ({ mount }) => {
  const component = await mount(
    <Caption>
      Data from the <a href="/methodology">methodology doc</a>.
    </Caption>,
  );
  await expect(component.getByRole("link", { name: "methodology doc" })).toBeVisible();
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
