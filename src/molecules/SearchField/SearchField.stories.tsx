import { useState } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { SearchField } from "./SearchField";

export default {
  title: "Molecules / SearchField",
} satisfies StoryDefault;

/** (a) Default — empty, controlled, no clear button visible. */
export const Default: Story = () => {
  const [q, setQ] = useState("");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <SearchField value={q} onValueChange={setQ} label="Search" placeholder="Search…" />
    </div>
  );
};

/** (b) WithValue — clear button is visible because value is non-empty. */
export const WithValue: Story = () => {
  const [q, setQ] = useState("design system");
  return (
    <div style={{ maxWidth: "24rem" }}>
      <SearchField value={q} onValueChange={setQ} label="Search" placeholder="Search…" />
    </div>
  );
};

/** (c) InTableFilter — sm size, inline with a mock table header. */
export const InTableFilter: Story = () => {
  const [q, setQ] = useState("");
  return (
    <div
      style={{
        maxWidth: "40rem",
        padding: "var(--space-4)",
        background: "var(--surface)",
        borderRadius: "var(--radius-3)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-meta)",
          fontWeight: 600,
          color: "var(--fg)",
          whiteSpace: "nowrap",
        }}
      >
        Team members
      </span>
      <SearchField
        value={q}
        onValueChange={setQ}
        label="Filter team members"
        placeholder="Filter…"
        size="sm"
        style={{ flex: 1 }}
      />
    </div>
  );
};

/** (d) InHeader — md size, dark banner composition. */
export const InHeader: Story = () => {
  const [q, setQ] = useState("");
  return (
    <div
      style={{
        maxWidth: "40rem",
        padding: "var(--space-4) var(--space-6)",
        background: "var(--fg)",
        borderRadius: "var(--radius-3)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-6)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-meta)",
          fontWeight: 600,
          color: "var(--bg)",
          whiteSpace: "nowrap",
        }}
      >
        Dashboard
      </span>
      <SearchField
        value={q}
        onValueChange={setQ}
        label="Search dashboard"
        placeholder="Search…"
        size="md"
        style={{ flex: 1 }}
      />
    </div>
  );
};
