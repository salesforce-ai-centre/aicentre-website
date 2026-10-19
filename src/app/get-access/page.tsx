'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SLACK_CHANNEL_URL } from '@/lib/constants';
import { getSiteConfig } from '@/lib/content';
import AgentAstroFlying from '../../../public/images/AgentAstroFlying.png';
import styles from './get-access.module.css';

const AccessDenied = () => {
  const siteConfig = getSiteConfig();

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
          <div className={styles.dome}>
            <Image src={AgentAstroFlying} alt="" className={styles.astro} priority />
          </div>

          <h1 className={styles.heading}>Welcome to the {siteConfig.siteName}</h1>
          <p className={styles.body}>
            Thanks for your interest in the Salesforce {siteConfig.siteName}.
          </p>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>For customers and partners</p>
            <p className={styles.body}>
              Ask your Salesforce account team for a personal link. They can
              create one for your email address in a few seconds.
            </p>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>For Salesforce employees</p>
            <p className={styles.body}>
              Join{' '}
              <Link
                href={SLACK_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.slackLink}
              >
                #ai-centre
              </Link>{' '}
              on Slack to get access.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default function GetAccessPage() {
  return (
    <Suspense fallback={null}>
      <AccessDenied />
    </Suspense>
  );
}
