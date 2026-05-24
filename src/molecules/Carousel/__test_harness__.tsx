import { Carousel } from "./Carousel";

/** Basic three-slide carousel used across multiple test cases. */
export function ThreeSlideCarousel({
  autoplay = false,
  loop = false,
  indicators = true,
}: {
  autoplay?: boolean;
  loop?: boolean;
  indicators?: boolean;
}) {
  return (
    <Carousel.Root aria-label="Test carousel" autoplay={autoplay} loop={loop}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>Slide one</Carousel.Slide>
          <Carousel.Slide>Slide two</Carousel.Slide>
          <Carousel.Slide>Slide three</Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
      {indicators && <Carousel.Indicators />}
    </Carousel.Root>
  );
}
