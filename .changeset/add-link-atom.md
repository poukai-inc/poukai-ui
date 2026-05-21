---
"@poukai-inc/ui": minor
---

Add `Link` atom — canonical styled anchor with three variants and `asChild` Radix Slot composition.

**What ships:**

- `<Link href variant="default|quiet|muted-link" asChild>` — named, versioned anchor atom in `src/atoms/Link/`.
- `variant="default"` — two-layer underline grow (accent over hairline), direct transcription of the global `a` rule in `tokens.css`.
- `variant="quiet"` — single-layer underline on hover only; no hairline at rest. Correct technique: pre-declared 0%-wide accent layer so the grow interpolates rather than snaps.
- `variant="muted-link"` — `color: var(--fg-muted)` at rest, `color: var(--fg)` on hover, plain `color` transition. Byte-for-byte match of the global `.muted-link` utility class — the migration target for `SiteShell`, `Footer`, and story fixtures.
- `asChild` via `@radix-ui/react-slot` — compose DS styles onto a framework router Link (Next.js, Remix, etc.).
- Auto `rel="noopener noreferrer"` when `target="_blank"` and no explicit `rel` is provided; consumer-supplied `rel` always wins.
- `href` is required at the TypeScript level (`Omit<AnchorHTMLAttributes, 'href'> & { href: string }`).
- Exported from `@poukai-inc/ui`, `@poukai-inc/ui/atoms`, and `@poukai-inc/ui/atoms/Link` subpath.

**Migration note — global `.muted-link` class:**
The `.muted-link` global utility class in `src/tokens/tokens.css` is NOT removed in this PR. Confirmed call sites (`SiteShell.tsx`, `Footer.tsx`, `SiteShell.stories.tsx`, `a11y.test.tsx`, and others) must migrate to `<Link variant="muted-link">` in a follow-up audit PR with Arian's sign-off, after confirming no remaining consumers in the site repo reference the global class directly.
