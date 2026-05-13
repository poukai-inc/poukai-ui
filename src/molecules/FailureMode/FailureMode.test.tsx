import { test, expect } from "@playwright/experimental-ct-react";
import { FailureMode } from "./FailureMode";

test("renders zero-padded index by default", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={1} title="A failure">
      <p>Body.</p>
    </FailureMode>,
  );
  await expect(component.getByText("01")).toBeVisible();
});

test("zero-pads two-digit indices unchanged", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={12} title="T">
      <p>Body.</p>
    </FailureMode>,
  );
  await expect(component.getByText("12")).toBeVisible();
});

test("indexLabel overrides numeric formatting", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={1} indexLabel="A1" title="T">
      <p>Body.</p>
    </FailureMode>,
  );
  await expect(component.getByText("A1")).toBeVisible();
  await expect(component.getByText("01")).toHaveCount(0);
});

test("index label is aria-hidden", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={1} title="T">
      <p>Body.</p>
    </FailureMode>,
  );
  const label = component.getByText("01");
  await expect(label).toHaveAttribute("aria-hidden", "true");
});

test("title is rendered as h3", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={1} title="The chatbot-on-top-of-RAG plateau.">
      <p>Body.</p>
    </FailureMode>,
  );
  await expect(component.getByRole("heading", { level: 3 })).toHaveText(
    "The chatbot-on-top-of-RAG plateau.",
  );
});

test("forwards arbitrary props to the section root", async ({ mount }) => {
  const component = await mount(
    <FailureMode index={1} title="T" data-testid="fm" aria-labelledby="x">
      <p>B.</p>
    </FailureMode>,
  );
  await expect(component.locator("[data-testid='fm']")).toHaveAttribute("aria-labelledby", "x");
});
