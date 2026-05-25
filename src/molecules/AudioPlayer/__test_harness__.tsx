import { AudioPlayer } from "./AudioPlayer";

const DEMO_SRC = "https://www.w3schools.com/html/horse.ogg";

/** Full AudioPlayer: caption + transcript link. */
export function FullAudioPlayer() {
  return (
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Episode 12 — Design systems"
      caption="Episode 12 — Design systems"
      transcriptHref="/transcripts/ep-12"
      data-testid="audio-root"
    />
  );
}

/** AudioPlayer with no caption and no transcript link. */
export function MinimalAudioPlayer() {
  return <AudioPlayer src={DEMO_SRC} aria-label="Voice note" data-testid="audio-root" />;
}

/** AudioPlayer with caption only (no transcript link). */
export function CaptionOnlyAudioPlayer() {
  return (
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Recorded interview"
      caption="Recorded interview — Sarah Chen"
      data-testid="audio-root"
    />
  );
}

/** AudioPlayer with custom transcript label. */
export function CustomLabelAudioPlayer() {
  return (
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Podcast Episode 5"
      caption="Podcast Episode 5"
      transcriptHref="/transcripts/ep-5"
      transcriptLabel="View full transcript"
      data-testid="audio-root"
    />
  );
}

/** AudioPlayer with extra className. */
export function ClassNameAudioPlayer() {
  return (
    <AudioPlayer
      src={DEMO_SRC}
      aria-label="Test audio"
      className="custom-player-class"
      data-testid="audio-root"
    />
  );
}
