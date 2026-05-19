import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";
import { Quote } from "./Quote";

/* ---------- Quote body ---------- */

test("renders quote body text", async ({ mount }) => {
  const component = await mount(
    <Quote
      quote="We went from weeks to hours."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
    />,
  );
  await expect(component.getByText("We went from weeks to hours.")).toBeVisible();
});

/* ---------- Name ---------- */

test("renders name in attribution row", async ({ mount }) => {
  const component = await mount(
    <Quote quote="The accuracy improvements were immediate." name="James Okonkwo" />,
  );
  await expect(component.getByText("James Okonkwo")).toBeVisible();
});

/* ---------- Role slot ---------- */

test("renders role when provided", async ({ mount }) => {
  const component = await mount(
    <Quote quote="Quote body." name="James Okonkwo" role="Head of Data, Fieldwork AI" />,
  );
  await expect(component.getByText("Head of Data, Fieldwork AI")).toBeVisible();
});

test("omits role element when role is undefined", async ({ mount }) => {
  const component = await mount(<Quote quote="Quote body." name="Priya Mehta" />);
  // nameRole column has exactly one <p> (the name), not two
  const paragraphs = component.locator("p");
  await expect(paragraphs).toHaveCount(1);
});

/* ---------- Avatar slot ---------- */

test("renders avatar slot when avatar is provided", async ({ mount }) => {
  const component = await mount(
    <Quote
      quote="Quote body."
      name="Dana Kim"
      avatar={<img src="https://picsum.photos/seed/dk/40/40" alt="" width={40} height={40} />}
    />,
  );
  await expect(component.locator("img")).toBeVisible();
});

test("omits avatar wrapper when avatar is undefined", async ({ mount }) => {
  const component = await mount(<Quote quote="Quote body." name="Tomás Rivera" />);
  // No img, no avatarSlot div — only the nameRole div and its children
  await expect(component.locator("img")).toHaveCount(0);
});

/* ---------- HTML structure ---------- */

test("root element is <figure>", async ({ mount }) => {
  const component = await mount(<Quote quote="Quote body." name="Sarah Chen" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

test("inner <blockquote> is present", async ({ mount }) => {
  const component = await mount(<Quote quote="Quote body." name="Sarah Chen" />);
  const blockquote = component.locator("blockquote");
  await expect(blockquote).toHaveCount(1);
  await expect(blockquote).toBeVisible();
});

test("inner <figcaption> is present", async ({ mount }) => {
  const component = await mount(<Quote quote="Quote body." name="Sarah Chen" />);
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toHaveCount(1);
  await expect(figcaption).toBeVisible();
});

test("quote body renders inside <blockquote>", async ({ mount }) => {
  const component = await mount(<Quote quote="Exact body text." name="Sarah Chen" />);
  const blockquote = component.locator("blockquote");
  await expect(blockquote).toContainText("Exact body text.");
});

test("name and role render inside <figcaption>", async ({ mount }) => {
  const component = await mount(
    <Quote quote="Quote body." name="Sarah Chen" role="VP Engineering, Meridian Labs" />,
  );
  const figcaption = component.locator("figcaption");
  await expect(figcaption).toContainText("Sarah Chen");
  await expect(figcaption).toContainText("VP Engineering, Meridian Labs");
});

/* ---------- className merge ---------- */

test("merges consumer className with internal classes", async ({ mount }) => {
  const component = await mount(
    <Quote quote="Quote body." name="Sarah Chen" className="custom-quote-class" />,
  );
  const className = await component.getAttribute("class");
  expect(className).toMatch(/custom-quote-class/);
});

/* ---------- Arbitrary-prop forwarding ---------- */

test("forwards data-testid to root <figure> element", async ({ mount }) => {
  const component = await mount(
    <Quote quote="Quote body." name="Sarah Chen" data-testid="quote-root" />,
  );
  await expect(component).toHaveAttribute("data-testid", "quote-root");
});

test("forwards aria-label to root <figure> element", async ({ mount }) => {
  const component = await mount(
    <Quote quote="Quote body." name="Sarah Chen" aria-label="Customer testimonial" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Customer testimonial");
});

/* ---------- Ref forwarding ---------- */

test("ref is forwarded to the <figure> root element", async ({ mount }) => {
  const component = await mount(
    <Quote
      quote="Quote body."
      name="Sarah Chen"
      ref={(el) => {
        // ref callback fires — if el is non-null it is the figure element
        if (el) {
          void el.tagName; // exercise the ref
        }
      }}
    />,
  );
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("figure");
});

/* ---------- Inline ReactNode in quote ---------- */

test("renders inline <em> inside quote body", async ({ mount }) => {
  const component = await mount(
    <Quote
      quote={
        <>
          We went from <em>weeks</em> to hours.
        </>
      }
      name="Sarah Chen"
    />,
  );
  const em = component.locator("em");
  await expect(em).toHaveCount(1);
  await expect(em).toHaveText("weeks");
});

/* ---------- a11y ---------- */

test("a11y — full Quote (quote, name, role, avatar img)", async ({ mount, page }) => {
  await mount(
    <Quote
      quote="We went from weeks to hours. The tooling handled what we used to staff an entire team for."
      name="Sarah Chen"
      role="VP Engineering, Meridian Labs"
      avatar={
        <img
          src="https://picsum.photos/seed/sarah-a11y/40/40"
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%", display: "block" }}
        />
      }
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Quote without avatar", async ({ mount, page }) => {
  await mount(
    <Quote
      quote="The accuracy improvements were immediate and measurable. We rolled it out to the full team within a week."
      name="James Okonkwo"
      role="Head of Data, Fieldwork AI"
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Quote name only (no role, no avatar)", async ({ mount, page }) => {
  await mount(
    <Quote quote="The feedback loop closed in days, not quarters." name="Tomás Rivera" />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("a11y — Quote with initials avatar (div, no img)", async ({ mount, page }) => {
  await mount(
    <Quote
      quote="Exactly what we needed. Nothing we didn't."
      name="Priya Mehta"
      role="Engineering Lead"
      avatar={
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#f5f5f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            color: "#6e6e73",
          }}
        >
          PM
        </div>
      }
    />,
  );
  const { violations } = await new AxeBuilder({ page })
    .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
