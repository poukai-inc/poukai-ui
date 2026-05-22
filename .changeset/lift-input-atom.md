---
"@poukai-inc/ui": minor
---

Lift `Input` to the atom layer.

`Input` is now an atom at `src/atoms/Input/` with a new `size` prop (`"sm" | "md" | "lg"`, default `"md"`) that maps to the shared `--btn-h-*` height ladder, so `<Input>` visually pairs with `<Button>` at matching sizes.

**Migration:** consumers importing from `@poukai-inc/ui/molecules/Input` should switch to `@poukai-inc/ui/atoms/Input`. The `./molecules/Input` subpath and the root `@poukai-inc/ui` export are unchanged in 1.x. The molecule path will be removed in 2.0.

```diff
- import { Input } from "@poukai-inc/ui/molecules/Input";
+ import { Input } from "@poukai-inc/ui/atoms/Input";
```
