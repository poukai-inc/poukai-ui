# Polymorphic-prop conventions — `@poukai-inc/ui`

Component root elements in `@poukai-inc/ui` follow one of four patterns. Pick the right pattern when authoring a new component; mixing patterns on the same component is an anti-pattern the rest of this doc explains.

---

## 1. `asChild` — Radix Slot composition

**When to use.** The consumer needs to compose the component with an arbitrary element type — an `<a>`, a Next.js `<Link>`, or any component that must own the rendered node — and retain all forwarded props and behaviour. The canonical use case is any clickable primitive where the root element may need to vary without bound.

**How.** Import `Slot` from `@radix-ui/react-slot`. Expose an `asChild?: boolean` prop. When `asChild` is `true`, render `<Slot>` instead of the default element; otherwise render the default. All props flow through either path identically.

```tsx
// Button.tsx (abridged)
import { Slot } from "@radix-ui/react-slot";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ asChild = false, ...rest }, ref) {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} {...rest} />;
  },
);
```

**Consumer usage:**

```tsx
// Render Button styles on a native anchor
<Button asChild>
  <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
</Button>
```

**Trade-off.** The caller must pass exactly one child; Slot merges its props onto that child and errors at runtime if zero or multiple children are passed. The pattern is open: any element or component is accepted. This openness is the point — and the risk. Do not add `asChild` to components whose semantics would break under arbitrary element substitution.

**Components using this pattern.** `Button`, `Dialog.Trigger`, `Dialog.Close`.

---

## 2. `as` — closed root-element swap

**When to use.** The root element's tag is the only thing that varies, with no behaviour change and no need to compose arbitrary elements. The variant set is known at design time and is small. Typical purpose: semantic-only swaps where the same visual treatment is correct for two distinct landmark or sectioning elements.

**How.** Declare a closed union prop typed as `as?: "div" | "footer"` (or whatever the valid set is). Use `forwardRef<HTMLElement, Props>` — the ref type widens to `HTMLElement` because the union forces it. Alias the prop to a capitalised local variable to satisfy JSX element syntax.

```tsx
// Footer.tsx (abridged)
export const Footer = forwardRef<HTMLElement, FooterProps>(
  function Footer({ as = "div", ...rest }, ref) {
    const Root = as;
    return <Root ref={ref as React.Ref<HTMLDivElement>} {...rest} />;
  },
);
```

**Consumer usage:**

```tsx
// Inside SiteShell (SiteShell already owns the <footer> landmark)
<Footer copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />

// Standalone — Footer emits the landmark itself
<Footer as="footer" copyright="© Pouk AI INC 2026" email="hello@pouk.ai" />
```

**Trade-off.** The set of valid tags is closed; consumers cannot pass an arbitrary component. If the real need is arbitrary element composition, `asChild` is the right pattern — do not reach for `as` as a substitute.

**Components using this pattern.** `Footer` (`"div" | "footer"`), `Statement` (`"p" | "blockquote"` — the prop value names the semantic intent; internally `"p"` maps to `<div>` as the root).

---

## 3. `<slot>As` — named inner-slot element swap

**When to use.** A named inner slot — not the root — needs to vary in tag. The canonical case is a heading-level slot that must match the surrounding document outline so `<h1>` appears exactly once per page.

**How.** Declare a typed union prop named `<slot>As?:` with the valid heading levels as a string union. Render the slot element via `React.createElement(titleAs, propsForThatSlot, children)` or by aliasing the prop to a capitalised variable.

```tsx
// Hero.tsx (abridged)
export type HeroDefaultProps = HeroShared & {
  title: ReactNode;
  /** Render title inside a different element. Defaults to h1. */
  titleAs?: "h1" | "h2";
};

export const Hero = forwardRef<HTMLElement, HeroProps>(
  function Hero({ title, titleAs = "h1", ...rest }, ref) {
    const Title = titleAs;
    // ...
    return (
      <section ref={ref} {...rest}>
        <Title className={styles.title}>{title}</Title>
        {/* lede, cta, etc. */}
      </section>
    );
  },
);
```

**Consumer usage:**

```tsx
// Page where <h1> already exists earlier in the outline
<Hero
  variant="default"
  title="Technical consulting for teams shipping with AI."
  titleAs="h2"
  lede="We work alongside founders and platform teams."
/>
```

**Trade-off.** More verbose than fixing the slot to a single tag. Only worth the prop if document-outline correctness genuinely varies across usage sites. A component used exclusively as the first landmark on every page can hard-code `<h1>` without a `titleAs` prop.

**Components using this pattern.** `Hero` (`titleAs: "h1" | "h2"`).

---

## 4. No polymorphism — fixed root element

**Default choice.** Pick a single root element and hard-code it. Add polymorphism only when a concrete, recurring consumer need surfaces.

**When to use.** The component has semantic meaning that does not tolerate substitution. `<figure>` communicates self-contained media; `<aside>` communicates supplementary content; `<span>` signals inline non-interactive content. Substituting a different element would misrepresent the semantics or break the accessibility contract.

```tsx
// Tag.tsx (abridged) — root is always <span>
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  function Tag({ tone = "default", icon, children, ...rest }, ref) {
    return (
      <span ref={ref} {...rest}>
        {icon}
        {children}
      </span>
    );
  },
);
```

**Components using this pattern.** `Quote` (always `<figure>`), `FieldNote` (always `<aside>`), `Tag` (always `<span>`), `Avatar` (always `<span>`).

---

## Decision matrix

| Need | Pattern |
|---|---|
| Compose with arbitrary element or component (`<a>`, `<Link>`, etc.) | `asChild` |
| Swap root tag among a closed set, no behaviour change | `as` |
| Swap a named inner slot's tag (e.g. heading level) | `<slot>As` |
| Root is semantically load-bearing and never varies | none — fix the tag |

---

## Anti-patterns

**Mixing two polymorphic patterns on the same component.** Pick one. If a component has both `asChild` and `as`, the interaction is undefined and the mental model breaks. A component that needs arbitrary root composition (`asChild`) has no use for a closed `as` union — `asChild` subsumes it.

**Using `as` when the consumer really wants `asChild`.** A closed `as` union cannot accept a Next.js `<Link>` or a custom component. If consumers are asking to pass arbitrary elements, give them `asChild`. A closed union that grows unboundedly to accommodate new tags is a sign the wrong pattern was chosen.

**Adding `as` "just in case".** Polymorphism is scope creep until a real need exists. Start with no polymorphism. Add `as` when two distinct semantic contexts each have a documented case. Add `asChild` when arbitrary composition is the documented requirement. The cost of a prop added speculatively is paid by every future reader of the component.
