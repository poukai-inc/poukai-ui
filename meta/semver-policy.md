# Semver policy — `@poukai-inc/ui`

`@poukai-inc/ui` follows [SemVer 2.0.0](https://semver.org/) strictly from 1.0.0 onward. The frozen surface that semver governs is defined in `meta/milestones/1.0.0.md` §2. This document translates that definition into concrete bump-type rules.

---

## Versioning

The package version encodes a promise to consumers about what changed:

- **Major (X.0.0)** — something a consumer depended on was removed, renamed, or had its runtime semantics altered. Upgrade requires action.
- **Minor (0.X.0)** — something new was added; no existing usage breaks. Upgrade is safe and additive.
- **Patch (0.0.X)** — a bug was fixed or a visual value was refined within the documented contract. Upgrade is transparent.

See the **Pre-1.0 exception** section below for how the current `0.x` series differs.

---

## Major bump (X.0.0) triggers

Any of the following requires a major version bump:

- Removing or renaming a prop on a shipped component
- Removing or renaming a CSS custom property (token) in `src/tokens/tokens.css`
- Removing a subpath export (`@poukai-inc/ui/atoms`, `/molecules`, `/organisms`, `/tokens`, `/llms.txt`, `/llms-full.txt`) or any public symbol from a subpath
- Changing the runtime semantic of a prop — for example, flipping a default value in a way that changes the rendered output for a consumer who passes nothing
- Changing the root element of a component (e.g. `<div>` becomes `<section>`) — this alters the accessible role and DOM contract
- Increasing the minimum required React peer dependency version
- Any change that causes a consumer's TypeScript project to fail compilation against the previous major's type definitions

When in doubt about whether a change is major, treat it as major. The cost of a false negative is a silent consumer breakage.

---

## Minor bump (0.X.0) triggers

Any of the following is a minor version bump:

- Adding a new component (atom, molecule, or organism)
- Adding a new prop to an existing component, provided the prop has a non-breaking default so existing usage compiles and renders identically
- Adding a new CSS custom property to `src/tokens/tokens.css`
- Adding a new value to a union prop (e.g. a new `variant` string) — consumers using other values are unaffected
- Adding a new subpath export
- Performance optimizations that preserve the observable contract (same rendered output, same prop API, same token values)
- New stories, tests, or documentation — no change to the consumer-facing surface

---

## Patch bump (0.0.X) triggers

- Bug fixes that preserve the documented contract — the fix corrects behavior to match the spec, not to introduce new behavior
- CSS visual refinements where the token name and prop API are unchanged and the delta is imperceptible at normal viewing conditions
- Internal refactors that are invisible to consumers: no prop rename, no token rename, no DOM structure change that alters accessible roles

---

## Changeset rules

Every PR that changes the consumer-facing surface — props, tokens, exports, or runtime behavior — must include a changeset:

```bash
pnpm changeset
```

The changeset type (major / minor / patch) must match the rules above. A PR that claims `patch` for a prop rename will be rejected in review.

PRs that contain only documentation updates, test additions, story additions, or CI configuration changes may omit the changeset. This must be stated explicitly in the PR description: "No consumer-surface change — changeset omitted."

---

## Deprecation policy

A prop or token is never silently removed. The deprecation lifecycle is:

1. **Announce** — the prop or token is marked `@deprecated` in its JSDoc comment. A `console.warn` fires in development mode (gated on `process.env.NODE_ENV !== 'production'` or `import.meta.env.DEV`). The migration path — what to use instead — is documented in the warn message and in the release changeset. This ships as a **minor** bump.
2. **Remove** — the deprecated prop or token is removed in the next release that warrants a major bump. The removal is documented in the matching `meta/migrations/<version>.md` guide.

The minimum gap between deprecation and removal is one minor version. Deprecating and removing in the same release is not permitted.

---

## Pre-1.0 exception

Until `1.0.0` ships (gate criteria in `meta/milestones/1.0.0.md` §3), the package is on `0.x`. During `0.x`:

- **Prop renames are minor, not major.** This reflects the practical reality that the contract was not yet formally frozen and consumers are expected to track the library closely.
- All other rules above apply: additions are minor, bug fixes are patch, removals are minor.

Once `1.0.0` is tagged, the pre-1.0 exception is gone. Prop renames and removals are major from that point forward, unconditionally.

Consumers building on `0.x` should treat each minor release as potentially containing rename-level changes and review changelists carefully before upgrading.
