# AudioPlayer

**Status:** Draft (poukai-design — Phase 1 batch scaffold; pending approval).

## 1. Intent

`AudioPlayer` provides a token-styled HTML5 audio playback surface with a Caption row and an optional transcript Link below the controls. Its single job is to embed an audio file into editorial content — podcast episodes, voice notes, recorded interviews — while maintaining the system's restrained typographic register. It serves long-form article pages, case studies, and any surface where audio accompanies written content.

> Status: deferred / demand-pull. Do not implement until a consumer
> surface explicitly requests it.

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│  [▶]  ━━━━━━━━━━━━━━━━━━━━  0:00 / 3:42 │  ← <audio controls> or custom control row
└─────────────────────────────────────────┘
  Episode 12 — Design systems               ← Caption (<figcaption> or <p>)
  Read transcript →                         ← <a> link (optional)
```

- **Root element**: `<figure>` — wraps controls + caption as a semantic media unit.
- **Audio element**: `<audio controls>` — native browser controls as the default; styled via pseudo-elements where supported.
- **Caption slot**: `<Caption>` atom (renders `<figcaption>` when inside `<figure>`).
- **Transcript link** (optional): plain `<a>` inheriting the global link style from `tokens.css`.

## 3. Tokens

- `--fg-muted` — Caption text color
- `--fs-meta` — Caption font size (14px)
- `--lh-meta` — Caption line height (1.2)
- `--font-sans` — Caption + transcript link font family
- `--space-2` — gap between audio element and Caption
- `--space-1` — gap between Caption and transcript link
- `--accent` — transcript link hover underline (inherited from global `a` rule)
- `--hairline` — resting underline on transcript link (inherited from global `a` rule)
- `--radius-2` — border-radius on the audio element wrapper (4px)
- `--surface` — background behind the audio control bar
- `--hairline-w` — border on audio wrapper (1px)

## 4. Variants / Props

| Prop             | Type      | Default     | Rationale                                                      |
| ---------------- | --------- | ----------- | -------------------------------------------------------------- |
| `src`            | `string`  | required    | The audio file URL passed to `<audio src>`.                    |
| `caption`        | `string`  | `undefined` | Short label below controls; rendered via `<Caption>`.          |
| `transcriptHref` | `string`  | `undefined` | When present, renders a "Read transcript" link below Caption.  |
| `transcriptLabel`| `string`  | `"Read transcript"` | Overridable link text for localisation.              |
| `autoPlay`       | `boolean` | `false`     | Forwarded to `<audio>`; off by default (WCAG 1.4.2).           |
| `loop`           | `boolean` | `false`     | Forwarded to `<audio>`.                                        |
| `muted`          | `boolean` | `false`     | Forwarded to `<audio>`.                                        |
| `preload`        | `"none" \| "metadata" \| "auto"` | `"metadata"` | Limits initial network cost while enabling duration display. |

No custom control skin is introduced in this spec. Native `<audio controls>` is the baseline. If `::-webkit-media-controls-*` styling proves insufficient for brand alignment a custom control layer can be specced separately.

## 5. Interaction

- **Play / pause**: native browser controls; keyboard Space / Enter when the audio element is focused.
- **Seek**: native range input within `<audio controls>`; arrow keys adjust position.
- **Volume**: native controls; keyboard accessible.
- **Transcript link**: standard anchor interaction — Enter to follow, focus-visible ring via `--accent` (2px outline, 4px offset, `--radius-1`).
- **Focus order**: `<audio>` element first, transcript link second (DOM order).
- **autoPlay is off by default** — auto-playing audio that starts without user gesture violates WCAG 1.4.2 (Audio Control). The prop is exposed for edge cases (muted background ambience) but must be used with intent.

## 6. A11y

- Root `<figure>` requires no explicit ARIA role — it is a sectioning element with implicit `figure` role.
- `<audio>` must carry a descriptive `aria-label` derived from `caption` when present, otherwise the engineer surfaces a required `aria-label` prop or uses a `title` attribute.
- Caption renders as `<figcaption>` inside `<figure>` — associating the label semantically with the media without ARIA.
- Transcript link is a standard `<a>`; its visible text ("Read transcript") is the accessible name.
- `autoPlay={false}` default satisfies WCAG 1.4.2.
- Contrast: Caption uses `--fg-muted` (#6E6E73) on `--bg` (#FBFBFD) = 4.91:1 — AA normal at 14px.

## 7. Motion

None — static component. The `<audio>` playback progress bar is browser-native and not styled by the DS. The `@media (prefers-reduced-motion: reduce)` block in `tokens.css` suppresses any transitions globally; no per-component reduced-motion rule is needed.

## 8. Anti-patterns

- **Not a video player.** Use `VideoEmbed` for `<video>` / iframe embeds.
- **Not a music streaming widget.** No playlist, no queue, no album art slot. One file, one play surface.
- **Not a notification sound trigger.** `autoPlay` must not be used to play audio on page load without explicit user consent.
- **Not a `<Button>` wrapper.** The play control lives inside the native `<audio controls>`; do not replace it with a DS `<Button>`.
- **Not a form field.** `AudioPlayer` carries no `name` / `value` semantics and must not appear inside a `<form>` expecting an audio-file value.

## 9. Depends on

- `Caption` (molecule — #163) — renders the label row as `<figcaption>`.

## Open questions

- **Native control styling ceiling.** `::-webkit-media-controls-*` is non-standard and varies per browser/OS. If brand QA reveals unacceptable cross-browser divergence, a custom control layer (play/pause `<button>`, `<input type="range">`, time `<output>`) will be needed. That work is a follow-up spec; this spec approves the native-first baseline.
- **`aria-label` source.** When `caption` is absent, the `<audio>` element has no accessible label. The engineer must either require `aria-label` as a prop or derive it from `src` (file name). The preferred resolution is a required `aria-label` prop that defaults to `caption` when provided — needs confirmation before implementation.
