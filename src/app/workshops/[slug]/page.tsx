'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkshops } from '@/lib/content';
import { SLACK_REQUEST_WORKFLOW_URL } from '@/lib/constants';
import Navigation from '@/components/Navigation';
import type { Workshop } from '@/types/content';
import styles from './page.module.css';

interface WorkshopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const router = useRouter();
  const defaultAudienceSize = "10-25";

  useEffect(() => {
    const loadWorkshop = async () => {
      const resolvedParams = await params;
      const workshops = await getWorkshops();
      const foundWorkshop = workshops.find(w => w.id === resolvedParams.slug);
      
      if (foundWorkshop) {
        setWorkshop(foundWorkshop);
      } else {
        // Redirect to home if workshop not found
        router.push('/');
      }
    };
    
    loadWorkshop();
  }, [params, router]);

  if (!workshop) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <Navigation />

      {/* Hero Section */}
      <section className={`section-padding ${styles.hero}`}>
        <div className="container-max">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>/</span>
            <Link href="/#offerings" className={styles.breadcrumbLink}>Standard Offerings</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{workshop.title}</span>
          </nav>

          <div className={styles.grid}>
            {/* Main Content */}
            <div className={styles.mainCol}>
              <div className={`glass-card ${styles.mainCard}`}>
                <div className={styles.tagRow}>
                  {workshop.tags.map((tag) => (
                    <span
                      key={tag}
                      className={styles.tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className={styles.title}>
                  {workshop.title}
                </h1>

                <p className={styles.description}>
                  {workshop.longDescription || workshop.description}
                </p>

                {/* Detailed Content */}
                <div className={styles.detail}>
                  {workshop?.sampleAgenda && (
                    <>
                      <h2 className={styles.sectionHeading}>Sample Agenda</h2>
                      <div className={styles.sectionBody}>
                        <ul className={styles.agendaList}>
                          {workshop.sampleAgenda.split("\n").map((item: string, index: number) => (
                            <li key={`agenda_item_${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {workshop?.engagementExpectations && (
                    <>
                      <h2 className={styles.sectionHeading}>Engagement Expectations</h2>
                      <div className={styles.sectionBody}>
                        <p className={styles.description}>
                          {workshop.engagementExpectations.map((item, index) => (
                            <span key={index}>
                              {item}
                              <br></br>
                            </span>
                          ))}
                        </p>
                      </div>
                    </>
                  )}

                  <h2 className={styles.sectionHeadingSpaced}>Workshop Format</h2>
                  <div className={styles.formatGrid}>
                    <div className={styles.formatCard}>
                      <h3 className={styles.formatCardTitle}>Duration</h3>
                      <p className={styles.formatCardBody}>{workshop.duration}</p>
                    </div>
                    <div className={styles.formatCard}>
                      <h3 className={styles.formatCardTitle}>Audience Size</h3>
                      <p className={styles.formatCardBody}>{workshop.audienceSize || defaultAudienceSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebarCol}>
              <div className={`glass-card ${styles.sidebarCard}`}>
                <h3 className={styles.sidebarTitle}>Ready to Book?</h3>
                <p className={styles.sidebarBody}>
                  Partner with the AI Centre team to deliver this impactful workshop experience.
                </p>

                <Link
                  href="/plan-engagement"
                  className={`${styles.ctaButton} ${styles.ctaPurple}`}
                >
                  Plan Customer Engagement
                </Link>

                <Link
                  href="/agenda-builder"
                  className={`${styles.ctaButton} ${styles.ctaGreen}`}
                >
                  Build Custom Agenda
                </Link>

                <div className={styles.slackBlock}>
                  <p className={styles.slackLabel}>Contact us via Slack:</p>
                  <a
                    href={SLACK_REQUEST_WORKFLOW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.slackLink}
                  >
                    #ai-centre-uk
                  </a>
                </div>

                <div className={styles.detailsBlock}>
                  <h4 className={styles.detailsTitle}>Workshop Details</h4>
                  <div className={styles.detailsList}>
                    <div>Category: <span className={`${styles.capitalize} ${styles.white}`}>{workshop.category}</span></div>
                    <div>Duration: <span className={styles.white}>{workshop.duration}</span></div>
                    <div>Participants: <span className={styles.white}>{workshop.audienceSize || defaultAudienceSize}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}