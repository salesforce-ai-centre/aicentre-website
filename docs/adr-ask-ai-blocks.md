# ADR: UI block contract & orchestration for "Ask AI Centre"

AIC2-151, part of the "Ask AI Centre" epic (AIC2-149). Decides the contract
the block renderer (AIC2-152) and everything after it depends on.

## 1. Who emits the blocks

**Decision: our `/api/agent/*` layer normalizes, not Agentforce.**

Agentforce keeps returning plain text, exactly as `message-sync/route.ts`
does today. A normalization step — added when the chat is actually wired up
(a later sub-issue) — turns "agent text + retrieved records" into a
`Block[]`.

We don't have the agent return structured JSON blocks directly, because
that requires reconfiguring the Agentforce topic/action setup in
Salesforce Setup — outside this repo, not something we can build, test, or
version here. Normalizing in our own API keeps the contract entirely in
TypeScript, testable and versioned alongside the renderer that consumes it.

## 2. Block schema

A typed discriminated union, defined in `src/types/blocks.ts`:

- `text` — `{ markdown: string }`
- `sectionHeading` — `{ title, subtitle? }`
- `card` — `{ variant: 'workshop' | 'experience' | 'space' | 'team' | 'testimonial', data }`
- `carousel` — same variants, `{ variant, items: data[] }`
- `ctaWell` — `{ heading, body?, buttonLabel, href }`

New block types or card variants are added by extending this union and the
registry in `src/components/blocks/registry.tsx` — never by changing the
renderer core (`BlockRenderer.tsx`). "Versioned" means the union lives in
one file under source control; breaking changes to an existing block's
shape should add a new variant rather than mutating one in place, so old
callers don't silently break.

## 3. Source of truth

Reused as-is, no new reconciliation layer: `src/lib/content.ts`'s
`getWorkshops` / `getExperiences` / `getSpaces` / `getTeamMembers` /
`getTestimonials` already normalize Salesforce org data and `/content/*.json`
into the single typed shapes in `src/types/content.ts`, falling back to the
static JSON only when the live fetch fails or returns empty. Block `card`/
`carousel` data is exactly those typed shapes — whichever source `getX()`
resolved to is already authoritative by the time a block is built.

## 4. Guardrails

- A block list may only contain records actually returned by a `getX()`
  call for that request — never an invented or hallucinated entity.
- When there's no confident match, the block list is a `text` block (plain
  explanation) optionally followed by a `ctaWell` linking out — never a
  fabricated card.

## Consequences

- The renderer (AIC2-152) can be built and proven today against a
  hand-authored `Block[]`, independent of any Agentforce change.
- Wiring real agent responses into this contract (parsing agent output,
  deciding which `getX()` calls to make, assembling the actual block list)
  is separate follow-up work — the "Prototype end-to-end vertical slice"
  sub-issue — and does not change this contract.
