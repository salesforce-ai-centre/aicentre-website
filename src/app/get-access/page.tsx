'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import AgentAstro from '../../../public/images/AgentAstro.webp';
import styles from './get-access.module.css';

const SLACK_CHANNEL_URL =
  'https://salesforce.enterprise.slack.com/archives/C080TP9HENQ';

const AccessDenied = () => {
  // An expired client share link shows a different, client-appropriate message.
  const expired = useSearchParams().get('reason') === 'expired';

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

          <h1 className={styles.heading}>
            {expired ? 'This link has expired' : 'This link isn’t valid'}
          </h1>

          {expired ? (
            <p className={styles.body}>
              Your access link to the AI Centre has expired. Please ask the
              person who shared it with you for a new link.
            </p>
          ) : (
            <>
              <p className={styles.body}>
                It looks like you have an invalid link to this page. If you are
                a Salesforce employee, request your personalised link in the
                #ai-centre-uk Slack channel.
              </p>
              <div className={styles.actions}>
                <Button
                  href={SLACK_CHANNEL_URL}
                  variant="outline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open #ai-centre-uk
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

// useSearchParams requires a Suspense boundary in the App Router.
export default function GetAccessPage() {
  return (
    <Suspense fallback={null}>
      <AccessDenied />
    </Suspense>
  );
}
