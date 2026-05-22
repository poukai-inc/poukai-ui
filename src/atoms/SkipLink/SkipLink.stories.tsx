import { useEffect, useRef } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { SkipLink } from "./SkipLink";

export default {
  title: "Components / SkipLink",
} satisfies StoryDefault;

/**
 * Default story — the SkipLink is visually hidden at rest.
 *
 * Keyboard interaction: Tab into this iframe, then press Tab once to focus
 * the SkipLink. The high-contrast pill appears top-left. Press Enter to
 * navigate to #main-content. Press Escape or Tab again to move on.
 */
export const Default: Story = () => (
  <div style={{ minHeight: "200px", padding: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
    <SkipLink href="#main-content" />
    <nav
      style={{
        marginBottom: "var(--space-4)",
        color: "var(--fg-muted)",
        fontSize: "var(--fs-meta)",
      }}
    >
      [Simulated nav — Tab here first, then Tab again to see the SkipLink pill appear]
    </nav>
    <main
      id="main-content"
      tabIndex={-1}
      style={{
        padding: "var(--space-4)",
        background: "var(--surface)",
        borderRadius: "var(--radius-2)",
      }}
    >
      <p style={{ color: "var(--fg)", fontSize: "var(--fs-body)", margin: 0 }}>
        Main content region — this is the skip target (<code>#main-content</code>).
      </p>
    </main>
  </div>
);

/**
 * Focused story — the SkipLink is programmatically focused on mount so the
 * pill is visible immediately in the showcase without requiring keyboard
 * interaction. Demonstrates the focused pill appearance.
 */
export const Focused: Story = () => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div style={{ minHeight: "200px", padding: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <SkipLink ref={ref} href="#main-content" />
      <p
        style={{
          marginTop: "var(--space-12)",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-meta)",
        }}
      >
        The SkipLink pill is visible above — focus was applied programmatically on mount. In
        production, this pill only appears on keyboard Tab.
      </p>
    </div>
  );
};

/**
 * Custom label — override the default "Skip to content" label.
 * Useful for layouts with multiple navigable regions.
 */
export const CustomLabel: Story = () => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div style={{ minHeight: "200px", padding: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <SkipLink ref={ref} href="#docs-content">
        Skip to documentation
      </SkipLink>
      <p
        style={{
          marginTop: "var(--space-12)",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-meta)",
        }}
      >
        Custom label: "Skip to documentation"
      </p>
    </div>
  );
};

/**
 * Multiple skip links — two SkipLinks targeting distinct regions.
 * Both are focused in sequence to show the stacking behavior.
 */
export const MultipleSkipLinks: Story = () => {
  const firstRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  return (
    <div style={{ minHeight: "200px", padding: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <SkipLink ref={firstRef} href="#main-content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#sidebar-nav">Skip to sidebar navigation</SkipLink>
      <p
        style={{
          marginTop: "var(--space-12)",
          color: "var(--fg-muted)",
          fontSize: "var(--fs-meta)",
        }}
      >
        Two SkipLinks — Tab through them to see each pill in turn.
      </p>
    </div>
  );
};
