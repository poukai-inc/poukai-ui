import type { Story, StoryDefault } from "@ladle/react";
import { Carousel } from "./Carousel";

export default {
  title: "Molecules / Carousel",
} satisfies StoryDefault;

/** Default — three slides, prev/next flanking the track, no indicators.
 *  Verifies: scroll-snap track renders, prev/next buttons present,
 *  disabled state on first slide (loop=false default). */
export const Default: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "36rem",
      margin: "0 auto",
    }}
  >
    <Carousel.Root aria-label="Feature highlights" indicators={false}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Slide one</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>First slide content.</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Slide two</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>Second slide content.</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Slide three</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>Third slide content.</p>
          </Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
    </Carousel.Root>
  </div>
);

/** WithIndicators — three slides with dot indicators below track.
 *  Verifies: role="tablist" renders, dots count matches slides,
 *  active dot uses --accent fill. */
export const WithIndicators: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "36rem",
      margin: "0 auto",
    }}
  >
    <Carousel.Root aria-label="Testimonials">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>
            <p style={{ margin: 0 }}>"This is the first testimonial."</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <p style={{ margin: 0 }}>"This is the second testimonial."</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <p style={{ margin: 0 }}>"This is the third testimonial."</p>
          </Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
      <Carousel.Indicators />
    </Carousel.Root>
  </div>
);

/** WithAutoplay — autoplay enabled. Timer pauses on hover and focus.
 *  prefers-reduced-motion: timer never starts.
 *  Verifies: component renders correctly with autoplay prop. */
export const WithAutoplay: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "36rem",
      margin: "0 auto",
    }}
  >
    <Carousel.Root aria-label="Auto-advancing feature highlights" autoplay loop>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <Carousel.Prev />
        <Carousel.Track>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Feature A</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>Auto-advances every 4 seconds.</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Feature B</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>Hover or focus to pause.</p>
          </Carousel.Slide>
          <Carousel.Slide>
            <h3 style={{ margin: 0 }}>Feature C</h3>
            <p style={{ margin: "var(--space-2) 0 0" }}>Loop wraps to slide A.</p>
          </Carousel.Slide>
        </Carousel.Track>
        <Carousel.Next />
      </div>
      <Carousel.Indicators />
    </Carousel.Root>
  </div>
);

/** PrevNextComposition — demonstrates consumer control over layout.
 *  Nav buttons positioned absolutely over the track. */
export const PrevNextComposition: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "36rem",
      margin: "0 auto",
    }}
  >
    <Carousel.Root aria-label="Image gallery">
      <div style={{ position: "relative" }}>
        <Carousel.Track>
          <Carousel.Slide style={{ minHeight: "12rem", background: "var(--surface-section)" }}>
            <p style={{ margin: 0 }}>Gallery slide one</p>
          </Carousel.Slide>
          <Carousel.Slide style={{ minHeight: "12rem", background: "var(--surface-section)" }}>
            <p style={{ margin: 0 }}>Gallery slide two</p>
          </Carousel.Slide>
          <Carousel.Slide style={{ minHeight: "12rem", background: "var(--surface-section)" }}>
            <p style={{ margin: 0 }}>Gallery slide three</p>
          </Carousel.Slide>
        </Carousel.Track>
        <Carousel.Prev
          style={{
            position: "absolute",
            left: "var(--space-2)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Carousel.Next
          style={{
            position: "absolute",
            right: "var(--space-2)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>
      <Carousel.Indicators />
    </Carousel.Root>
  </div>
);
