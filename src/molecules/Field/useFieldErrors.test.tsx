import { test, expect } from "@playwright/experimental-ct-react";
import {
  HookHarness,
  SeededHarness,
  PartialClearHarness,
  RefStabilityHarness,
} from "./__test_harness__";

/* ---------- Initial state ---------- */

test("initial state is empty when no seed provided", async ({ mount }) => {
  const component = await mount(<HookHarness />);
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({});
});

test("initial state reflects seed when provided", async ({ mount }) => {
  const seed = { email: "Required", name: "Too short" };
  const component = await mount(<SeededHarness initial={seed} />);
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual(seed);
});

/* ---------- setErrors ---------- */

test("setErrors replaces the entire error map", async ({ mount }) => {
  const component = await mount(<HookHarness />);

  // First, seed a value via setErrors
  await component.getByTestId("set-errors").click();
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({
    email: "Invalid email",
    name: "Required",
  });
});

test("setErrors replaces the entire map — previous keys gone", async ({ mount }) => {
  const component = await mount(<HookHarness initial={{ phone: "Invalid" }} />);

  // Replace with a completely different map
  await component.getByTestId("set-errors").click();
  const text = await component.getByTestId("errors").textContent();
  const parsed = JSON.parse(text ?? "null") as Record<string, unknown>;

  // The new map must have email and name
  expect(parsed.email).toBe("Invalid email");
  expect(parsed.name).toBe("Required");
  // The old "phone" key is gone
  expect("phone" in parsed).toBe(false);
});

/* ---------- setFieldError — add ---------- */

test("setFieldError adds a single field error", async ({ mount }) => {
  const component = await mount(<HookHarness />);

  await component.getByTestId("set-field-email").click();
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({ email: "Enter a valid email" });
});

test("setFieldError preserves other fields when adding", async ({ mount }) => {
  const component = await mount(<PartialClearHarness />);

  // Seed two fields
  await component.getByTestId("seed").click();
  // Clear only email — name must survive
  await component.getByTestId("clear-email").click();
  const text = await component.getByTestId("errors").textContent();
  const parsed = JSON.parse(text ?? "null") as Record<string, unknown>;

  expect(parsed.email).toBeUndefined();
  expect(parsed.name).toBe("Required");
});

/* ---------- setFieldError — clear (undefined) ---------- */

test("setFieldError with undefined clears that field", async ({ mount }) => {
  const component = await mount(<HookHarness />);

  // Add email error then clear it
  await component.getByTestId("set-field-email").click();
  await component.getByTestId("clear-field-email").click();
  const text = await component.getByTestId("errors").textContent();
  const parsed = JSON.parse(text ?? "null") as Record<string, unknown>;

  expect(parsed.email).toBeUndefined();
});

/* ---------- clearAll ---------- */

test("clearAll empties the error map", async ({ mount }) => {
  const component = await mount(<HookHarness />);

  // Populate then clear
  await component.getByTestId("set-errors").click();
  await component.getByTestId("clear-all").click();
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({});
});

test("clearAll on already-empty map stays empty", async ({ mount }) => {
  const component = await mount(<HookHarness />);

  await component.getByTestId("clear-all").click();
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({});
});

test("clearAll on seeded initial state empties the map", async ({ mount }) => {
  const seed = { email: "Required" };
  const component = await mount(<SeededHarness initial={seed} />);

  await component.getByTestId("clear-all").click();
  const text = await component.getByTestId("errors").textContent();
  expect(JSON.parse(text ?? "null")).toEqual({});
});

/* ---------- Setter referential stability ---------- */

test("setters are stable across re-renders (refs do not change)", async ({ mount }) => {
  const component = await mount(<RefStabilityHarness />);

  // Force a re-render without touching state
  await component.getByTestId("force-rerender").click();
  const changedAfterRerender = await component.getByTestId("refs-changed").textContent();
  expect(changedAfterRerender).toBe("false");

  // Force a re-render via state update (setFieldError triggers re-render)
  await component.getByTestId("trigger-update").click();
  const changedAfterUpdate = await component.getByTestId("refs-changed").textContent();
  expect(changedAfterUpdate).toBe("false");
});
