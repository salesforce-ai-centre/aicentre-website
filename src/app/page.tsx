'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero'
import Introduction from '@/components/Introduction'
import Navigation from '@/components/Navigation'
import ContactBanner from '@/components/ContactBanner'
import WorkshopFilter from '@/components/WorkshopFilter'
import WorkshopCard from '@/components/WorkshopCard'
import ExperienceCard from '@/components/ExperienceCard'
import TeamMemberCard from '@/components/TeamMemberCard'
import SpaceCard from '@/components/SpaceCard'
import KeynotesTable from '@/components/KeynotesTable'
import FAQ from '@/components/FAQ'
import { getWorkshops, getExperiences, getSiteConfig, getTeamMembers, getSpaces } from '@/lib/content'
import { useFadeIn } from '@/hooks/useFadeIn'
import FadeInWrapper from '@/components/FadeInWrapper'
import { Experience, Workshop, TeamMember, Space } from '@/types/content';


export default function Home() {
  // Memoize content to prevent re-computation
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const siteConfig = useMemo(() => getSiteConfig(), []);
  
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    getAllWorkshops();
    getAllExperiences();
    getAllTeamMembers();
    getAllSpaces();
  }, [])

  const getAllWorkshops = async () => {
    const allWorkshops = await getWorkshops();
    setWorkshops(allWorkshops);
    setFilteredWorkshops(allWorkshops);
  }

  const getAllExperiences = async () => {
    const allExperiences = await getExperiences();
    // Sort by readiness: green (ready) first, orange (nearly ready) second, red (not ready) last
    setExperiences(allExperiences.sort((a, b) => {
      const order = { 'green': 0, 'orange': 1, 'red': 2 };
      return (order[a.category as keyof typeof order] || 1) - (order[b.category as keyof typeof order] || 1);
    }));
  }

  const getAllTeamMembers = async () => {
    const allTeamMembers = getTeamMembers();
    setTeamMembers(allTeamMembers);
  }

  const getAllSpaces = async () => {
    const allSpaces = await getSpaces();
    setSpaces(allSpaces);
  }

  // Fade-in animation refs
  const offeringsHeaderRef = useFadeIn();
  const experiencesHeaderRef = useFadeIn();
  const keynotesHeaderRef = useFadeIn();
  const teamMembersHeaderRef = useFadeIn();
  const spacesHeaderRef = useFadeIn();

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
      <Introduction />
      <ContactBanner />
      
      {/* Standard Offerings Section */}
      <section id="offerings" className="py-20 section-padding">
        <div className="container-max">
          <div ref={offeringsHeaderRef} className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Standard Offerings
            </h2>
          </div>
          
          <WorkshopFilter onFilterChange={handleFilterChange} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((workshop) => (
              <FadeInWrapper key={workshop.id}>
                <WorkshopCard workshop={workshop} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="py-20 section-padding">
        <div className="container-max">
          <div ref={experiencesHeaderRef} className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Immersive Experiences
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
              Every customer engagement includes one standard offering plus one immersive experience for maximum impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <FadeInWrapper key={experience.id}>
                <ExperienceCard experience={experience} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Keynotes Section */}
      <section id="keynotes" className="py-20 section-padding">
        <div className="container-max">
          <div ref={keynotesHeaderRef} className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Executive Keynotes
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-10 max-w-3xl mx-auto">
              High-impact executive keynotes designed to plug seamlessly into existing leadership meetings. These sessions equip executive teams with the insight and direction needed to lead enterprise transformation in the agentic era.
            </p>
          </div>
          <KeynotesTable />
        </div>
      </section>

      {/* Spaces Section */}
      {spaces && spaces.length > 0 &&(
        <section id="spaces" className="py-20 section-padding">
          <div className="container-max">
            <div ref={spacesHeaderRef} className="text-center mb-16 fade-in">
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
                Spaces
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spaces.map((space) => (
                <FadeInWrapper key={space.id}>
                  <SpaceCard space={space} />
                </FadeInWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet the Team Section */}
      <section id="meet-the-team" className="py-20 section-padding">
        <div className="container-max">
          <div ref={teamMembersHeaderRef} className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((teamMember) => (
              <FadeInWrapper key={teamMember.id}>
                <TeamMemberCard teamMember={teamMember} />
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 section-padding">
        <div className="container-max">
          <FAQ />
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
          <Link href="/plan-engagement" className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-purple-500">
            Plan Customer Engagement
          </Link>
        </div>
      </section>
    </main>
  )
}