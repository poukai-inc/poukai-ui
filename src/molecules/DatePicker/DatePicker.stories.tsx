import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { DatePicker } from "./DatePicker";

export default {
  title: "Components / DatePicker",
} satisfies StoryDefault;

/** (a) Default — no date selected, placeholder visible. */
export const Default: Story = () => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
      <DatePicker value={date} onValueChange={setDate} />
    </div>
  );
};

/** (b) WithValue — a date is pre-selected. */
export const WithValue: Story = () => {
  const [date, setDate] = useState<Date | null>(new Date(2026, 4, 23)); // May 23 2026
  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
      <DatePicker value={date} onValueChange={setDate} />
    </div>
  );
};

/** (c) MinMax — days outside the range are disabled. */
export const MinMax: Story = () => {
  const [date, setDate] = useState<Date | null>(null);
  const today = new Date();
  const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
      <DatePicker value={date} onValueChange={setDate} min={today} max={nextWeek} />
    </div>
  );
};

/** (d) Invalid — error state with red trigger border. */
export const Invalid: Story = () => {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
      <DatePicker value={date} onValueChange={setDate} invalid />
    </div>
  );
};

/** (e) Disabled — all interaction suppressed. */
export const Disabled: Story = () => (
  <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
    <DatePicker disabled placeholder="Pick a date" />
  </div>
);

/** (f) WithName — hidden input wires to a native form. */
export const WithName: Story = () => {
  const [date, setDate] = useState<Date | null>(new Date(2026, 4, 23));
  return (
    <div style={{ padding: "var(--space-6)", maxWidth: "20rem" }}>
      <form>
        <DatePicker value={date} onValueChange={setDate} name="scheduledFor" />
      </form>
    </div>
  );
};
