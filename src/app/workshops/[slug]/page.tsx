'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkshops } from '@/lib/content';
import Navigation from '@/components/Navigation';
import type { Workshop } from '@/types/content';

interface WorkshopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadWorkshop = async () => {
      const resolvedParams = await params;
      const workshops = getWorkshops();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 section-padding">
        <div className="container-max">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-white text-opacity-60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#offerings" className="hover:text-white transition-colors">Standard Offerings</Link>
            <span>/</span>
            <span className="text-white">{workshop.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {workshop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500 bg-opacity-30 border border-purple-500 border-opacity-50 rounded-full text-xs font-medium text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
                  {workshop.title}
                </h1>

                <p className="text-xl text-white text-opacity-90 leading-relaxed mb-8">
                  {workshop.description}
                </p>

                {/* Detailed Content */}
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold text-white mb-4">What You&apos;ll Learn</h2>
                  <div className="space-y-4 text-white text-opacity-90">
                    {workshop.category === 'hands-on' && (
                      <ul className="space-y-2">
                        <li>• Hands-on experience building and deploying AI agents</li>
                        <li>• Best practices for agent design and implementation</li>
                        <li>• Real-world use cases and practical applications</li>
                        <li>• Technical deep-dive into Agentforce capabilities</li>
                        <li>• Troubleshooting and optimization techniques</li>
                      </ul>
                    )}
                    {workshop.category === 'ideation' && (
                      <ul className="space-y-2">
                        <li>• Strategic frameworks for AI transformation</li>
                        <li>• Identifying high-impact AI use cases</li>
                        <li>• Building consensus around AI initiatives</li>
                        <li>• Roadmap development and prioritization</li>
                        <li>• Change management for AI adoption</li>
                      </ul>
                    )}
                    {workshop.category === 'technical' && (
                      <ul className="space-y-2">
                        <li>• Technical architecture and integration patterns</li>
                        <li>• Advanced configuration and customization</li>
                        <li>• Performance optimization and scalability</li>
                        <li>• Security and compliance considerations</li>
                        <li>• API development and automation</li>
                      </ul>
                    )}
                    {workshop.category === 'business' && (
                      <ul className="space-y-2">
                        <li>• Business value and ROI demonstration</li>
                        <li>• Executive-level strategic planning</li>
                        <li>• Risk assessment and mitigation</li>
                        <li>• Team alignment and stakeholder buy-in</li>
                        <li>• Success metrics and measurement</li>
                      </ul>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 mt-8">Workshop Format</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Duration</h3>
                      <p className="text-white text-opacity-80">{workshop.duration}</p>
                    </div>
                    <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Audience Size</h3>
                      <p className="text-white text-opacity-80">{workshop.audienceSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Ready to Book?</h3>
                <p className="text-white text-opacity-80 mb-6">
                  Partner with the AI Centre team to deliver this impactful workshop experience.
                </p>
                
                <Link 
                  href="/plan-engagement"
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl mb-4 text-center"
                >
                  Plan Customer Engagement
                </Link>
                
                <div className="text-center">
                  <p className="text-sm text-white text-opacity-60 mb-2">Contact us via Slack:</p>
                  <a 
                    href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-full font-mono text-sm text-white transition-all duration-200 cursor-pointer"
                  >
                    #ai-centre-uk
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                  <h4 className="font-semibold text-white mb-2">Workshop Details</h4>
                  <div className="space-y-2 text-sm text-white text-opacity-80">
                    <div>Category: <span className="capitalize text-white">{workshop.category}</span></div>
                    <div>Duration: <span className="text-white">{workshop.duration}</span></div>
                    <div>Participants: <span className="text-white">{workshop.audienceSize}</span></div>
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