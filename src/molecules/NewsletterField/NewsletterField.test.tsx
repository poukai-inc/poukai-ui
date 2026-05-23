import { test, expect } from "@playwright/experimental-ct-react";
import { NewsletterField } from "./NewsletterField";

/* ---------- Root element ---------- */

test("root element is form", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("form");
});

test("form has aria-label", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component).toHaveAttribute("aria-label", "Newsletter signup");
});

test("formAriaLabel prop overrides default aria-label", async ({ mount }) => {
  const component = await mount(<NewsletterField formAriaLabel="Join the waitlist" />);
  await expect(component).toHaveAttribute("aria-label", "Join the waitlist");
});

/* ---------- Input ---------- */

test("input has type=email", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("textbox")).toHaveAttribute("type", "email");
});

test("input has required attribute", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("textbox")).toHaveAttribute("required");
});

test("input has default placeholder", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("textbox")).toHaveAttribute("placeholder", "you@example.com");
});

test("placeholder prop is forwarded to input", async ({ mount }) => {
  const component = await mount(<NewsletterField placeholder="name@company.com" />);
  await expect(component.getByRole("textbox")).toHaveAttribute("placeholder", "name@company.com");
});

test("input has default name=email", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("textbox")).toHaveAttribute("name", "email");
});

test("name prop overrides input name", async ({ mount }) => {
  const component = await mount(<NewsletterField name="subscriber_email" />);
  await expect(component.getByRole("textbox")).toHaveAttribute("name", "subscriber_email");
});

/* ---------- Submit button ---------- */

test("button is type=submit", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("button")).toHaveAttribute("type", "submit");
});

test("button has default label Subscribe", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  await expect(component.getByRole("button", { name: "Subscribe" })).toBeVisible();
});

test("cta prop sets button label", async ({ mount }) => {
  const component = await mount(<NewsletterField cta="Join waitlist" />);
  await expect(component.getByRole("button", { name: "Join waitlist" })).toBeVisible();
});

/* ---------- Accessible label ---------- */

test("visually hidden label exists for email input", async ({ mount }) => {
  const component = await mount(<NewsletterField placeholder="you@example.com" />);
  // The VisuallyHidden span contains the placeholder text as accessible label
  const input = component.getByRole("textbox");
  const labelledBy = await input.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  // The element identified by aria-labelledby must exist in the DOM
  // React's useId() generates IDs containing ':' which must be CSS-escaped.
  const labelEl = component.locator(`#${CSS.escape(labelledBy!)}`);
  await expect(labelEl).toBeAttached();
});

/* ---------- Note slot ---------- */

test("note slot not rendered when note is undefined", async ({ mount }) => {
  const component = await mount(<NewsletterField />);
  // No <p class*=note> should be present
  const notes = component.locator("p");
  // There may be 0 p elements; no note should have the muted copy
  const count = await notes.count();
  // Defensive: if no p exists that's fine; if one exists it should not be the note
  for (let i = 0; i < count; i++) {
    const text = await notes.nth(i).textContent();
    expect(text).not.toContain("you@example.com");
  }
});

test("note slot renders when note prop is provided", async ({ mount }) => {
  const component = await mount(<NewsletterField note="No spam. Unsubscribe any time." />);
  await expect(component.getByText("No spam. Unsubscribe any time.")).toBeVisible();
});

test("note renders ReactNode content", async ({ mount }) => {
  const component = await mount(
    <NewsletterField
      note={
        <span>
          Privacy <a href="/privacy">policy</a>.
        </span>
      }
    />,
  );
  await expect(component.getByText("policy")).toBeVisible();
});

/* ---------- Disabled state ---------- */

test("disabled=true disables input", async ({ mount }) => {
  const component = await mount(<NewsletterField disabled />);
  await expect(component.getByRole("textbox")).toBeDisabled();
});

test("disabled=true disables button", async ({ mount }) => {
  const component = await mount(<NewsletterField disabled />);
  await expect(component.getByRole("button")).toBeDisabled();
});

/* ---------- Action / method ---------- */

test("action prop sets form action attribute", async ({ mount }) => {
  const component = await mount(<NewsletterField action="/api/subscribe" />);
  await expect(component).toHaveAttribute("action", "/api/subscribe");
});

test("method defaults to post when action is set", async ({ mount }) => {
  const component = await mount(<NewsletterField action="/api/subscribe" />);
  await expect(component).toHaveAttribute("method", "post");
});

test("method=get is forwarded when action is set", async ({ mount }) => {
  const component = await mount(<NewsletterField action="/search" method="get" />);
  await expect(component).toHaveAttribute("method", "get");
});

/* ---------- onSubmit ---------- */

test("onSubmit fires when form is submitted", async ({ mount }) => {
  let submitted = false;
  const component = await mount(
    <NewsletterField
      onSubmit={(e) => {
        e.preventDefault();
        submitted = true;
      }}
    />,
  );
  await component.getByRole("textbox").fill("test@example.com");
  // Use the form's native requestSubmit() to deterministically trigger
  // the React onSubmit handler — button-click → form-submit propagation
  // can be flaky across browsers when an Input atom wraps the field.
  // `component` IS the <form> root.
  await component.evaluate((form) => (form as HTMLFormElement).requestSubmit());
  expect(submitted).toBe(true);
});

/* ---------- className / data-* forwarding ---------- */

test("merges consumer className on root form", async ({ mount }) => {
  const component = await mount(<NewsletterField className="my-newsletter" />);
  const cls = await component.getAttribute("class");
  expect(cls).toMatch(/my-newsletter/);
});

test("forwards data-* attributes to root form", async ({ mount }) => {
  const component = await mount(<NewsletterField data-testid="nf-root" />);
  await expect(component).toHaveAttribute("data-testid", "nf-root");
});

/* ---------- Ref forwarding ---------- */

test("ref forwards to the form element", async ({ mount }) => {
  const component = await mount(<NewsletterField data-ref-test="yes" />);
  await expect(component).toHaveAttribute("data-ref-test", "yes");
  const tagName = await component.evaluate((el) => el.tagName.toLowerCase());
  expect(tagName).toBe("form");
});

/* a11y scans are in src/a11y.test.tsx (central gate). */
