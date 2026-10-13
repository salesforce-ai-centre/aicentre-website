# CSS Modules convention

Part of the Tailwind → CSS Modules migration ([AIC2-173](https://linear.app/eventsmobileapp/issue/AIC2-173)).
New component styling is authored as CSS Modules; Tailwind utilities coexist until the
migration finishes (AIC2-179 removes Tailwind entirely).

## Reference example

[`src/components/about/PhotoBand.module.css`](../src/components/about/PhotoBand.module.css) +
[`PhotoBand.tsx`](../src/components/about/PhotoBand.tsx) is the pattern to copy.

## File naming & colocation

- One `Component.module.css` per `Component.tsx`, same directory, same base name.
- Class names are lowercase or camelCase (`.section`, `.imageWrapper`, `.badgeLeft`) — no
  BEM-style dashes or underscores.
- Import as `import styles from './Component.module.css'` and reference classes as
  `styles.section`, `styles.imageWrapper`, etc.

## Composing an external `className` prop

Components that accept a `className` prop (for a caller to extend/override) merge it with
their own module class via a template literal, as in
[`CtaWell.tsx`](../src/components/ui/CtaWell.tsx):

```tsx
<section className={`${styles.well} ${className}`.trim()}>
```

Toggling between two module classes based on a prop (e.g. a variant or active state) follows
the same pattern — pick the class in JS, don't encode the condition in CSS:

```tsx
className={`${styles.item} ${snapAlign === 'center' ? styles.snapCenter : styles.snapStart}`}
```

## Consuming design tokens

Shared values (brand colour, navy, fonts, card radius/shadow, page gradient) are defined once
as CSS custom properties in `:root` in [`globals.css`](../src/app/globals.css) (AIC2-174).
Reference them with a literal fallback matching the token, so the module still renders
correctly if loaded before `globals.css`:

```css
color: var(--navy, #001e5b);
font-family: var(--font-heading, 'Avant Garde For Salesforce', sans-serif);
border-radius: var(--radius-card, 16px);
```

Don't hardcode a raw hex/value that duplicates a token — use the `var()` form even for a
one-off, so a future token change propagates.

## Responsive / media queries

Plain `@media` queries at the breakpoints Tailwind already uses elsewhere in the app, so
behaviour matches surrounding Tailwind-authored components during coexistence:

- `(min-width: 640px)` — Tailwind's `sm:`
- `(min-width: 1024px)` — Tailwind's `lg:`

```css
.heading {
  font-size: 2.25rem;
}

@media (min-width: 1024px) {
  .heading {
    font-size: 3rem;
  }
}
```

## Shared patterns (buttons, cards)

Don't re-duplicate shared visual patterns (button variants, card shells) inside page-specific
modules — reach for the existing `src/components/ui/*` components (`Button`, `ContentCard`,
`SectionHeading`, `CtaWell`, `Carousel`, `PaginationDots`) first, per
[`conventions.md`](./conventions.md). Only write new module CSS for layout/visuals specific to
one component.

## JS-computed values

Values that depend on runtime state or breakpoint-specific JS calculations (e.g. `PhotoBand`'s
per-tile size/rotation) stay as inline `style={{...}}`, not CSS — module CSS only holds static
structural rules plus the occasional media query.
