'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useChat } from '@/contexts/ChatContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const siteConfig = getSiteConfig();
  const { isSidebarOpen, sidebarSide } = useChat();
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate margin based on screen size and sidebar state
  const getMargin = () => {
    if (!isSidebarOpen) return { marginLeft: '0', marginRight: '0' };
    
    const marginValue = isLargeScreen ? '24rem' : '20rem';
    
    if (sidebarSide === 'left') {
      return { marginLeft: marginValue, marginRight: '0' };
    } else {
      return { marginLeft: '0', marginRight: marginValue };
    }
  };

  // Helper function to create proper navigation links
  const getNavigationHref = (href: string) => {
    // If it's a fragment link (starts with #), make it work from any page
    if (href.startsWith('#')) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <div 
      className="fixed top-0 left-0 z-50 section-padding pt-4 transition-all duration-300 ease-in-out"
      style={{
        right: '0',
        ...getMargin(),
      }}
    >
      <nav className="container-max bg-black bg-opacity-40 border border-white border-opacity-30 rounded-2xl backdrop-blur-md shadow-lg">
        <div className="px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
            <Image 
              src="/images/SalesforceLogo.png" 
              alt="Salesforce Logo" 
              width={36} 
              height={36}
              className="rounded-lg flex-shrink-0"
            />
            <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white whitespace-nowrap">
              <span className="hidden sm:inline">{siteConfig.siteName}</span>
              <span className="sm:hidden">AI Centre</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={getNavigationHref(item.href)}
                className="text-white text-opacity-80 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:bg-opacity-10"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-80">
            <SearchBar />
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
                <Link
                  key={item.name}
                  href={getNavigationHref(item.href)}
                  className="text-white text-opacity-80 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-white hover:bg-opacity-10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-2 border-t border-white border-opacity-20">
                <SearchBar />
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>
    </div>
  );
}