import type { Story, StoryDefault } from "@ladle/react";
import { VisuallyHidden } from "./VisuallyHidden";

export default {
  title: "Atoms / VisuallyHidden",
  args: {
    children: "Screen-reader-only announcement text",
    as: "span",
  },
  argTypes: {
    as: {
      options: ["span", "div"],
      control: { type: "radio" },
      defaultValue: "span",
    },
    children: {
      control: { type: "text" },
      defaultValue: "Screen-reader-only announcement text",
    },
  },
} satisfies StoryDefault;

/**
 * Playground — renders the component inside a visible wrapper so you can
 * confirm the element is in the DOM (inspect) but invisible to sighted users.
 */
export const Playground: Story<{ as: "span" | "div"; children: string }> = ({ as, children }) => (
  <div
    style={{
      border: "1px dashed #d2d2d7",
      padding: "24px",
      borderRadius: "4px",
      fontFamily: "system-ui",
      fontSize: "14px",
      color: "#6e6e73",
    }}
  >
    <p style={{ margin: "0 0 12px" }}>
      The dashed box contains a{" "}
      <code style={{ fontFamily: "monospace" }}>&lt;VisuallyHidden as=&quot;{as}&quot;&gt;</code>{" "}
      element. It is present in the DOM and visible to assistive technology, but has zero visual
      footprint — no pixels, no layout contribution.
    </p>
    <VisuallyHidden as={as}>{children}</VisuallyHidden>
    <p style={{ margin: 0 }}>
      Inspect the DOM to verify the element exists. Use a screen reader to hear the announcement.
    </p>
  </div>
);

/**
 * SrOnlyButton — the canonical usage: a button that has a visible icon but
 * no visible label. VisuallyHidden provides the accessible name.
 */
export const SrOnlyButton: Story = () => (
  <button
    type="button"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "44px",
      height: "44px",
      border: "1px solid #d2d2d7",
      borderRadius: "8px",
      background: "transparent",
      cursor: "pointer",
    }}
    aria-label="Close"
  >
    {/* Decorative × icon */}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2L14 14M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
    <VisuallyHidden>Close dialog</VisuallyHidden>
  </button>
);

SrOnlyButton.storyName = "sr-only button label";

/**
 * AriaLive — a live-region announcement surface. The VisuallyHidden element
 * carries aria-live="polite" so assistive technology announces dynamic updates
 * without shifting visual layout.
 */
export const AriaLive: Story = () => (
  <div style={{ fontFamily: "system-ui", fontSize: "14px", color: "#1d1d1f" }}>
    <p style={{ margin: "0 0 8px" }}>
      The element below carries <code style={{ fontFamily: "monospace" }}>aria-live="polite"</code>.
      A screen reader will announce its content when it changes.
    </p>
    <VisuallyHidden aria-live="polite" aria-atomic="true">
      Slide 2 of 5
    </VisuallyHidden>
    <p style={{ margin: 0, color: "#6e6e73", fontSize: "12px" }}>
      Inspect the DOM:{" "}
      <code style={{ fontFamily: "monospace" }}>[aria-live=&quot;polite&quot;]</code> is present and
      announced by assistive technology.
    </p>
  </div>
);

AriaLive.storyName = "aria-live announcement";
