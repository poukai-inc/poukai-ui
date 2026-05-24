import { test, expect } from "@playwright/experimental-ct-react";
import { HeroSection } from "./HeroSection";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";
import { Portrait } from "../../molecules/Portrait";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  title: "Technical consulting for teams.",
  lede: "Close the gap between pilot and production.",
};

// ---------------------------------------------------------------------------
// Rendering: Section + Hero composition
// ---------------------------------------------------------------------------

test("renders a section landmark", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  await expect(component.locator("section")).toBeVisible();
});

test("renders the title as an h1", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  const h1 = component.locator("h1");
  await expect(h1).toBeVisible();
  await expect(h1).toContainText("Technical consulting for teams.");
});

test("renders lede text", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  await expect(component.locator(".lede, [class*='lede']").first()).toContainText(
    "Close the gap between pilot and production.",
  );
});

test("renders status slot when provided", async ({ mount }) => {
  const component = await mount(
    <HeroSection
      {...defaultProps}
      status={<StatusBadge status="available">Taking conversations for Q3.</StatusBadge>}
    />,
  );
  await expect(component.getByText("Taking conversations for Q3.")).toBeVisible();
});

test("does not render status slot when omitted", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  await expect(component.locator("[data-status]")).toHaveCount(0);
});

test("renders CTA slot when provided", async ({ mount }) => {
  const component = await mount(
    <HeroSection
      {...defaultProps}
      cta={
        <Button asChild>
          <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
        </Button>
      }
    />,
  );
  await expect(component.getByText("hello@pouk.ai")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Rendering: media slot
// ---------------------------------------------------------------------------

test("renders media slot when provided", async ({ mount }) => {
  const component = await mount(
    <HeroSection
      {...defaultProps}
      media={
        <Portrait
          src="https://picsum.photos/seed/hs-test/900/1200"
          alt="Test portrait"
          aspect="3:4"
          width={900}
        />
      }
    />,
  );
  const img = component.locator("img");
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute("alt", "Test portrait");
});

test("does not render media column when media is omitted", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  // No img element should be present
  await expect(component.locator("img")).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Layout: two-column vs stacked class assertions
// ---------------------------------------------------------------------------

test("applies grid class when media is present", async ({ mount }) => {
  const component = await mount(
    <HeroSection
      {...defaultProps}
      media={
        <Portrait
          src="https://picsum.photos/seed/hs-grid/900/1200"
          alt="Grid test portrait"
          aspect="3:4"
          width={900}
        />
      }
    />,
  );
  // The grid wrapper should exist when media is provided
  const grid = component.locator("[class*='grid']");
  await expect(grid).toBeVisible();
});

test("does not render grid wrapper when media is absent", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  // textColSolo is used when no media — grid class absent
  await expect(component.locator("[class*='grid']")).toHaveCount(0);
});

test("media column follows text column in DOM order", async ({ mount }) => {
  const component = await mount(
    <HeroSection {...defaultProps} media={<div data-testid="media-slot">Media</div>} />,
  );
  // h1 should appear before the media slot in the DOM
  const h1 = component.locator("h1");
  const media = component.locator("[data-testid='media-slot']");
  await expect(h1).toBeVisible();
  await expect(media).toBeVisible();
  // Verify DOM order by checking that h1 comes before media via evaluate
  const order = await component.evaluate((el) => {
    const h1El = el.querySelector("h1");
    const mediaEl = el.querySelector("[data-testid='media-slot']");
    if (!h1El || !mediaEl) return null;
    return h1El.compareDocumentPosition(mediaEl) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "h1-before-media"
      : "media-before-h1";
  });
  expect(order).toBe("h1-before-media");
});

// ---------------------------------------------------------------------------
// sectionSize variants
// ---------------------------------------------------------------------------

test("applies sectionSizeTight class when sectionSize=tight", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} sectionSize="tight" />);
  await expect(component).toHaveClass(/sectionSizeTight/);
});

test("does not apply sectionSizeTight class when sectionSize=default", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} sectionSize="default" />);
  await expect(component).not.toHaveClass(/sectionSizeTight/);
});

// ---------------------------------------------------------------------------
// Polymorphic `as` prop
// ---------------------------------------------------------------------------

test("renders as article when as=article", async ({ mount }) => {
  const component = await mount(<HeroSection as="article" {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("renders as div when as=div", async ({ mount }) => {
  const component = await mount(<HeroSection as="div" {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

// ---------------------------------------------------------------------------
// aria-labelledby wiring
// ---------------------------------------------------------------------------

test("section landmark has aria-labelledby pointing at text column", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  // The referenced element should exist and contain the title
  const labeled = component.locator(`#${CSS.escape(labelledById!)}`);
  await expect(labeled).toBeVisible();
  await expect(labeled).toContainText("Technical consulting for teams.");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} className="custom-hero-section" />);
  await expect(component).toHaveClass(/custom-hero-section/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<HeroSection {...defaultProps} data-testid="hs-root" />);
  await expect(component).toHaveAttribute("data-testid", "hs-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(<HeroSection as="div" {...defaultProps} aria-label="Page hero" />);
  await expect(component).toHaveAttribute("aria-label", "Page hero");
});
