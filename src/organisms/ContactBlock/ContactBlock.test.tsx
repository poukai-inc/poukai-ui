import { test, expect } from "@playwright/experimental-ct-react";
import { ContactBlock } from "./ContactBlock";
import { StatusBadge } from "../../atoms/StatusBadge";
import { Button } from "../../atoms/Button";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const defaultProps = {
  email: "hello@pouk.ai",
};

// ---------------------------------------------------------------------------
// Rendering: base structure
// ---------------------------------------------------------------------------

test("renders a section landmark by default", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("section");
});

test("renders the EmailLink with correct href", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  const link = component.locator("a[href='mailto:hello@pouk.ai']");
  await expect(link).toBeVisible();
});

test("renders email address as link text by default", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  await expect(component.locator("a[href='mailto:hello@pouk.ai']")).toContainText("hello@pouk.ai");
});

// ---------------------------------------------------------------------------
// emailLabel prop
// ---------------------------------------------------------------------------

test("renders custom emailLabel when provided", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} emailLabel="Say hello" />);
  await expect(component.locator("a[href='mailto:hello@pouk.ai']")).toContainText("Say hello");
});

// ---------------------------------------------------------------------------
// heading prop
// ---------------------------------------------------------------------------

test("renders heading when provided", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} heading="Get in touch" />);
  const heading = component.locator("h2");
  await expect(heading).toBeVisible();
  await expect(heading).toContainText("Get in touch");
});

test("does not render heading element when heading is omitted", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  await expect(component.locator("h2")).toHaveCount(0);
});

test("section has aria-labelledby when heading is provided", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} heading="Get in touch" />);
  const labelledById = await component.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const heading = component.locator(`[id="${labelledById}"]`);
  await expect(heading).toContainText("Get in touch");
});

test("section has no aria-labelledby when heading is omitted", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  await expect(component).not.toHaveAttribute("aria-labelledby");
});

// ---------------------------------------------------------------------------
// status slot
// ---------------------------------------------------------------------------

test("renders status slot when provided", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      status={<StatusBadge status="available">Open for projects.</StatusBadge>}
    />,
  );
  await expect(component.getByText("Open for projects.")).toBeVisible();
});

test("does not render status row when status is omitted", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  await expect(component.locator("[data-status]")).toHaveCount(0);
});

test("renders StatusBadge with available status", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      status={<StatusBadge status="available">Available now.</StatusBadge>}
    />,
  );
  await expect(component.locator("[data-status='available']")).toBeVisible();
});

test("renders StatusBadge with idle status", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      status={<StatusBadge status="idle">Checking availability.</StatusBadge>}
    />,
  );
  await expect(component.locator("[data-status='idle']")).toBeVisible();
});

test("renders StatusBadge with closed status", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      status={<StatusBadge status="closed">Not taking new work.</StatusBadge>}
    />,
  );
  await expect(component.locator("[data-status='closed']")).toBeVisible();
});

// ---------------------------------------------------------------------------
// actions slot
// ---------------------------------------------------------------------------

test("renders actions slot when provided", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      actions={
        <Button asChild>
          <a href="/book">Book a call</a>
        </Button>
      }
    />,
  );
  await expect(component.getByText("Book a call")).toBeVisible();
});

test("does not render actions row when actions is omitted", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} />);
  // No button element should be present
  await expect(component.locator("button, [role='button']")).toHaveCount(0);
});

test("renders multiple action buttons", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      actions={
        <>
          <Button asChild>
            <a href="/book">Book a call</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/roles">See roles</a>
          </Button>
        </>
      }
    />,
  );
  await expect(component.getByText("Book a call")).toBeVisible();
  await expect(component.getByText("See roles")).toBeVisible();
});

// ---------------------------------------------------------------------------
// polymorphic as prop
// ---------------------------------------------------------------------------

test("renders as article when as=article", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} as="article" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("article");
});

test("renders as div when as=div", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} as="div" />);
  const tag = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tag).toBe("div");
});

test("div as-root has no aria-labelledby even with heading", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} as="div" heading="Get in touch" />);
  await expect(component).not.toHaveAttribute("aria-labelledby");
});

// ---------------------------------------------------------------------------
// ref / className / data-* forwarding
// ---------------------------------------------------------------------------

test("forwards className to root element", async ({ mount }) => {
  const component = await mount(
    <ContactBlock {...defaultProps} className="custom-contact-block" />,
  );
  await expect(component).toHaveClass(/custom-contact-block/);
});

test("forwards data-* attributes to root element", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} data-testid="contact-root" />);
  await expect(component).toHaveAttribute("data-testid", "contact-root");
});

test("forwards aria-* attributes to root element", async ({ mount }) => {
  const component = await mount(
    <ContactBlock {...defaultProps} as="div" aria-label="Contact section" />,
  );
  await expect(component).toHaveAttribute("aria-label", "Contact section");
});

// ---------------------------------------------------------------------------
// DOM order — heading → EmailLink → actions
// ---------------------------------------------------------------------------

test("heading appears before EmailLink in DOM order", async ({ mount }) => {
  const component = await mount(<ContactBlock {...defaultProps} heading="Get in touch" />);
  const order = await component.evaluate((el) => {
    const h2 = el.querySelector("h2");
    const link = el.querySelector("a[href^='mailto:']");
    if (!h2 || !link) return null;
    return h2.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "heading-before-link"
      : "link-before-heading";
  });
  expect(order).toBe("heading-before-link");
});

test("EmailLink appears before actions in DOM order", async ({ mount }) => {
  const component = await mount(
    <ContactBlock
      {...defaultProps}
      actions={
        <Button asChild>
          <a href="/book">Book a call</a>
        </Button>
      }
    />,
  );
  const order = await component.evaluate((el) => {
    const link = el.querySelector("a[href^='mailto:']");
    const btn = el.querySelector("a[href='/book']");
    if (!link || !btn) return null;
    return link.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING
      ? "link-before-actions"
      : "actions-before-link";
  });
  expect(order).toBe("link-before-actions");
});
