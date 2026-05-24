import { useState } from "react";
import { Combobox, type ComboboxOption } from "./Combobox";

/**
 * Test harnesses for Combobox.test.tsx.
 *
 * Lives in its own module because Playwright CT requires every component
 * mounted (including the children of test renders) to be defined outside
 * the test file. Inline test-file components produce
 * "Component X cannot be mounted" errors at runtime.
 */

export const BASIC_OPTIONS: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

export const GROUPED_OPTIONS: ComboboxOption[] = [
  { value: "react", label: "React", group: "Frontend" },
  { value: "vue", label: "Vue", group: "Frontend" },
  { value: "node", label: "Node.js", group: "Backend" },
  { value: "deno", label: "Deno", group: "Backend" },
];

/** Controlled combobox that tracks selection changes. */
export function ComboboxControlledHarness({
  initialValue = "",
  onValueChange,
}: {
  initialValue?: string;
  onValueChange?: (v: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <div>
      <Combobox
        options={BASIC_OPTIONS}
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onValueChange?.(v);
        }}
        placeholder="Select fruit…"
        aria-label="Fruit"
      />
      <span data-testid="selected-value">{value}</span>
    </div>
  );
}

/** Uncontrolled combobox with a default value. */
export function ComboboxUncontrolledHarness({ defaultValue }: { defaultValue?: string }) {
  return (
    <Combobox
      options={BASIC_OPTIONS}
      {...(defaultValue !== undefined && { defaultValue })}
      placeholder="Select fruit…"
      aria-label="Fruit"
    />
  );
}

/** Combobox with native form name for hidden input testing. */
export function ComboboxFormHarness() {
  const [value, setValue] = useState("");
  return (
    <form data-testid="form">
      <Combobox
        options={BASIC_OPTIONS}
        value={value}
        onValueChange={setValue}
        name="fruit"
        placeholder="Select fruit…"
        aria-label="Fruit"
      />
    </form>
  );
}

/** Grouped options harness. */
export function ComboboxGroupedHarness() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      options={GROUPED_OPTIONS}
      value={value}
      onValueChange={setValue}
      placeholder="Select technology…"
      aria-label="Technology"
    />
  );
}

/** Custom filter harness — only exact prefix match. */
export function ComboboxCustomFilterHarness() {
  const [value, setValue] = useState("");
  return (
    <Combobox
      options={BASIC_OPTIONS}
      value={value}
      onValueChange={setValue}
      filter={(opt, q) => opt.label.toLowerCase().startsWith(q.toLowerCase())}
      placeholder="Select fruit…"
      aria-label="Fruit"
    />
  );
}
