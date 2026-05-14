---
id: "0009"
title: "Horizontal Wordmark lockup replaces stacked"
date: "2026-05-14"
status: accepted
tags: [wordmark, brand, svg, lockup]
---

The canonical source `brand/poukai-logo.svg` used a stacked arrangement — isotype above wordtype — within a roughly 1.9:1 viewBox. Stacked lockups compress poorly in horizontal UI contexts (navbars, headers, footers) and force excess height to preserve legibility of the mark. The horizontal form is the industry-standard primary for wordmarks used in-context.

Rearrange the path data in-place: isotype shifted to the left, six letter glyphs shifted to the right, producing a 2.4:1 horizontal lockup. No new file; the existing `brand/poukai-logo.svg` is the updated source. Released as `0.3.0` — a minor bump because the aspect-ratio change is a visual contract change for any consumer sizing the mark by width.

The stacked form is no longer the canonical lockup. If a stacked variant is needed for specific surfaces (e.g. square social avatars), it must be derived as a named variant, not treated as the default. The 2.4:1 ratio is now the locked geometry; path-level changes require Arian's approval.
