# Migration: vX.0.0

Released: YYYY-MM-DD
Affects: &lt;which components / tokens / exports&gt;
Severity: &lt;breaking / behavior-change / cleanup&gt;

## What broke

&lt;One-paragraph summary of the breaking change(s). If multiple unrelated breaks
in one bump, separate them with H3s.&gt;

## Why we changed

&lt;Brand rationale. Link to the design spec or BACKLOG item that prompted it.&gt;

## How to upgrade

### Before (vX-1.x.x)

```tsx
<!-- working code from the previous major -->
```

### After (vX.0.0)

```tsx
<!-- updated code -->
```

### Codemod (if applicable)

&lt;Either an `npx @poukai-inc/ui-codemod ...` invocation, or a sed/jscodeshift snippet, or "manual".&gt;

## Side effects

&lt;Anything that visually or behaviorally changed beyond the API surface.&gt;

## Acknowledgements

&lt;Who flagged the need, who reviewed the breaking change, link to the originating issue/PR.&gt;

---

## Worked example: hypothetical `Field.label` → `Field.title` rename

---

# Migration: v2.0.0 (example)

Released: YYYY-MM-DD
Affects: `Field` molecule
Severity: breaking

## What broke

The `label` prop on `<Field>` has been renamed to `title`. Any usage of `<Field label="...">` will no longer compile against `@poukai-inc/ui` v2. The rendered output — the visible text above the field control — is identical; only the prop name changed.

## Why we changed

`Field.label` was ambiguous: it described the visible heading above the field control but shared its name with the `<label>` HTML element. Consumers reading the prop table could not tell whether `label` referred to the visible text or the programmatic `<label>` element that wires `htmlFor` to the input. `title` is unambiguous — it is the displayed heading. Consistent with `Section.title` and `Hero.title` across the molecule layer. The `<label>` element's `htmlFor` association remains internal to `Field` and is not a consumer-facing prop.

See `meta/design/Field.md` §8 (Prop intent) for the full rationale.

## How to upgrade

### Before (v1.x.x)

```tsx
import { Field, Input } from "@poukai-inc/ui";

<Field label="Email address" helper="We will never share your email.">
  <Input type="email" placeholder="you@example.com" />
</Field>
```

### After (v2.0.0)

```tsx
import { Field, Input } from "@poukai-inc/ui";

<Field title="Email address" helper="We will never share your email.">
  <Input type="email" placeholder="you@example.com" />
</Field>
```

### Codemod (if applicable)

A sed one-liner handles the mechanical rename across your source tree. Review the diff before committing.

```bash
# Dry run — inspect matches first
grep -r 'Field label=' src/

# Bulk replace (macOS sed — add empty string after -i on Linux)
find src -type f \( -name '*.tsx' -o -name '*.jsx' \) \
  -exec sed -i '' 's/<Field label=/<Field title=/g' {} +
```

If you use TypeScript, the compiler will surface every remaining instance after updating the package — any unpatched callsite becomes a type error on `label` (unknown prop).

## Side effects

None. The visible output is unchanged — the same text renders above the field control. No layout, spacing, or style token changed.

## Acknowledgements

Rename flagged by the brand team during the `Field` design spec review (`meta/design/Field.md`). Breaking change reviewed by poukai-design and approved by Arian. See [#000](https://github.com/poukai-inc/poukai-ui/issues/000) for the originating discussion.
