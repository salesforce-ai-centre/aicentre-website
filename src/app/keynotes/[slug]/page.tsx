import { getKeynotes, getSiteConfig } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import SlideViewer from '@/components/SlideViewer';
import { hasSlides } from '@/lib/slides';
import styles from './page.module.css';

// Force dynamic rendering to avoid build timeouts
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const keynotes = await getKeynotes(true);
  const keynote = keynotes.find((k) => k.id === slug);

  if (!keynote) {
    return {
      title: 'Keynote Not Found',
    };
  }

  return {
    title: `${keynote.title} | AI Centre Keynotes`,
    description: keynote.description,
  };
}

export default async function KeynotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const keynotes = await getKeynotes(true);
  const keynote = keynotes.find((k) => k.id === slug);
  const siteConfig = getSiteConfig();

  if (!keynote) {
    notFound();
  }

  // Check if slides exist for this keynote
  const slidesExist = await hasSlides(slug);

  return (
    <main className={styles.page}>
      <Navigation />

      {/* Hero Section */}
      <section className={`section-padding ${styles.hero}`}>
        <div className="container-max">
          <div className={styles.wrap}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span>/</span>
              <Link href="/#keynotes" className={styles.breadcrumbLink}>Keynotes</Link>
              <span>/</span>
              <span className={styles.breadcrumbCurrent}>{keynote.title}</span>
            </nav>

            {/* Main Content */}
            <div className={`glass-card ${styles.card}`}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.badgeRow}>
                  <div className={styles.badgeDot}></div>
                  <span className={styles.badgeLabel}>
                    Executive Keynote
                  </span>
                </div>
                <h1 className={styles.title}>
                  {keynote.title}
                </h1>
                <p className={styles.description}>
                  {keynote.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className={styles.detailsGrid}>
                {/* Presenter */}
                <div className={styles.detailCard}>
                  <div className={styles.detailHeadRow}>
                    <div className={`${styles.detailIcon} ${styles.detailIconPurple}`}>
                      <span className={styles.detailIconEmoji}>👤</span>
                    </div>
                    <h3 className={styles.detailHeading}>Presenter</h3>
                  </div>
                  <p className={styles.detailPrimary}>{keynote.presenter}</p>
                  <p className={styles.detailSecondary}>{keynote.presenterRole}</p>
                </div>

                {/* Duration & Audience */}
                <div className={styles.detailCard}>
                  <div className={styles.detailHeadRow}>
                    <div className={`${styles.detailIcon} ${styles.detailIconIndigo}`}>
                      <span className={styles.detailIconEmoji}>⏱️</span>
                    </div>
                    <h3 className={styles.detailHeading}>Session Details</h3>
                  </div>
                  <p className={styles.detailPrimary}>{keynote.duration}</p>
                  <p className={styles.detailSecondary}>{keynote.audienceSize}</p>
                </div>

                {/* Focus Area */}
                <div className={styles.detailCard}>
                  <div className={styles.detailHeadRow}>
                    <div className={`${styles.detailIcon} ${styles.detailIconGreen}`}>
                      <span className={styles.detailIconEmoji}>🎯</span>
                    </div>
                    <h3 className={styles.detailHeading}>Focus Area</h3>
                  </div>
                  <p className={styles.detailPrimary}>{keynote.focusArea}</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className={styles.audienceBlock}>
                <h3 className={styles.blockHeading}>Target Audience</h3>
                <div className={styles.audienceCard}>
                  <p className={styles.audienceText}>
                    {keynote.audience}
                  </p>
                </div>
              </div>

              {/* Topics Covered */}
              {keynote.topics && keynote.topics.length > 0 && (
                <div className={styles.topicsBlock}>
                  <h3 className={styles.blockHeading}>Key Topics</h3>
                  <div className={styles.topicsRow}>
                    {keynote.topics.map((topic, index) => (
                      <span
                        key={index}
                        className={styles.topicPill}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide Viewer */}
              {slidesExist && (
                <div className={styles.slidesBlock}>
                  <h3 className={styles.blockHeading}>Presentation Slides</h3>
                  <SlideViewer keynoteSlug={slug} />
                </div>
              )}

              {/* Booking CTA */}
              <div className={styles.bookingCard}>
                <h3 className={styles.bookingTitle}>
                  Ready to Book This Keynote?
                </h3>
                <p className={styles.bookingBody}>
                  Start with our planning guide to ensure a successful customer engagement
                </p>
                <div className={styles.bookingActions}>
                  <Link
                    href="/plan-engagement"
                    className={`${styles.bookingButton} ${styles.bookingButtonWhite}`}
                  >
                    <span>Plan Customer Engagement</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/agenda-builder"
                    className={`${styles.bookingButton} ${styles.bookingButtonGreen}`}
                  >
                    <span>Build Custom Agenda</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}