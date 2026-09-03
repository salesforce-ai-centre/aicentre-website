# Working with Figma + Linear MCPs and Git

This project is planned in **Linear** (AI Centre Team, key `AIC2`) and designed in **Figma**
(file `boywTDoA29pIQ3UghN3kw3` — "AI Centre Guide"). Most feature work is driven by an MCP tool
against one of those services. This doc defines how that work maps onto Git so the history stays
traceable back to a design and a ticket.

## TL;DR

- **One branch per epic.** e.g. `AIC2-126-design-system`.
- **Large tickets inside an epic get their own branch**, cut from the epic branch. e.g. `AIC2-134-carousel`.
- **Small tickets don't branch** — commit straight onto the epic branch, and **every commit references its issue** (e.g. `AIC2-131`).
- **Every commit message references an issue id.** No exceptions — this is how Linear links commits back to tickets.

## Branching model

```
main
 └── AIC2-126-design-system         (epic branch)
      ├── (small tickets commit here directly: AIC2-129, AIC2-131, AIC2-132, AIC2-133, AIC2-135)
      └── AIC2-134-carousel          (large ticket → own branch, merged back into the epic branch)
```

### 1. Epic branch
When starting an epic, cut a branch from `main` named `<EPIC-ID>-<slug>`:

```bash
git switch main && git pull
git switch -c AIC2-126-design-system
```

All work for that epic lands here. Open the PR from the epic branch into `main` when the epic
(or a shippable slice of it) is ready.

### 2. Ticket branches (only for large tickets)
If a single ticket is large enough to be reviewed on its own — a self-contained component, a risky
refactor, anything you'd want an isolated PR for — branch it **off the epic branch**:

```bash
git switch AIC2-126-design-system
git switch -c AIC2-134-carousel
# ...work...
git switch AIC2-126-design-system
git merge --no-ff AIC2-134-carousel
```

"Large" is a judgement call. Rule of thumb: if it's more than ~a day of work, touches many files, or
you want it reviewed independently, give it a branch. Otherwise commit directly onto the epic branch.

### 3. Small tickets
Commit directly onto the epic branch. The **issue id in the commit message** is the link — no branch
needed.

## Commit messages

Every commit must reference its Linear issue id so Linear auto-links it. Format:

```
AIC2-131 Add primary Button component (solid + outline variants)

Longer description if useful. Reference the Figma node when the change
implements a specific design, e.g. Figma node 7:60.
```

- Start the subject with the issue id (`AIC2-###`).
- One logical change per commit. A small ticket may be a single commit; that's fine.
- When a commit implements a Figma design, cite the **node id** in the body so the design source is
  discoverable (see below).

Linear also recognises `git` branch names containing an issue id and magic words in messages
(e.g. `Fixes AIC2-131`) to move issue state — use those when you want the merge to close the ticket.

## Figma MCP → code

When implementing a design:

1. Load the design-to-code guidance first (`/figma-design-to-code` skill), then call
   `get_design_context` on the specific **node id** — never hand-copy from a screenshot.
2. Extract the node id + file key from the Figma URL:
   `https://figma.com/design/<fileKey>/<name>?node-id=7-48` → `fileKey = <fileKey>`, `nodeId = 7:48`.
3. Treat the returned React+Tailwind as a **reference**. Adapt it to this project's stack
   (Next.js App Router, React 19, Tailwind 3, TS) and reuse existing tokens/components.
4. **Assets** (`api/mcp/asset/...` URLs) expire in ~7 days — download and commit real bytes, or wire
   the image to a content source. Never commit an expiring URL.
5. Record the node id in the commit body (and/or a code comment) for traceability.

### File-key + node reference for this project
- File key: `boywTDoA29pIQ3UghN3kw3`
- About page frame: `7:48`
- Experiences page frame: `14:446`

## Linear MCP → tickets

- **Epics** are issues prefixed `[Epic]`; delivery tickets are **sub-issues** of the epic (via
  `parentId`).
- Model real ordering with **blocks / blocked-by** relations, not just prose.
- Keep an issue's status in step with the branch: move it to **In Progress** when you start the branch,
  **Done** when the work merges (or let a `Fixes AIC2-###` commit do it).
- Decisions that must be made before safe implementation get the **Product decision** label.

## Design tokens

The redesign's shared tokens live in `tailwind.config.ts` (colours, gradients, fonts) and
`globals.css` (component classes). Use the semantic tokens — `text-navy`, `bg-brand`,
`bg-page-gradient`, `font-heading` — rather than raw hex, so the palette stays single-sourced.

See [`conventions.md`](./conventions.md) for the wider reuse / DRY conventions and the lint
guardrails that back them.
