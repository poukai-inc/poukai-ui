# Pouk AI brand decision log

> Maintained by the `poukai-design` agent. Authoritative for tokens, fonts, palette, motion, and mark rules. Every change to `src/tokens/tokens.css` lands here in the same commit.

## Foundations

### Color — primary, surface, semantic — with rationale and AA/AAA contrast pairs.

Pouk AI's color foundation is Apple's restrained Human Interface palette: SF system grays with Apple Blue as the only accent. The neutral ramp is deliberately compressed — there's only as much chroma as the operator-grade register can carry without becoming generic SaaS.

**Non-negotiable rule.** Neither end of the neutral ramp is pure. `--fg` pulls slightly off `#000` and the page `--bg` pulls slightly off `#FFFFFF`. Pure `#FFFFFF` is reserved exclusively for `--bg-elevated` — the front-most layer (popovers, sheets, modals, dialogs). This gives elevation headroom on the page and ensures the palette inverts cleanly to dark mode (see "Dark-mode direction" in `Decision history → 2026-05-15`).

#### Canonical light palette

| Token           | Value                  | Purpose                                                      | Allowed pairings (text on this surface)                                                      | Contrast ratios verified                                                                                                                                              |
| --------------- | ---------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`          | `#FBFBFD`              | Page background. The default canvas.                         | `--fg` (primary), `--fg-muted` (secondary), `--accent` (links / focus, all text sizes at AA) | `--fg` on `--bg` = **16.29 : 1** (AAA); `--fg-muted` on `--bg` = **4.91 : 1** (AA normal); `--accent` on `--bg` = **4.54 : 1** (AA normal — at threshold)             |
| `--surface`     | `#F5F5F7`              | Recessed elevation. Code blocks, quote blocks, inline keys.  | `--fg`, `--fg-muted`. Not for `--accent` text below 18px.                                    | `--fg` on `--surface` = **15.46 : 1** (AAA); `--fg-muted` on `--surface` = **4.66 : 1** (AA normal)                                                                   |
| `--bg-elevated` | `#FFFFFF`              | Front-most layer. Popovers, sheets, dialogs, dropdown menus. | `--fg`, `--fg-muted`, `--accent`                                                             | `--fg` on `--bg-elevated` = **16.83 : 1** (AAA); `--fg-muted` on `--bg-elevated` = **5.07 : 1** (AA normal); `--accent` on `--bg-elevated` = **4.69 : 1** (AA normal) |
| `--fg`          | `#1D1D1F`              | Primary text, wordmark stroke, sigil stroke.                 | On `--bg`, `--surface`, `--bg-elevated`                                                      | See above. AAA on every surface.                                                                                                                                      |
| `--fg-muted`    | `#6E6E73`              | Secondary copy: footer, captions, lede paragraphs, metadata. | On all three surfaces.                                                                       | See above. AA normal on every surface; comfortable headroom on `--bg-elevated` (5.07 : 1), tighter on `--surface` (4.66 : 1).                                         |
| `--hairline`    | `#D2D2D7`              | 1px dividers, table rules, borders.                          | Non-text; no contrast requirement for decorative rules.                                      | n/a — decorative. Reads as a true hairline on all three surfaces.                                                                                                     |
| `--accent`      | `#0071E3`              | Status dot, link underline, focus ring, primary CTAs.        | Use for non-text UI freely. For text, prefer 17px+ or against `--bg-elevated`.               | See above. WCAG 1.4.11 non-text contrast is satisfied on every surface (focus rings, status dots).                                                                    |
| `--accent-glow` | `rgba(0,113,227,0.18)` | Selection background, soft accent halos.                     | Background only — never carries text.                                                        | n/a — decorative.                                                                                                                                                     |

**Elevation rhythm.** Read relative luminance left-to-right: `--surface (L≈0.914) < --bg (L≈0.966) < --bg-elevated (L=1.000)`. The page sits between a recessed surface (for inline blocks) and an elevated surface (for overlays). This bidirectional rhythm — recess down, elevate up — is the Apple model and the reason `--surface` does not shift in this change.

**Math.** Contrast ratios above are computed against the WCAG 2.1 sRGB linearization (`C_lin = C/12.92` for `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`) and the `(L1 + 0.05)/(L2 + 0.05)` ratio formula. Verified independently of the brand decision.

### Typography — headline and body face, rationale, type scale, line-height.

_To be filled. For each face: rationale (why this face, why now), scale (token → use), line-height, tracking notes._

### Spacing — scale and rhythm rules.

_To be filled. The scale itself + the rules for picking values (when to escalate from `--space-4` to `--space-8`, etc.)._

### Motion — default easing, default duration, principles.

_To be filled. Default easings + durations + principles (e.g. "no animation without semantic meaning", reduced-motion fallback)._

### Brand marks — Wordmark, isotype, lockup rules.

_To be filled. Wordmark vs. isotype vs. stacked lockup — when each is used, sizing rules, clear-space rules, on-light vs. on-dark variants._

---

## Evolution rules

_To be filled. When can a token change vs. add? What requires Arian's approval? What's reversible? What invalidates a release?_

---

## Decision history

_Reverse-chronological. Each entry: context, decision, rationale, alternatives considered, approval (Arian)._

### 2026-05-15 — Pull `--bg` off pure white; reserve `#FFFFFF` for `--bg-elevated`

**Context.** The light ramp shipped through `0.5.0` used `--bg: #FFFFFF`. That collapses the elevation model: there is no headroom above the page, popovers and sheets cannot read as "front-most" without inventing a non-token shadow or a borrowed lighter neutral, and the dark-mode inversion has no clean answer — pure white inverts to pure black, which the §6 rule prohibits. Arian flagged this as a brand-level issue with `#FAFAFA` or `#FBFBFD` as candidate values for the new page background.

**Principle.** Neither end of the neutral ramp is pure. The ramp must support a three-step elevation rhythm — recessed `--surface`, page `--bg`, elevated `--bg-elevated` — and must invert into dark mode without losing its restraint. `#FFFFFF` is reserved exclusively for the front-most layer; it never carries the page.

**Decision.** New light-mode token values:

| Token           | Old (`0.5.0`)     | New (this change)     |
| --------------- | ----------------- | --------------------- |
| `--bg`          | `#FFFFFF`         | **`#FBFBFD`**         |
| `--bg-elevated` | _(did not exist)_ | **`#FFFFFF`**         |
| `--surface`     | `#F5F5F7`         | `#F5F5F7` (unchanged) |
| `--fg`          | `#1D1D1F`         | `#1D1D1F` (unchanged) |
| `--fg-muted`    | `#6E6E73`         | `#6E6E73` (unchanged) |
| `--hairline`    | `#D2D2D7`         | `#D2D2D7` (unchanged) |
| `--accent`      | `#0071E3`         | `#0071E3` (unchanged) |

**Why `#FBFBFD` over `#FAFAFA`.** `#FBFBFD` is the exact background Apple ships on `apple.com` and across most of their marketing surfaces. It carries the faintest cool tint (B channel `0xFD` vs R/G at `0xFB`) which reads as "considered" rather than "off-white"; `#FAFAFA` is the generic Material/Tailwind neutral and is perceptibly warmer-yellower against `#F5F5F7`. The cool tint also gives more visible separation against `--bg-elevated` (`#FFFFFF`, neutral) — the elevation step reads in chroma as well as luminance, which matters at the ~3-luminance-point delta we have at the top of the ramp. Trade-off: `#FBFBFD` is closer to pure white than `#FAFAFA`, so the recess delta to `--surface` (`#F5F5F7`) is slightly more pronounced; on the page that reads as Apple-correct, not as a problem.

**Why `--surface` does not shift.** The rhythm `--surface (L≈0.914) < --bg (L≈0.966) < --bg-elevated (L=1.000)` reads cleanly with `--surface` unchanged. Shifting `--surface` (e.g. to `#F2F2F4` to "preserve the delta") would over-darken inline blocks — Apple's SF system gray 6 is `#F2F2F7`/`#F5F5F7` for a reason: code blocks and quote blocks need to recess, not announce themselves. The page change alone gives us the headroom.

**AA / AAA contrast verification (sRGB relative luminance per WCAG 2.1):**

Relative luminances (linearization: `C_lin = C/12.92` for `C ≤ 0.04045`, else `((C+0.055)/1.055)^2.4`):

- `#1D1D1F` → L ≈ 0.01238
- `#6E6E73` → L ≈ 0.15711
- `#0071E3` → L ≈ 0.17370
- `#F5F5F7` → L ≈ 0.91432
- `#FBFBFD` → L ≈ 0.96615
- `#FFFFFF` → L = 1.00000

Contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`:

| Pair                            | Ratio                                                                 | WCAG verdict                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--fg` on `--bg`                | `(0.96615+0.05) / (0.01238+0.05) = 1.01615 / 0.06238` ≈ **16.29 : 1** | AAA (≥ 7) — passes for all text sizes                                                                                     |
| `--fg` on `--surface`           | `0.96432 / 0.06238` ≈ **15.46 : 1**                                   | AAA                                                                                                                       |
| `--fg` on `--bg-elevated`       | `1.05000 / 0.06238` ≈ **16.83 : 1**                                   | AAA                                                                                                                       |
| `--fg-muted` on `--bg`          | `1.01615 / 0.20711` ≈ **4.91 : 1**                                    | AA normal (≥ 4.5). Below AAA — acceptable for muted secondary copy.                                                       |
| `--fg-muted` on `--surface`     | `0.96432 / 0.20711` ≈ **4.66 : 1**                                    | AA normal. Tighter than `--bg`/`--bg-elevated`; long paragraph runs are fine but the headroom is smaller.                 |
| `--fg-muted` on `--bg-elevated` | `1.05000 / 0.20711` ≈ **5.07 : 1**                                    | AA normal — comfortable headroom.                                                                                         |
| `--accent` on `--bg`            | `1.01615 / 0.22370` ≈ **4.54 : 1**                                    | AA normal — passes at threshold. Safe for links, focus rings, and body copy at any size; prefer 17px+ when targeting AAA. |
| `--accent` on `--surface`       | `0.96432 / 0.22370` ≈ **4.31 : 1**                                    | AA large (≥ 3) and AA UI (1.4.11 ≥ 3). Below AA-normal — keep `--accent` text on `--surface` to 18px+ (or 14px+ bold).    |
| `--accent` on `--bg-elevated`   | `1.05000 / 0.22370` ≈ **4.69 : 1**                                    | AA normal                                                                                                                 |

The only sub-AA-normal text pairing in the system is `--accent` on `--surface` (4.31 : 1, below the 4.5 threshold for normal text). All other text pairings pass AA normal across all three surfaces. The `--fg-muted` row is consistently AA normal everywhere — tighter on `--surface` (4.66 : 1) than on `--bg-elevated` (5.07 : 1), so prefer the elevated surface for long muted runs when feasible, but neither is at threshold.

**Proposed dark-mode direction (sketch — not shipped).**

Token names (recommended): keep the same canonical names (`--bg`, `--surface`, `--bg-elevated`, `--fg`, `--fg-muted`, `--hairline`, `--accent`, `--accent-glow`) and override them inside a media query and an explicit selector. The override block lives in `tokens.css` and shifts values without forking the token namespace.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1c1c1e; /* Apple iOS system background, never #000 */
    --surface: #2c2c2e; /* one step up, recessed surface for inline blocks */
    --bg-elevated: #3a3a3c; /* Apple "tertiary background" — front-most layer */
    --fg: #f5f5f7; /* primary text — symmetric to light --surface */
    --fg-muted: #98989d; /* SF muted gray */
    --hairline: #38383a; /* dark separator */
    --accent: #0a84ff; /* Apple Blue, dark-mode variant (brighter) */
    --accent-glow: rgba(10, 132, 255, 0.22);
  }
}

[data-theme="dark"] {
  /* same overrides — explicit toggle escape hatch */
}
[data-theme="light"] {
  /* explicit overrides back to light values, for forcing light in a dark OS */
}
```

The elevation rhythm inverts cleanly: in dark mode, `--bg-elevated` is _brighter_ than `--bg`, matching the light-mode pattern (overlays come forward, away from the page). The non-pure-edges rule holds: `--bg` is `#1C1C1E` (Apple iOS exact), not `#000`.

**Alternatives considered.**

1. **Dark-mode peer tokens (`--bg-dark`, `--fg-dark`, etc.).** Rejected. Forces every component CSS module to switch tokens by mode — defeats the purpose of having a single canonical name. Token names are the design contract; mode is a runtime concern.
2. **CSS `light-dark()` function.** Tempting — single declaration per token (`--bg: light-dark(#FBFBFD, #1C1C1E)`) — but Baseline support is recent (Safari 17.5+, Chrome 123+, Firefox 120+) and gives no escape hatch for `[data-theme]` overrides without falling back to overrides anyway. Re-evaluate in 6–12 months; for now, the `@media + [data-theme]` pair is the safer mainstream pattern and matches how the rest of the system is authored.
3. **Pure `:root` override under `[data-theme="dark"]` only (no media query).** Rejected — defaults should respect user OS preference unless explicitly overridden. The `@media` block is the default; `[data-theme]` is the override.

**Alternatives considered for `--bg` value.**

- `#FAFAFA` — Material/Tailwind neutral. Generic; warmer than Apple's spec; would read as a "framework default" against the rest of the palette.
- `#F8F8FA` — would compress the page/surface delta to ~2 luminance points, making the surface recess invisible.
- `#FFFFFF` (status quo) — violates the §6 brand rule and breaks the elevation model. The decision that started this change.

**Visual change tradeoff.** Approved by Arian: minor bump with a deliberate changelog entry calling out the page background shift. Every consuming page will get a faintly cooler canvas; the wordmark, primary text, and surface blocks remain pixel-identical. Pages that relied on `--bg` being literal `#FFFFFF` (e.g. for a popover sitting flush against the page) should opt into `--bg-elevated` — see "Follow-ups for `poukai-ds-engineer`" below.

**Follow-ups for `poukai-ds-engineer` (not actioned by this change).**

- Audit `src/atoms/**` and `src/molecules/**` for components that should opt into `--bg-elevated` rather than `--bg`. Candidates by intent: any popover/sheet/dialog primitive (none shipped yet, but the StatusBadge background may want to flip); any "card-on-page" pattern that should read as elevated (e.g. a future `Card` molecule). RoleCard, Hero, Principle, FailureMode currently inherit page background — they should stay on `--bg` (they are page content, not elevated overlays).
- `src/molecules/RoleCard/RoleCard.module.css:25` uses `background: var(--bg)` — leave as-is for now (the card is page-level, not elevated). Flag for revisit when a `Card` molecule lands: if RoleCard is meant to read as elevated relative to the page, flip to `--bg-elevated`.
- `src/stories/showcase/System.stories.tsx:40` hardcodes the documented `--bg` swatch as `#FFFFFF`. Update to `#FBFBFD` so the docs match runtime. (Designer doc, but stories live in engineer-owned `src/stories/**`.)
- `src/brand/site.webmanifest` declares `"theme_color":"#ffffff"` and `"background_color":"#ffffff"`. Consider updating to `#fbfbfd` so the PWA install / browser chrome matches the page canvas. Low-priority — no current consumer.
- The semantic-mappings block in `tokens.css` (`body { background: var(--bg); … }`) is correct as-is. No token swap needed there — the page _should_ use `--bg`, not `--bg-elevated`. Likewise `src/organisms/SiteShell/SiteShell.module.css:6` (`background: var(--bg)`) is correct: SiteShell is the page frame, not an overlay.
- `src/atoms/Button/Button.module.css:53` uses `color: var(--bg)` for text on a `--fg`-coloured button surface. After the shift, contrast = `--bg (#FBFBFD)` on `--fg (#1D1D1F)` ≈ **16.29 : 1** (AAA, unchanged in tier). No action needed; recorded for traceability.
- Confirm `::selection { background: var(--accent-glow); }` still reads correctly on the new `--bg`. Math says yes (the glow is alpha-blended over a near-white surface that is 1.7 luminance points darker than before — imperceptible), but eyeball it on the site once shipped.

**Approval.** Arian (pending).
