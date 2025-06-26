'use client';

import { useState, lazy, Suspense, useMemo } from 'react';
import Hero from '@/components/Hero'
import Navigation from '@/components/Navigation'
import ContactBanner from '@/components/ContactBanner'
import WorkshopFilter from '@/components/WorkshopFilter'
import WorkshopCard from '@/components/WorkshopCard'
import ExperienceCard from '@/components/ExperienceCard'
import { getWorkshops, getExperiences, getTestimonials, getSiteConfig } from '@/lib/content'

// Lazy load components that are below the fold
const TestimonialCard = lazy(() => import('@/components/TestimonialCard'))
const KeynotesTable = lazy(() => import('@/components/KeynotesTable'))
const FAQ = lazy(() => import('@/components/FAQ'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
)

export default function Home() {
  // Memoize content to prevent re-computation
  const workshops = useMemo(() => getWorkshops(), []);
  const experiences = useMemo(() => getExperiences(), []);
  const testimonials = useMemo(() => getTestimonials(), []);
  const siteConfig = useMemo(() => getSiteConfig(), []);
  
  const [filteredWorkshops, setFilteredWorkshops] = useState(workshops);

  const handleFilterChange = useMemo(() => (filter: string) => {
    if (filter === 'all') {
      setFilteredWorkshops(workshops);
    } else {
      setFilteredWorkshops(workshops.filter(workshop => 
        workshop.category === filter || workshop.tags.some(tag => 
          tag.toLowerCase().includes(filter.toLowerCase())
        )
      ));
    }
  }, [workshops]);

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ContactBanner />
      
      {/* Standard Offerings Section */}
      <section id="offerings" className="py-20 section-padding">
        <div className="container-max">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Standard Offerings
            </h2>
          </div>
          
          <WorkshopFilter onFilterChange={handleFilterChange} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((workshop) => (
              <div key={workshop.id} className="fade-in">
                <WorkshopCard workshop={workshop} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 section-padding bg-white bg-opacity-5 rounded-3xl mx-4">
        <div className="container-max">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Customer Success Stories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<LoadingSpinner />}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="fade-in">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="py-20 section-padding">
        <div className="container-max">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Immersive Experiences
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
              Every customer engagement includes one standard offering plus one immersive experience for maximum impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <div key={experience.id} className="fade-in">
                <ExperienceCard experience={experience} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keynotes Section */}
      <section id="keynotes" className="py-20 section-padding">
        <div className="container-max">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Executive Keynotes
            </h2>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <KeynotesTable />
          </Suspense>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 section-padding">
        <div className="container-max">
          <Suspense fallback={<LoadingSpinner />}>
            <FAQ />
          </Suspense>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 section-padding bg-purple-500 bg-opacity-10 mx-4 rounded-3xl mt-20">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
            Ready to Accelerate Your Customer Deals?
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
            Partner with the AI Centre team to deliver impactful customer experiences that drive understanding, build consensus, and accelerate deal closure.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-purple-500">
            Plan Customer Engagement: {siteConfig.contactInfo.slackChannel}
          </button>
        </div>
      </section>
    </main>
  )
}