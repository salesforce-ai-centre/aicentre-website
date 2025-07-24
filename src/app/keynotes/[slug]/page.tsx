import { getKeynotes, getSiteConfig } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import SlideViewer from '@/components/SlideViewer';
import { hasSlides } from '@/lib/slides';

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
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-white text-opacity-60 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#keynotes" className="hover:text-white transition-colors">Keynotes</Link>
              <span>/</span>
              <span className="text-white">{keynote.title}</span>
            </nav>

            {/* Main Content */}
            <div className="glass-card p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-300 font-medium text-sm uppercase tracking-wider">
                    Executive Keynote
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">
                  {keynote.title}
                </h1>
                <p className="text-xl text-white text-opacity-90 leading-relaxed">
                  {keynote.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Presenter */}
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">👤</span>
                    </div>
                    <h3 className="font-semibold text-white">Presenter</h3>
                  </div>
                  <p className="text-white font-medium mb-1">{keynote.presenter}</p>
                  <p className="text-white text-opacity-70 text-sm">{keynote.presenterRole}</p>
                </div>

                {/* Duration & Audience */}
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">⏱️</span>
                    </div>
                    <h3 className="font-semibold text-white">Session Details</h3>
                  </div>
                  <p className="text-white font-medium mb-1">{keynote.duration}</p>
                  <p className="text-white text-opacity-70 text-sm">{keynote.audienceSize}</p>
                </div>

                {/* Focus Area */}
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🎯</span>
                    </div>
                    <h3 className="font-semibold text-white">Focus Area</h3>
                  </div>
                  <p className="text-white font-medium">{keynote.focusArea}</p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Target Audience</h3>
                <div className="bg-white bg-opacity-5 rounded-xl p-6 border border-white border-opacity-10">
                  <p className="text-white text-opacity-90 leading-relaxed">
                    {keynote.audience}
                  </p>
                </div>
              </div>

              {/* Topics Covered */}
              {keynote.topics && keynote.topics.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Key Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {keynote.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 rounded-xl text-white font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide Viewer */}
              {slidesExist && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Presentation Slides</h3>
                  <SlideViewer keynoteSlug={slug} />
                </div>
              )}

              {/* Booking CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-3">
                  Ready to Book This Keynote?
                </h3>
                <p className="text-white text-opacity-90 mb-6">
                  Start with our planning guide to ensure a successful customer engagement
                </p>
                <Link
                  href="/plan-engagement"
                  className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Plan Customer Engagement</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}