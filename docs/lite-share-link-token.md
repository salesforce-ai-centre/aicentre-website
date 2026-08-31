# Lite share link — signed token contract

This is the contract any system must follow to mint a **lite** (client-safe)
share link that the website will accept. It exists so link generation can live
wherever the team decides — the existing Slack/Salesforce workflow, a secured
site endpoint, or both — without the website needing to change.

Status: contract implemented on the **verify** side (AIC2-157). The **mint**
side location is an open team decision — see the accompanying Linear ticket.

## The link

A lite share link is a normal URL to a lite-visible page (currently `/` or
`/experiences`) with four query params:

```
https://<host>/?ts=<ms>&sig=<hex>&scope=lite&exp=<ms>
```

| Param   | Meaning                                                              |
|---------|---------------------------------------------------------------------|
| `ts`    | Sign time, Unix epoch **milliseconds**.                             |
| `sig`   | HMAC-SHA256 hex digest of the signed message (below).               |
| `scope` | `lite` (or `full`). Omitted entirely for legacy full links.         |
| `exp`   | Absolute expiry, Unix epoch **milliseconds**. Link invalid after.   |

The path portion signed is the URL pathname **without its leading slash**
(e.g. `/experiences` → `experiences`; the site root `/` → empty string `""`).

## Signed message

```
message = `${path}:${ts}:${scope}:${exp}`
sig     = hex( HMAC_SHA256(SIGNED_URL_SECRET, message) )
```

Notes:
- The scope and expiry are **inside** the signed message, so a client cannot
  edit `scope=lite` → `scope=full` or extend `exp` without breaking `sig`.
- **Legacy exception:** a full-access link with no explicit expiry signs the
  short form `` `${path}:${ts}` `` and is validated against a 5-minute freshness
  window instead of `exp`. Lite links MUST always use the four-part message +
  `exp` (they're meant to be long-lived and emailed).

## Shared secret

`SIGNED_URL_SECRET` — the same secret the site uses to verify. The minting
system must hold it securely (server-side only; never shipped to a browser).

## Recommended values (from the tier policy, AIC2-156)

- `scope = lite`
- `exp = ts + 30 days` (30 × 24 × 60 × 60 × 1000 ms)
- Link targets a lite-visible page: `/` or `/experiences`.

## Redemption behaviour (what the site does)

1. Middleware reads `ts`, `sig`, `scope`, `exp` and verifies (`lib/hmac-auth.ts`).
2. On success it sets the `aicentre-auth` cookie to a **signed** scope value
   (`<scope>.<hmac>`), lifetime 7 days for lite / 24h for full, and redirects to `/`.
3. Content gating (AIC2-161) then restricts a lite session to lite-visible
   routes and hides internal-only affordances (AI chat, internal CTAs).

## Reference implementation

`generateSignedUrl(path, baseUrl, { scope: 'lite', ttlMs })` in
`src/lib/hmac-auth.ts` produces a conforming link. A non-JS minting system
(e.g. Salesforce Apex) must reproduce the message format + HMAC above exactly.
