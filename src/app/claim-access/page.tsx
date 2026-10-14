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
import { Ban } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getSiteConfig } from '@/lib/content';
import styles from './claim-access.module.css';

const ClaimAccess = () => {
  const router = useRouter();
  const params = useSearchParams();
  const siteConfig = getSiteConfig();
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

    if (!email.trim()) {
      setError('Enter your email address to continue.');
      return;
    }

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
      <div className={styles.header}>
        <Image
          src="/images/SalesforceLogo.png"
          alt=""
          width={40}
          height={40}
          className={styles.headerLogo}
        />
        <span className={styles.headerWordmark}>{siteConfig.siteName}</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.card}>
          {linkComplete ? (
            <>
              <h1 className={styles.heading}>Welcome to the {siteConfig.siteName}</h1>
              <p className={styles.body}>
                A Salesforce colleague shared this link with you. Enter the
                email address it was sent to and you&rsquo;ll get access.
              </p>
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label className={styles.label} htmlFor="claim-email">
                  Your email address
                </label>
                <div
                  className={`${styles.inputWrapper} ${error ? styles.inputWrapperError : ''}`}
                >
                  {error && <Ban className={styles.errorIcon} aria-hidden="true" />}
                  <input
                    id="claim-email"
                    type="email"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    aria-invalid={error ? true : undefined}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <Button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting || !email.trim()}
                >
                  {submitting ? 'Checking…' : `Learn about the ${siteConfig.siteName}`}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className={styles.heading}>This link isn&rsquo;t valid</h1>
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
