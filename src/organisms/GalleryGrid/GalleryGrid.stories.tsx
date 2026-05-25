import type { Story, StoryDefault } from "@ladle/react";
import { GalleryGrid } from "./GalleryGrid";

export default {
  title: "Components / GalleryGrid",
} satisfies StoryDefault;

const ITEMS_3 = [
  {
    src: "https://picsum.photos/seed/gg-a/600/800",
    alt: "Abstract architectural detail",
    caption: "Berlin, 2024",
  },
  {
    src: "https://picsum.photos/seed/gg-b/600/800",
    alt: "Studio interior with warm light",
    caption: "Studio Moabit",
  },
  {
    src: "https://picsum.photos/seed/gg-c/600/800",
    alt: "Landscape at dusk",
    caption: "Brandenburg, 2023",
  },
];

const ITEMS_6 = [
  ...ITEMS_3,
  {
    src: "https://picsum.photos/seed/gg-d/600/800",
    alt: "Close-up of textile surface",
    caption: "Material study",
  },
  {
    src: "https://picsum.photos/seed/gg-e/600/800",
    alt: "Urban street at night",
  },
  {
    src: "https://picsum.photos/seed/gg-f/600/800",
    alt: "Portrait against concrete wall",
    caption: "Series 02",
  },
];

export const Default: Story = () => (
  <GalleryGrid heading="Selected work" columns={3} items={ITEMS_3} />
);

export const SixItems: Story = () => (
  <GalleryGrid heading="Selected work" columns={3} items={ITEMS_6} />
);

export const TwoColumns: Story = () => (
  <GalleryGrid heading="Two-column grid" columns={2} items={ITEMS_6} />
);

export const FourColumns: Story = () => (
  <GalleryGrid heading="Four-column grid" columns={4} items={ITEMS_6} />
);

export const TightGap: Story = () => (
  <GalleryGrid heading="Dense editorial" columns={3} gap="tight" items={ITEMS_6} />
);

export const NoCaptions: Story = () => (
  <GalleryGrid
    heading="Anonymous grid"
    columns={3}
    items={ITEMS_3.map(({ src, alt }) => ({ src, alt }))}
  />
);

export const NoHeading: Story = () => <GalleryGrid columns={3} items={ITEMS_3} />;
