import type { Story, StoryDefault } from "@ladle/react";
import { AudioPlayer } from "./AudioPlayer";

export default {
  title: "Molecules / AudioPlayer",
} satisfies StoryDefault;

const DEMO_SRC = "https://www.w3schools.com/html/horse.ogg";

/** Default — full AudioPlayer: audio controls, caption, and transcript link.
 *  Verifies: <figure> root, <audio controls> inside, Caption as <figcaption>,
 *  transcript link below caption, all token values. */
export const Default: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Episode 12 — Design systems"
      caption="Episode 12 — Design systems"
      transcriptHref="/transcripts/ep-12"
    />
  </div>
);

/** NoCaption — audio controls only; no caption, no transcript link.
 *  Verifies: caption and transcript link are absent when not provided. */
export const NoCaption: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <AudioPlayer src={DEMO_SRC} aria-label="Voice note from Arian" />
  </div>
);

/** CaptionOnly — audio controls + caption; no transcript link.
 *  Verifies: transcript link absent when transcriptHref is omitted. */
export const CaptionOnly: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Recorded interview — Sarah Chen, VP Engineering"
      caption="Recorded interview — Sarah Chen, VP Engineering"
    />
  </div>
);

/** CustomTranscriptLabel — transcript link with overridden label text.
 *  Verifies: transcriptLabel prop overrides default "Read transcript". */
export const CustomTranscriptLabel: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Podcast Episode 5"
      caption="Podcast Episode 5 — The pivot moment"
      transcriptHref="/transcripts/ep-5"
      transcriptLabel="View full transcript"
    />
  </div>
);

/** PreloadNone — preload set to "none" to suppress initial network load.
 *  Verifies: preload prop forwarded correctly to <audio>. */
export const PreloadNone: Story = () => (
  <div style={{ background: "var(--bg)", padding: "var(--space-8) var(--space-4)" }}>
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="On-demand audio"
      caption="Load on demand — preload none"
      preload="none"
    />
  </div>
);

/** InEditorialRhythm — prose paragraphs surrounding the AudioPlayer.
 *  Verifies: margin-block reads correctly within editorial prose column. */
export const InEditorialRhythm: Story = () => (
  <div
    style={{
      background: "var(--bg)",
      padding: "var(--space-8) var(--space-4)",
      maxWidth: "var(--hero-max)",
    }}
  >
    <p>
      Pilots fail because they are rehearsals. Every staging environment is a model of production,
      not production itself. The signal you need lives in real usage.
    </p>
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Episode 12 — Design systems"
      caption="Episode 12 — Design systems"
      transcriptHref="/transcripts/ep-12"
    />
    <p>
      Ship the smallest real system. Instrument everything. Iterate on signal. This is not a
      philosophy — it is the only method that closes the loop.
    </p>
  </div>
);
