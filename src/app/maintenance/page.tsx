import type { Metadata } from 'next';
import Image from 'next/image';
import { Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: "We're making some changes | Salesforce AI Centre",
  robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating Agent Astro character - top right */}
      <div className="absolute top-20 right-10 md:right-20 opacity-40 pointer-events-none">
        <Image
          src="/images/AgentAstroFlying.png"
          alt=""
          width={180}
          height={180}
          className="animate-floating"
          priority
        />
      </div>

      {/* Bottom left Agent Astro character */}
      <div className="absolute bottom-10 left-10 md:left-20 opacity-30 pointer-events-none">
        <Image
          src="/images/AgentAstro.webp"
          alt=""
          width={220}
          height={220}
          priority
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <div className="glass-card p-10 md:p-14 space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center animate-floating">
              <Wrench className="w-10 h-10 text-purple-300" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white">
            We&apos;re making some changes
          </h1>

          <div className="pt-4 border-t border-white border-opacity-10">
            <p className="text-sm text-white text-opacity-60">
              Salesforce employees can reach the team in{' '}
              <a
                href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 font-semibold hover:text-purple-200 transition-colors"
              >
                #ai-centre
              </a>{' '}
              on Slack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
