---
id: "0011"
title: "Wordmark horizontal lockup: gap widened to 40px, wordtype scaled to 1.8×"
date: "2026-05-14"
status: accepted
supersedes: "0009 (geometry lock)"
tags: [wordmark, brand, svg, lockup, geometry]
---

## Context

`0.3.1` shipped the horizontal lockup from ADR-0009. Founder review identified two problems:

1. **Gap too tight.** The 24px optical gap between isotype right edge and P left edge reads as crowding at display sizes.
2. **Wordtype too small.** Letters at scale=1 (cap-height ≈28px) read as weak against the isotype mass (rendered height ≈181px). Weight ratio ≈7:1 — letters visually subordinate to the point of illegibility at distance.

## Decision

### Gap: 40px

24px (current) reads crowded. 48px reads separated. 40px is the optical midpoint — 1/3 of the isotype's rendered width (≈116px), generous without signalling detachment. This value holds across the primary use sizes (navbar height 56px, display sizes up to ~300px wide).

### Wordtype scale: 1.8×

At 1.8×, cap-height ≈50px against isotype height ≈181px — ratio ≈0.28. This is intentionally asymmetric: the isotype is the dominant weight element in this mark, and the wordtype's role is identification, not visual competition. The 1.8× scale lifts stroke weight enough to read as commensurate with the isotype's line density without the letters overtaking the mark.

Note on the brief's 50–60% cap-height target: reaching 90–108px cap-height requires scale 3.2–3.9×, which would make letters taller than the isotype and produce a ≈6:1 viewBox. That reads as a different mark, not a corrected one. 1.8× is the right answer for this geometry. If Arian wants to revisit the isotype-to-wordtype dominance relationship more fundamentally, that is a separate brand decision.

### New viewBox: `0 0 1092 274`

Height is unchanged (274). Width derived from isotype right edge + gap + scaled wordtype span (see geometry below).

Aspect ratio: **~3.98:1** (was 2.4:1). This is a locked-geometry change — the 2.4:1 lock from ADR-0009 is superseded by this ratio. Any consumer sizing the mark by width must update.

---

## Geometry specification for the engineer

All values below are computed from the current SVG path data. The engineer applies these directly; no re-derivation needed.

### Reference measurements (unchanged)

| Item | Value | How derived |
|---|---|---|
| Isotype right edge in SVG space | ≈116px | (203−178.34)×1.7046 + 74.31 |
| Isotype vertical center in SVG space | ≈172px | (99+205)/2 → transform → matches ty=172.56 |
| Letter glyph path y-center | ≈1694.175 | (1668.40+1719.95)/2 |
| Letter glyph path y-center ≈ inner translate-y | 1694.1743 | per existing transform |

Because the letter path y-center is effectively equal to the existing inner translate-y (1694.1743), the rendered y-center of each letter glyph is simply `new_ty` regardless of scale. To keep letters centered at y≈172 (matching isotype center): **new_ty = 172.56** (unchanged from current).

### New letter group transforms

Scale S = 1.8. The new transform for each letter group is:

```
matrix(1.8 0 0 1.8 <new_tx> 172.56)
```

The inner `matrix(1 0 0 1 0 0)` and `translate(<letter_offset>, -1694.1743)` inside each group are unchanged.

**New outer tx values:**

Derivation: P left edge target = isotype_right + gap = 116 + 40 = 156px.

At scale S, rendered left edge of P = S×(inner_tx_P + path_x_left_P) + outer_tx_P.
- inner_tx_P = 805.604, path_x_left_P = −824.18
- 1.8×(805.604 − 824.18) + outer_tx_P = 156
- 1.8×(−18.576) + outer_tx_P = 156
- outer_tx_P = 156 + 33.437 = **189.44**

Remaining letters: new_tx_delta = 1.8 × original_tx_delta.

| Letter | Original outer_tx | Original delta | ×1.8 delta | New outer_tx |
|---|---|---|---|---|
| P | 158.576 | — | — | **189.44** |
| O | 262.576 | 104.000 | 187.20 | **376.64** |
| U | 367.576 | 105.000 | 189.00 | **565.64** |
| K | 467.576 | 100.000 | 180.00 | **745.64** |
| A | 570.332 | 102.756 | 184.96 | **930.60** |
| I | 655.320 | 84.988 | 152.98 | **1083.58** |

**Verification — I right edge:**
- inner_tx_I = 330.371, path_x_right_I = −327.02
- 1.8×(330.371 − 327.02) + 1083.58 = 1.8×3.351 + 1083.58 = 6.03 + 1083.58 = **1089.61**
- viewBox width = ceil(1089.61) + ~3px margin = **1092** ✓

### isotype transform: unchanged

The isotype transform `matrix(1.704562 0 0 1.70873 74.309397 172.56269)` and its two child translates are not touched.

### Summary diff

```
viewBox: "0 0 662 274"  →  "0 0 1092 274"
width attr: 662px        →  1092px
height attr: 274px       →  274px (unchanged)

Letter group outer transforms (matrix row only):
  P:  matrix(1 0 0 1 158.576 172.562434)  →  matrix(1.8 0 0 1.8 189.44 172.56)
  O:  matrix(1 0 0 1 262.576 172.562434)  →  matrix(1.8 0 0 1.8 376.64 172.56)
  U:  matrix(1 0 0 1 367.576 172.958434)  →  matrix(1.8 0 0 1.8 565.64 172.56)
  K:  matrix(1 0 0 1 467.576 172.562434)  →  matrix(1.8 0 0 1.8 745.64 172.56)
  A:  matrix(1 0 0 1 570.33157 172.562434) → matrix(1.8 0 0 1.8 930.60 172.56)
  I:  matrix(1 0 0 1 655.319526 172.562434)→ matrix(1.8 0 0 1.8 1083.58 172.56)
```

All inner group transforms (`matrix(1 0 0 1 0 0) translate(...)`) are unchanged.

---

## Release

Patch: `0.3.1 → 0.3.2`. Pure geometry — no API change, no new exports. The aspect ratio change (2.4:1 → 3.98:1) is a visual contract change for consumers sizing by width; bump rationale is the same as `0.3.0→0.3.1`.

---

## Note on the locked ratio

ADR-0009 locked 2.4:1 as the canonical ratio. This revision supersedes that lock. The new locked ratio is **~3.98:1** (`0 0 1092 274`). Further path-level or ratio changes require Arian's approval.
