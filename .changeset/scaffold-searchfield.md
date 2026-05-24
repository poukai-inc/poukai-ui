---
"@poukai-inc/ui": minor
---

feat(molecule): add SearchField — Input with leading search icon and trailing clear button

Implements the SearchField molecule per `meta/design/SearchField.md`. Composes `Field`, `Input` (type="search"), `Icon` (Search, leading, decorative), and `IconButton` (X, trailing, "Clear search"). Root carries `role="search"` landmark. Clear button renders only when value is non-empty. Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes. `size="sm"|"md"`, `disabled`, `label`, `name`, `placeholder` props. Escape key clears the field. All existing token budget preserved; no new tokens introduced.
