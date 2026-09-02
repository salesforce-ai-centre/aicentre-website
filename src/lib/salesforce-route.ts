/**
 * createSalesforceRoute — shared GET handler for the Salesforce-backed content
 * API routes (workshops, experiences, keynotes, faqs, spaces, team_members,
 * agendas). Removes the copy-pasted boilerplate: full-tier guard → fetch →
 * empty check → map(transform) → { success, data } envelope → error handling.
 *
 * Per-route specifics are passed in:
 *  - `fetcher(request)`  — returns the raw SF records (may read query params).
 *  - `transform(record)` — maps one raw record to the typed shape.
 *  - `postProcess(items)`— optional filter/sort on the mapped array.
 *  - `validate(request)` — optional early check; return a NextResponse to short-
 *                          circuit (e.g. agendas' required `id` → 400).
 *  - `label`             — used in the error log so failures are identifiable.
 *
 * AIC2-169 — part of the Codebase Cleanup epic (AIC2-163).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireFullTierApi } from '@/lib/auth-session';

const NO_OBJECTS_ERROR = 'No objects found';
const INTERNAL_ERROR = 'Internal server error';

interface SalesforceRouteConfig<T> {
  label: string;
  fetcher: (request: NextRequest) => Promise<Record<string, any>[] | null | undefined>;
  transform: (record: Record<string, any>) => T;
  postProcess?: (items: T[]) => T[];
  validate?: (request: NextRequest) => NextResponse | null;
}

export function createSalesforceRoute<T>(config: SalesforceRouteConfig<T>) {
  return async function GET(request: NextRequest) {
    const denied = await requireFullTierApi(request);
    if (denied) return denied;

    const invalid = config.validate?.(request);
    if (invalid) return invalid;

    try {
      const objects = await config.fetcher(request);
      if (!objects || objects.length === 0) {
        return NextResponse.json({ error: NO_OBJECTS_ERROR }, { status: 500 });
      }
      const mapped = objects.map(config.transform);
      const data = config.postProcess ? config.postProcess(mapped) : mapped;
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error(`Error in ${config.label} route:`, error);
      return NextResponse.json({ error: INTERNAL_ERROR }, { status: 500 });
    }
  };
}
