/**
 * `process.env.NODE_ENV` gets statically inlined by Next.js at build time
 * (`next build` always bakes in `'production'`), so a runtime Heroku config
 * var can never flip it back to `'development'`. `STAGING_MODE` is a plain
 * runtime env var instead, so a staging deploy can opt into dev-like
 * behavior (auth bypass, local token caching) without a dev build.
 */
export function isDevEnvironment(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.STAGING_MODE === 'true';
}
