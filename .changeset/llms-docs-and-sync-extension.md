---
"@poukai-inc/ui": patch
---

Sync the LLM contract and consumer-facing docs with the components that have actually shipped, and extend the CI sync check so new components can no longer ship undocumented.

- `meta/llms-full.txt` (mirrored to `dist/llms-full.txt`) gains `### Statement` and `### Portrait` component sections, an `illustration` slot bullet under `### Hero`, the `--fs-statement` and `--hero-illustration-max` token entries, and the three previously-undocumented warm-accent color tokens (`--bg-warm-accent`, `--fg-on-warm`, `--fg-on-warm-muted`) that the extended sync check surfaced.
- `scripts/build-llms-txt.mjs`: `COMPONENTS.molecules` now includes `Statement` and `Portrait` (generated `dist/llms.txt` reports 11 components, not 9). Also fixes a pre-existing path-emission bug where the Exports list rendered `@poukai-inc/ui./atoms` instead of `@poukai-inc/ui/atoms`.
- `README.md`: "Components shipped today" table gains the `Statement` and `Portrait` rows.
- `scripts/check-llms-tokens-sync.mjs`: in addition to the existing color-token assertion, the script now fails CI when a component directory under `src/{atoms,molecules,organisms}/` has no matching `### ComponentName` heading in `meta/llms-full.txt`.

No runtime or public-API change; this is documentation, generated-asset, and CI-guard hardening.
