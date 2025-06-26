'use client';

import { useState } from 'react';
import { getSiteConfig } from '@/lib/content';
import Image from 'next/image';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const siteConfig = getSiteConfig();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 section-padding pt-4">
      <nav className="container-max bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl backdrop-blur-sm">
        <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/SalesforceLogo.png" 
              alt="Salesforce Logo" 
              width={36} 
              height={36}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold text-white">
              {siteConfig.siteName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white text-opacity-80 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:bg-opacity-10"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Agentforce Badge */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 rounded-full text-sm font-semibold border border-white border-opacity-30">
              {siteConfig.agentforceBadge}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white text-opacity-80 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white border-opacity-20">
              {siteConfig.navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white text-opacity-80 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-white hover:bg-opacity-10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-4 pt-2 border-t border-white border-opacity-20">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-2 rounded-full text-sm font-semibold text-center">
                  {siteConfig.agentforceBadge}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>
    </div>
  );
}