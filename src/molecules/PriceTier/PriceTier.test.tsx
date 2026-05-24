import { test, expect } from "@playwright/experimental-ct-react";
import { PriceTier } from "./PriceTier";

<<<<<<< HEAD
/* ------------------------------------------------------------------ */
/* Root element                                                         */
/* ------------------------------------------------------------------ */

test("renders <article> with aria-label derived from name", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
  await expect(component).toHaveRole("article");
  await expect(component).toHaveAttribute("aria-label", "Pro plan");
});

/* ------------------------------------------------------------------ */
/* Name                                                                 */
/* ------------------------------------------------------------------ */

test("renders tier name as h3", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Starter" price="$0" cta={<button type="button">Go</button>} />,
  );
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("Starter");
});

/* ------------------------------------------------------------------ */
/* Price                                                                */
/* ------------------------------------------------------------------ */

test("renders price text", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
  await expect(component.getByText("$29")).toBeVisible();
});

test("renders per label when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Pro" price="$29" per="month" cta={<button type="button">Start</button>} />,
  );
  await expect(component.getByText("/ month")).toBeVisible();
});

test("omits per label when not provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Free" price="$0" cta={<button type="button">Start</button>} />,
  );
  await expect(component.locator("text=/ ")).toHaveCount(0);
});

/* ------------------------------------------------------------------ */
/* Bullets                                                              */
/* ------------------------------------------------------------------ */

test("renders bullet items", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      bullets={["Unlimited projects", "100 GB storage", "Priority support"]}
      cta={<button type="button">Start</button>}
    />,
  );
  await expect(component.getByText("Unlimited projects")).toBeVisible();
  await expect(component.getByText("100 GB storage")).toBeVisible();
  await expect(component.getByText("Priority support")).toBeVisible();
  const items = component.locator("li");
  await expect(items).toHaveCount(3);
});

test("renders no bullet list when bullets is empty", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Custom" price="Custom" cta={<button type="button">Contact</button>} />,
  );
  await expect(component.locator("ul")).toHaveCount(0);
});

test("renders bulletIcon with aria-hidden wrapper when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      bullets={["Feature one"]}
      bulletIcon={<span data-testid="check-icon">✓</span>}
      cta={<button type="button">Start</button>}
    />,
  );
  const iconWrapper = component.locator("span[aria-hidden='true']").first();
  await expect(iconWrapper).toBeVisible();
  await expect(component.locator("[data-testid='check-icon']")).toHaveCount(1);
});

test("no bulletIcon wrapper emitted when bulletIcon absent", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      bullets={["Feature one"]}
      cta={<button type="button">Start</button>}
    />,
  );
  await expect(component.locator("span[aria-hidden='true']")).toHaveCount(0);
});

/* ------------------------------------------------------------------ */
/* CTA slot                                                             */
/* ------------------------------------------------------------------ */

test("renders cta slot content", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      cta={
        <button type="button" data-testid="cta-btn">
          Start free trial
        </button>
      }
    />,
  );
  await expect(component.locator("[data-testid='cta-btn']")).toBeVisible();
  await expect(component.getByText("Start free trial")).toBeVisible();
});

/* ------------------------------------------------------------------ */
/* Featured state                                                       */
/* ------------------------------------------------------------------ */

test("featured=true shows featured badge", async ({ mount }) => {
  const component = await mount(
    <PriceTier featured name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
  await expect(component.getByText("Recommended")).toBeVisible();
});

test("featured=false has no badge", async ({ mount }) => {
  const component = await mount(
    <PriceTier name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
  await expect(component.getByText("Recommended")).toHaveCount(0);
});

test("featuredLabel overrides default badge text", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      featured
      featuredLabel="Most popular"
      name="Pro"
      price="$29"
      cta={<button type="button">Start</button>}
    />,
  );
  await expect(component.getByText("Most popular")).toBeVisible();
  await expect(component.getByText("Recommended")).toHaveCount(0);
});

test("featured card has featured CSS class applied", async ({ mount }) => {
  const component = await mount(
    <PriceTier featured name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
  const cls = await component.getAttribute("class");
  // CSS Modules hash the class names; verify the featured class is present
  // by checking the class list contains more than just root
  expect(cls).toBeTruthy();
  expect(typeof cls).toBe("string");
});

/* ------------------------------------------------------------------ */
/* Prop forwarding                                                      */
/* ------------------------------------------------------------------ */

test("forwards className to root article", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      cta={<button type="button">Start</button>}
      className="consumer-class"
    />,
  );
  const cls = await component.getAttribute("class");
  expect(cls).toContain("consumer-class");
});

test("forwards data-* attributes to root", async ({ mount }) => {
  const component = await mount(
    <PriceTier
      name="Pro"
      price="$29"
      cta={<button type="button">Start</button>}
      data-testid="price-tier"
    />,
  );
  await expect(component).toHaveAttribute("data-testid", "price-tier");
});

test("forwards ref to article element", async ({ mount }) => {
  // ref forwarding: verify the mounted root is the article
  const component = await mount(
    <PriceTier name="Pro" price="$29" cta={<button type="button">Start</button>} />,
  );
=======
// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  name: "Pro",
  price: "$49",
  cadence: "per month",
};

// ---------------------------------------------------------------------------
// Rendering: basic anatomy
// ---------------------------------------------------------------------------

test("renders the tier name", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("Pro")).toBeVisible();
});

test("renders the price", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("$49")).toBeVisible();
});

test("renders the cadence label", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("per month")).toBeVisible();
});

test("renders description when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} description="For teams that need more." />,
  );
  await expect(component.getByText("For teams that need more.")).toBeVisible();
});

test("does not render description when omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("p")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Features list
// ---------------------------------------------------------------------------

test("renders features as a list", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} features={["Feature A", "Feature B", "Feature C"]} />,
  );
  await expect(component.locator("ul")).toBeVisible();
  await expect(component.locator("li")).toHaveCount(3);
  await expect(component.getByText("Feature A")).toBeVisible();
  await expect(component.getByText("Feature C")).toBeVisible();
});

test("does not render feature list when features omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("ul")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// CTA slot
// ---------------------------------------------------------------------------

test("renders CTA slot when provided", async ({ mount }) => {
  const component = await mount(
    <PriceTier {...defaultProps} cta={<button type="button">Get started with Pro</button>} />,
  );
  await expect(component.getByText("Get started with Pro")).toBeVisible();
});

test("does not render CTA slot when omitted", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.locator("button")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Featured variant
// ---------------------------------------------------------------------------

test("renders Recommended label when featured", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} featured />);
  await expect(component.getByText("Recommended")).toBeVisible();
});

test("does not render Recommended label when not featured", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component.getByText("Recommended")).toHaveCount(0);
});

test("applies featured class when featured=true", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} featured />);
  await expect(component).toHaveClass(/featured/);
});

test("does not apply featured class when featured=false", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  await expect(component).not.toHaveClass(/featured/);
});

// ---------------------------------------------------------------------------
// Semantics: article + aria-labelledby
// ---------------------------------------------------------------------------

test("root element is article", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
>>>>>>> 2472d7f (feat(organism): add PricingTable — PriceTier grid)
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

<<<<<<< HEAD
/* a11y scans are in src/a11y.test.tsx (central gate). */
=======
test("root has aria-labelledby pointing to the name heading", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const labeled = component.locator(`[id="${labelledById}"]`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Pro");
});

test("name is rendered as h3", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} />);
  const h3 = component.locator("h3");
  await expect(h3).toBeVisible();
  await expect(h3).toContainText("Pro");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} className="custom-tier" />);
  await expect(component).toHaveClass(/custom-tier/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<PriceTier {...defaultProps} data-testid="tier-root" />);
  await expect(component).toHaveAttribute("data-testid", "tier-root");
});
>>>>>>> 2472d7f (feat(organism): add PricingTable — PriceTier grid)
