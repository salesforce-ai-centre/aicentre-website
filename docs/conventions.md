# Code conventions

Short, practical conventions to keep the codebase DRY and free of the dead-code
and duplication that the AIC2-163 cleanup removed. Enforced partly by lint (see
below), partly by review.

## Reuse before you write

- **UI**: reach for the shared components in `src/components/ui/*` (`Button`,
  `ContentCard`, `Carousel`, `SectionHeading`, `CtaWell`, `SiteFooter`,
  `PaginationDots`) before building a new one. Page-specific pieces live under
  `src/components/{about,experiences,plan}/`.
- **Design tokens**: use the Tailwind theme tokens (`text-navy`, `bg-brand`,
  `font-heading`, `rounded-card`, `page-gradient`) from `tailwind.config.ts`
  and the `--page-gradient` custom property — not raw hex.
- **Styling**: author new component styles as **CSS Modules** (`*.module.css`)
  co-located with the component, per the CSS-Modules migration (AIC2-173).
  `PhotoBand`, `CtaWell`, `MeetTheTeam`, and the experiences/plan components are
  the reference pattern.
- **Content APIs**: build Salesforce-backed routes with
  `createSalesforceRoute(...)` from `src/lib/salesforce-route.ts` — don't
  re-implement the fetch → guard → map → envelope boilerplate.
- **Shared values**: put repeated URLs / magic strings in `src/lib/constants.ts`
  (e.g. `SLACK_CHANNEL_URL`, `SLACK_REQUEST_WORKFLOW_URL`).

## Lint guardrails

`.eslintrc.json` enforces:
- `@typescript-eslint/no-unused-vars` (warn) — catches orphaned imports/vars.
  Prefix an intentionally-unused arg/var with `_` to opt out.
- `no-console` (warn) — `console.error` / `console.warn` are allowed; use them
  for genuine error handling, not `console.log` debug noise.

Run `npx next lint` before pushing.

### Optional: dead-export detection

For a periodic sweep of unused exports/files, `knip` or `ts-prune` can be run
ad-hoc (not wired into CI):

```bash
npx knip        # or: npx ts-prune
```

## Git / tickets

See [`mcp-git-workflow.md`](./mcp-git-workflow.md): one branch per epic, large
tickets branch off it, every commit references its Linear issue id.
