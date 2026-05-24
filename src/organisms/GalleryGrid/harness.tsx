/**
 * Test harnesses for GalleryGrid.test.tsx.
 *
 * Playwright CT requires all mounted components (including children) to be
 * defined outside the test file. Inline components produce
 * "Component X cannot be mounted" errors at runtime.
 */

import { GalleryGrid, type GalleryGridItemProps } from "./GalleryGrid";

export const SAMPLE_ITEMS: GalleryGridItemProps[] = [
  {
    src: "https://picsum.photos/seed/gh-a/600/800",
    alt: "Abstract architectural detail",
    caption: "Berlin, 2024",
  },
  {
    src: "https://picsum.photos/seed/gh-b/600/800",
    alt: "Studio interior with warm light",
    caption: "Studio Moabit",
  },
  {
    src: "https://picsum.photos/seed/gh-c/600/800",
    alt: "Landscape at dusk",
  },
];

export const ITEMS_NO_CAPTIONS: GalleryGridItemProps[] = [
  { src: "https://picsum.photos/seed/nc-a/600/800", alt: "First image" },
  { src: "https://picsum.photos/seed/nc-b/600/800", alt: "Second image" },
];

export function GalleryGridDefaultHarness() {
  return <GalleryGrid heading="Selected work" columns={3} items={SAMPLE_ITEMS} />;
}

export function NoCaptionsHarness() {
  return <GalleryGrid heading="Anonymous grid" columns={3} items={ITEMS_NO_CAPTIONS} />;
}

export function NoHeadingHarness() {
  return <GalleryGrid columns={3} items={SAMPLE_ITEMS} />;
}

export function TwoColumnsHarness() {
  return <GalleryGrid heading="Two-column" columns={2} items={SAMPLE_ITEMS} />;
}

export function FourColumnsHarness() {
  return <GalleryGrid heading="Four-column" columns={4} items={SAMPLE_ITEMS} />;
}

export function TightGapHarness() {
  return <GalleryGrid heading="Tight gap" columns={3} gap="tight" items={SAMPLE_ITEMS} />;
}
