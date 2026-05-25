import type { StoryDefault, Story } from "@ladle/react";
import { NavLink } from "./NavLink";

export default {
  title: "Molecules / NavLink",
} satisfies StoryDefault;

export const Default: Story = () => <NavLink href="/about">About</NavLink>;

export const Active: Story = () => (
  <NavLink href="/work" active>
    Work
  </NavLink>
);

/** Horizontal nav row — composition example as it would appear in a TopNav organism. */
export const HorizontalNavRow: Story = () => (
  <nav
    aria-label="Primary"
    style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}
  >
    <NavLink href="/">Home</NavLink>
    <NavLink href="/work" active>
      Work
    </NavLink>
    <NavLink href="/about">About</NavLink>
    <NavLink href="/contact">Contact</NavLink>
  </nav>
);
