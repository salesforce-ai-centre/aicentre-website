'use client';

import React from 'react';
import Image from 'next/image';
import AgentAstroFlying from '../../../public/images/AgentAstroFlying.png';
import AgentAstro from '../../../public/images/AgentAstro.webp';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient matching the site theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      
      {/* Floating Agent Astro character - top right */}
      <div className="absolute top-20 right-10 md:right-20 opacity-30">
        <Image 
          src={AgentAstroFlying} 
          alt="Agent Astro" 
          width={150} 
          height={150}
          className="animate-pulse"
          priority
        />
      </div>
      
      {/* Bottom right Agent Astro character */}
      <div className="absolute bottom-10 left-10 md:left-20 opacity-20 pointer-events-none">
        <Image 
          src={AgentAstro} 
          alt="Agent Astro" 
          width={200} 
          height={200}
          priority
        />
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <div className="glass-card p-12 space-y-6">
          {/* Shield icon - security/access */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" 
                />
              </svg>
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops!
          </h1>
          
          {/* Updated message */}
          <div className="space-y-4">
            <p className="text-lg text-gray-200">
              It looks like you have an invalid link to this page.
            </p>
            <p className="text-lg text-white">
              If you are a Salesforce employee, please visit the<br/>
                <a 
                  href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-blue-400 font-bold">#ai-centre-uk</span>{' '}
                </a>
              Slack channel to obtain your personalised link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
