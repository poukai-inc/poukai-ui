---
id: "0008"
title: "SiteShell Wordmark height raised from 28 to 56"
date: "2026-05-14"
status: accepted
tags: [siteshell, wordmark, brand, sizing]
---

The `<Wordmark height={28} />` default in SiteShell rendered the brand mark at footnote scale — half the size used on the holding page, which applied `clamp(3.5rem, 2.5rem + 2vw, 4.5rem)` (56–72 px). At 28 px the mark lacked visual authority in the navigation context and was inconsistent with the holding-page precedent already established in the live site.

Raise the SiteShell `Wordmark` height default to `56`, matching the holding-page lower bound. Shipped in `0.2.3` against issue #10.

56 px is the floor, not a lock. The clamp behavior from the holding page is not replicated inside SiteShell — responsive scaling above 56 px remains a future concern. Any consumer passing an explicit `height` prop overrides this default as before.
