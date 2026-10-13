'use client';

/**
 * claim-access — landing page for an email-bound lite share link.
 *
 * A recipient opens a link shared with them (minted via the "Share access"
 * button by a full-tier user). The link carries the signed params + the
 * recipient's hashed email (`eh`). They enter their email here; on a hash
 * match the /api/auth/claim-lite-link endpoint sets the lite session cookie
 * and we send them into the site.
 *
 * This route is excluded from the middleware matcher so unauthenticated
 * recipients can reach it.
 *
 * AIC2-... — part of the Privacy & Sharing epic (AIC2-155).
 */

import { Suspense, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import AgentAstro from '../../../public/images/AgentAstro.webp';
import styles from './claim-access.module.css';

const ClaimAccess = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // The signed link params travel with the recipient; forward them verbatim.
  const ts = params.get('ts');
  const sig = params.get('sig');
  const eh = params.get('eh');
  const linkComplete = Boolean(ts && sig && eh);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/claim-lite-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ts,
          sig,
          eh,
          scope: params.get('scope'),
          exp: params.get('exp'),
        }),
      });

      if (res.ok) {
        // Cookie is set; go to the lite home.
        router.replace('/');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className={`page-gradient ${styles.main}`}
      style={
        {
          '--page-gradient':
            'linear-gradient(150deg, #FBF3E0 0%, #EAF5FE 45%, #90D0FE 100%)',
        } as React.CSSProperties
      }
    >
      <section className={styles.hero}>
        <div className={styles.card}>
          <Image src={AgentAstro} alt="" className={styles.astro} priority />

          {linkComplete ? (
            <>
              <h1 className={styles.heading}>Confirm your email</h1>
              <p className={styles.body}>
                This link was shared with you to explore the AI Centre. Enter the
                email address it was sent to, to continue.
              </p>
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label className={styles.label} htmlFor="claim-email">
                  Email address
                </label>
                <input
                  id="claim-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                {error && <p className={styles.error}>{error}</p>}
                <Button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting || !email.trim()}
                >
                  {submitting ? 'Checking…' : 'Continue'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className={styles.heading}>This link isn’t valid</h1>
              <p className={styles.body}>
                This access link is incomplete. Please ask the person who shared
                it with you for a new link.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

// useSearchParams requires a Suspense boundary in the App Router.
export default function ClaimAccessPage() {
  return (
    <Suspense fallback={null}>
      <ClaimAccess />
    </Suspense>
  );
}
