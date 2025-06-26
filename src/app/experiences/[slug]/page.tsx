'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getExperiences } from '@/lib/content';
import Navigation from '@/components/Navigation';
import type { Experience } from '@/types/content';

interface ExperienceDetailPageProps {
  params: { slug: string };
}

export default function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const router = useRouter();

  useEffect(() => {
    const experiences = getExperiences();
    const foundExperience = experiences.find(e => e.id === params.slug);
    
    if (foundExperience) {
      setExperience(foundExperience);
    } else {
      // Redirect to home if experience not found
      router.push('/');
    }
  }, [params.slug, router]);

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orange': return 'bg-orange-500';
      case 'green': return 'bg-green-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max">
          <button
            onClick={() => router.push('/')}
            className="mb-8 flex items-center text-white text-opacity-80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Experiences
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 mb-8">
                <div className="flex items-center mb-6">
                  <span className={`inline-block w-4 h-4 rounded-full mr-3 ${getCategoryColor(experience.category)}`}></span>
                  <span className="text-white text-opacity-80 uppercase text-sm font-semibold tracking-wide">
                    {experience.type} Experience
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
                  {experience.title}
                </h1>

                <p className="text-xl text-white text-opacity-90 leading-relaxed mb-8">
                  {experience.description}
                </p>

                {/* Experience Details */}
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold text-white mb-4">Experience Overview</h2>
                  <div className="space-y-4 text-white text-opacity-90">
                    {experience.type === 'interactive' && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Interactive Features</h3>
                        <ul className="space-y-2">
                          <li>• Hands-on exploration of AI capabilities</li>
                          <li>• Real-time demonstrations tailored to your industry</li>
                          <li>• Interactive tools and simulations</li>
                          <li>• Collaborative discovery sessions</li>
                          <li>• Immediate feedback and results</li>
                        </ul>
                      </div>
                    )}
                    {experience.type === 'demo' && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Demonstration Highlights</h3>
                        <ul className="space-y-2">
                          <li>• Live showcases of cutting-edge AI technology</li>
                          <li>• Real-world use case presentations</li>
                          <li>• Behind-the-scenes look at AI development</li>
                          <li>• Expert-guided walkthroughs</li>
                          <li>• Q&A with AI specialists</li>
                        </ul>
                      </div>
                    )}
                    {experience.type === 'immersive' && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Immersive Elements</h3>
                        <ul className="space-y-2">
                          <li>• Full sensory engagement with AI scenarios</li>
                          <li>• Realistic business simulation environments</li>
                          <li>• Role-playing exercises and challenges</li>
                          <li>• Gamified learning experiences</li>
                          <li>• Memorable, impactful demonstrations</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 mt-8">What Makes This Special</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experience.tags.map((tag, index) => (
                      <div key={index} className="bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">{tag}</h3>
                        <p className="text-white text-opacity-80 text-sm">
                          {tag === 'Interactive' && 'Engage directly with AI tools and see immediate results'}
                          {tag === 'Demo' && 'Watch live demonstrations of AI capabilities in action'}
                          {tag === 'Industry-specific' && 'Tailored examples relevant to your business context'}
                          {tag === 'Collaborative' && 'Work together to build understanding and consensus'}
                          {tag === 'Visualization' && 'See abstract concepts made tangible and understandable'}
                          {tag === 'Hands-on' && 'Get practical experience working with AI tools'}
                          {tag === 'Gamified' && 'Learn through engaging, game-like experiences'}
                          {tag === 'Team Building' && 'Foster collaboration while learning about AI'}
                          {tag === 'Discovery' && 'Uncover new possibilities and use cases for your business'}
                          {tag === 'Research' && 'Learn about the latest advances in AI technology'}
                          {tag === 'Innovation' && 'Explore cutting-edge AI developments and trends'}
                          {tag === 'Future Tech' && 'Get a glimpse of what\'s coming next in AI'}
                          {tag === 'Education' && 'Build foundational knowledge about AI concepts'}
                          {tag === 'History' && 'Understand the evolution and context of AI development'}
                          {tag === 'Context' && 'See how AI fits into the broader technology landscape'}
                          {tag === 'AI Testing' && 'Experience real AI evaluation and testing scenarios'}
                          {tag === 'Business Scenarios' && 'Apply AI concepts to realistic business situations'}
                          {tag === 'Sustainability' && 'Explore how AI can drive environmental and social impact'}
                          {tag === 'ESG' && 'Learn about responsible AI practices and governance'}
                          {tag === 'Problem Solving' && 'Use AI to tackle real-world challenges'}
                          {tag === 'High-speed' && 'Experience AI in fast-paced, decision-making scenarios'}
                          {tag === 'Decision Making' && 'Learn how AI can enhance business decision processes'}
                          {tag === 'Real-time AI' && 'See AI working in live, dynamic environments'}
                          {tag === 'Self-service' && 'Explore AI tools at your own pace'}
                          {tag === 'Deep Dive' && 'Get detailed, technical insights into AI capabilities'}
                          {tag === 'Features' && 'Comprehensive overview of AI platform features'}
                          {tag === 'Mobile App' && 'Experience AI through mobile and app-based interfaces'}
                          {tag === 'Companion' && 'AI as a personal assistant and guide'}
                          {tag === 'Extended Learning' && 'Continue your AI journey beyond the session'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 mt-8">Experience Format</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Duration</h3>
                      <p className="text-white text-opacity-80">{experience.duration}</p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Audience Size</h3>
                      <p className="text-white text-opacity-80">{experience.audienceSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Ready to Experience?</h3>
                <p className="text-white text-opacity-80 mb-6">
                  Combine this immersive experience with a standard offering for maximum impact.
                </p>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl mb-4">
                  Plan Customer Engagement
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-white text-opacity-60 mb-2">Contact us via Slack:</p>
                  <div className="bg-white bg-opacity-20 px-3 py-2 rounded-full font-mono text-sm text-white">
                    #ai-centre-uk
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                  <h4 className="font-semibold text-white mb-2">Experience Details</h4>
                  <div className="space-y-2 text-sm text-white text-opacity-80">
                    <div>Type: <span className="capitalize text-white">{experience.type}</span></div>
                    <div>Duration: <span className="text-white">{experience.duration}</span></div>
                    <div>Participants: <span className="text-white">{experience.audienceSize}</span></div>
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