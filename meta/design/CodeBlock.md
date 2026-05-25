# CodeBlock

**Status**: Approved

## 1. Intent

`CodeBlock` is the molecule for displaying fenced code — a scrollable `<pre><code>` block with an optional language label and an integrated `CopyButton`. It serves documentation pages, changelogs, API reference surfaces, and any editorial surface that needs to present multi-line code samples in a consistent, branded container. The DS ships plain semantic markup; syntax highlighting is explicitly the consumer's concern via an injected highlighter, keeping the primitive free of opinionated third-party dependencies.

## 2. Anatomy

```
┌─────────────────────────────────────────────┐
│ [language label — top-right]   [CopyButton] │  ← header bar (optional)
├─────────────────────────────────────────────┤
│ <pre>                                        │
│   <code>                                     │
│     const x = 1;                             │
│   </code>                                    │
│ </pre>                                       │
└─────────────────────────────────────────────┘
```

- **Root**: `<figure>` — semantic block container for a self-contained code sample.
- **Header bar**: flex row, conditionally rendered when `language` or `CopyButton` is present. Sits above the code pane, flush with the container top.
- **Language label**: `<span>` at leading end of the header bar. Plain text, `--fs-micro` / `--font-mono`, `--fg-muted`. Optional — absent when no `language` prop is passed.
- **CopyButton slot**: trailing end of the header bar. The `CopyButton` molecule. Hidden when `hideCopy` is set.
- **Code pane**: `<pre>` with `<code>` inside. Inherits `--font-mono`, `--fs-meta` size, `--surface` background. Horizontal overflow scrolls; no wrapping.
- **Caption slot**: optional `<figcaption>` below the code pane for attribution or file-path labels.

## 3. Tokens

- `--surface` — code pane background
- `--hairline` — 1px border around the container
- `--hairline-w` — border width
- `--radius-3` — container corner radius (8px)
- `--font-mono` — Geist Mono; applied to `<pre>` and language label
- `--font-sans` — applied to any prose in the caption slot
- `--fs-meta` — code text size (14px; legible, compact)
- `--fs-micro` — language label size (12px; clearly subordinate)
- `--fg` — code text color
- `--fg-muted` — language label color
- `--space-2` — gap between language label and CopyButton
- `--space-3` — header bar vertical padding
- `--space-4` — code pane padding (all sides)
- `--lh-body` — line-height for code lines (1.55; readable in vertical scan)

## 4. Variants / Props

| Prop        | Type                     | Default     | Rationale                                                                                     |
| ----------- | ------------------------ | ----------- | --------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`              | —           | The code content. Plain string idiomatic; also accepts pre-highlighted markup from consumer.  |
| `language`  | `string \| undefined`    | `undefined` | Short language identifier (e.g. `"tsx"`, `"bash"`). Renders the language label when provided. |
| `hideCopy`  | `boolean`                | `false`     | Suppresses the CopyButton. For decorative/display-only snippets where copy is noise.          |
| `caption`   | `ReactNode \| undefined` | `undefined` | Rendered as `<figcaption>` below the pane. File path, attribution, or explanatory note.       |
| `className` | `string \| undefined`    | `undefined` | Merged via `clsx` onto the root `<figure>`. Consumer layout override.                         |

No size ladder. Code blocks fill their container width. Height grows with content; consumers constrain height externally if truncation is needed.

## 5. Interaction

- **Scroll**: horizontal overflow on `<pre>` scrolls; no line wrapping. Vertical overflow grows naturally.
- **CopyButton**: see `CopyButton` spec for idle → success state machine and timeout revert (~1.5s).
- **Keyboard**: no custom keyboard handling on the block itself. `<pre>` is not focusable by default. CopyButton is a standard button and is Tab-reachable.
- **Mouse**: no hover treatment on the code pane. CopyButton hover is owned by the `CopyButton` molecule.

## 6. A11y

- Root `<figure>` with optional `<figcaption>` — standard figure semantics; screen readers associate the caption with the code block.
- `<pre><code>` — `<code>` carries implicit `role="code"` in ARIA 1.2; readable by screen readers as a code region.
- Language label `<span>` is decorative/supplemental; no ARIA role needed. If the label is the only indication of language for a consumer's context, they may add `aria-label` to the `<code>` element via `children`.
- `CopyButton` exposes its own accessible label (`aria-label="Copy"` / `"Copied"`) — see `CopyButton` spec.
- Contrast: `--fg` (#1D1D1F) on `--surface` (#F5F5F7) = 15.46:1 (AAA). `--fg-muted` (#6E6E73) on `--surface` = 4.55:1 (AA normal at 12px — passes).

## 7. Motion

- No motion on the CodeBlock container itself. Static block.
- CopyButton icon-swap transition is owned by `CopyButton`; it respects `prefers-reduced-motion` per that spec.
- Global `@media (prefers-reduced-motion: reduce)` block in `tokens.css` clamps all transitions — no CodeBlock-specific reduced-motion rule needed.

## 8. Anti-patterns

- **Not for inline code.** A single variable name or short function call inline in prose belongs in the `Code` atom (`<code>`), not `CodeBlock`.
- **Not a syntax highlighter.** The DS ships no highlighting library. Do not bundle `highlight.js`, `prism`, or `shiki` into this primitive.
- **Not a diff viewer.** Added/removed line indicators, gutter line numbers, and diff decorations are out of scope. A `Diff` variant may be specced separately.
- **Not for arbitrary long-form prose.** `<pre>` preserves whitespace and uses monospace; do not place non-code content inside the code pane.
- **Not a terminal emulator.** Animated cursor, shell prompt styling, and ANSI color sequences are not part of this spec.

## 9. Depends on

- `Code` atom — semantic `<code>` element inside `<pre>`.
- `CopyButton` molecule — copy-to-clipboard with idle/success state.

## Open questions

- **`Code` atom existence**: the spec lists `Code` as a dependency, but no `Code` atom spec is confirmed in the current DS. If `Code` is simply an unstyled semantic `<code>` element, `CodeBlock` can render it directly without a DS atom wrapper. Clarify whether a standalone `Code` atom spec exists or is needed before implementation.
