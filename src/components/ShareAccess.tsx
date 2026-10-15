'use client';

/**
 * ShareAccess — lets a full-tier user share the lite (client-safe) version of
 * the site with someone by email.
 *
 * Flow: enter a recipient's email → POST /api/auth/share-lite-link mints a
 * 30-day, email-bound lite link (the email is hashed into the link, never sent
 * in the clear) → we show the link to copy and forward to the recipient. When
 * they open it they land on /claim-access, re-enter their email, and get a lite
 * session.
 *
 * Rendered only for full-tier sessions (see Navigation) — lite sessions can't
 * mint links, and the API enforces the same server-side.
 *
 * AIC2-... — part of the Privacy & Sharing epic (AIC2-155).
 */

import { useState, type FormEvent } from 'react';
import { Share2, X, Check, Link as LinkIcon } from 'lucide-react';
import Button from './ui/Button';
import styles from './ShareAccess.module.css';

export default function ShareAccess() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setEmail('');
    setShareUrl(null);
    setError(null);
    setSubmitting(false);
    setCopied(false);
  };

  const closeModal = () => {
    setOpen(false);
    reset();
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/share-lite-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, baseUrl: window.location.origin }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.shareUrl) {
        setShareUrl(data.shareUrl);
      } else {
        setError(data.error || 'Could not create a link. Please try again.');
      }
    } catch {
      setError('Could not create a link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy — select the link and copy it manually.');
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className={styles.triggerButton}>
        <Share2 className={styles.triggerIcon} />
        Share
      </Button>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Share access"
          onClick={closeModal}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.close}
              onClick={closeModal}
              aria-label="Close"
            >
              <X className={styles.closeIcon} />
            </button>

            {!shareUrl ? (
              <>
                <h2 className={styles.heading}>Share with a customer</h2>
                <p className={styles.body}>
                  Enter their email address and we&rsquo;ll create a private
                  link just for them. They&rsquo;ll need to confirm this email
                  to open it.
                </p>
                <form className={styles.form} onSubmit={handleGenerate} noValidate>
                  <label className={styles.label} htmlFor="share-email">
                    Customer&rsquo;s email address
                  </label>
                  <input
                    id="share-email"
                    type="email"
                    className={styles.input}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                  {error && <p className={styles.error}>{error}</p>}
                  <Button
                    type="submit"
                    className={styles.submit}
                    disabled={submitting || !email.trim()}
                  >
                    {submitting ? 'Creating link…' : 'Create link'}
                  </Button>
                </form>
              </>
            ) : (
              <div className={styles.result}>
                <h2 className={styles.heading}>Your link is ready</h2>
                <p className={styles.body}>
                  Send this link to <strong>{email.trim()}</strong>. It works
                  for 30 days and only for this email address. They&rsquo;ll
                  see the customer version of the site.
                </p>
                <div className={styles.linkRow}>
                  <input
                    className={styles.linkField}
                    value={shareUrl}
                    readOnly
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="Generated share link"
                  />
                  <span className={styles.copyWrapper}>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={styles.copyButton}
                      aria-label="Copy link"
                    >
                      {copied ? (
                        <Check className={styles.copyIcon} />
                      ) : (
                        <LinkIcon className={styles.copyIcon} />
                      )}
                    </button>
                    <span className={styles.tooltip} role="tooltip">
                      {copied ? 'Copied!' : 'Copy link'}
                    </span>
                  </span>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.hint}>
                  Need to share with someone else?{' '}
                  <button
                    type="button"
                    onClick={reset}
                    className={styles.resetLink}
                  >
                    Create another link
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
