import { test, expect } from "@playwright/experimental-ct-react";
import { RoleCard } from "./RoleCard";

test("renders eyebrow, title, body", async ({ mount }) => {
  const component = await mount(
    <RoleCard eyebrow="Role 01" title="Builder" body="Ships things." />,
  );
  await expect(component.getByText("Role 01")).toBeVisible();
  await expect(component.getByRole("heading", { level: 3 })).toHaveText("Builder");
  await expect(component.getByText("Ships things.")).toBeVisible();
});

test("renders icon slot with aria-hidden", async ({ mount }) => {
  const component = await mount(
    <RoleCard
      eyebrow="E"
      title="T"
      body="B"
      icon={<span data-testid="icon">icon</span>}
    />,
  );
  const wrapper = component.locator("[aria-hidden='true']").first();
  await expect(wrapper).toBeVisible();
  await expect(component.locator("[data-testid='icon']")).toBeVisible();
});

test("omits icon container when no icon provided", async ({ mount }) => {
  const component = await mount(<RoleCard eyebrow="E" title="T" body="B" />);
  await expect(component.locator("[aria-hidden='true']")).toHaveCount(0);
});

test("renders hiredBy footer when provided", async ({ mount }) => {
  const component = await mount(
    <RoleCard eyebrow="E" title="T" body="B" hiredBy="Anthropic · Vercel" />,
  );
  await expect(component.getByText("Anthropic · Vercel")).toBeVisible();
});

test("omits footer when hiredBy is not provided", async ({ mount }) => {
  const component = await mount(<RoleCard eyebrow="E" title="T" body="B" />);
  // Only eyebrow + body should be `p` elements.
  await expect(component.locator("p")).toHaveCount(2);
});

test("forwards arbitrary props to the article root", async ({ mount }) => {
  const component = await mount(
    <RoleCard eyebrow="E" title="T" body="B" data-testid="role" aria-label="A role" />,
  );
  const root = component.locator("[data-testid='role']");
  await expect(root).toHaveAttribute("aria-label", "A role");
});
