import type { Story, StoryDefault } from "@ladle/react";
import { Pagination } from "./Pagination";

export default {
  title: "Components / Pagination",
} satisfies StoryDefault;

/** Default — page 1 of 10, md size.
 *  Verifies: first/prev disabled on page 1, next/last enabled,
 *  aria-current="page" on page 1, nav landmark present. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={1}
      pageCount={10}
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);

/** MiddlePage — page 5 of 10, md size.
 *  Verifies: ellipsis rendered both sides, current page highlighted,
 *  prev and next both enabled, boundary pages 1 and 10 visible. */
export const MiddlePage: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={5}
      pageCount={10}
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);

/** LastPage — page 10 of 10, md size.
 *  Verifies: next/last disabled on last page, prev/first enabled. */
export const LastPage: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={10}
      pageCount={10}
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);

/** FewPages — 5 pages total (≤ 7); no ellipsis expected.
 *  Verifies: all pages shown without ellipsis truncation, page 3 active. */
export const FewPages: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={3}
      pageCount={5}
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);

/** SmallSize — size="sm", page 3 of 10.
 *  Verifies: sm size class applied, compact height, micro font scale. */
export const SmallSize: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={3}
      pageCount={10}
      size="sm"
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);

/** Disabled — all controls disabled (loading state).
 *  Verifies: disabled prop propagates to all buttons, opacity applied. */
export const Disabled: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <Pagination
      page={3}
      pageCount={10}
      disabled
      onPageChange={() => {
        /* story: no-op */
      }}
    />
  </div>
);
