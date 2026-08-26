'use client';

/**
 * Navigation — redesigned light-theme header.
 *
 * Figma header (node 7:50): cloud logo + navy "AI Centre" wordmark left,
 * centred nav links (active link underlined), right-aligned solid brand
 * "Request to visit" button. Links + CTA come from site-config.json.
 *
 * AIC2-130 — part of the Design System epic (AIC2-126).
 */

import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';
import { useChat } from '@/contexts/ChatContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const siteConfig = getSiteConfig();
  const pathname = usePathname();
  const { isSidebarOpen, sidebarSide } = useChat();
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  // Header background is transparent at the top of the page and fades in
  // once the user scrolls past a small threshold.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // set initial state (e.g. on reload mid-page)
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Shift the header when the chat sidebar is open (unchanged behaviour).
  const getMargin = () => {
    if (!isSidebarOpen) return { marginLeft: '0', marginRight: '0' };
    const marginValue = isLargeScreen ? '24rem' : '20rem';
    return sidebarSide === 'left'
      ? { marginLeft: marginValue, marginRight: '0' }
      : { marginLeft: '0', marginRight: marginValue };
  };

  // A nav link is active when the current path matches (exact for "/", prefix otherwise).
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div
      className="fixed top-0 left-0 z-50 section-padding pt-4 transition-all duration-300 ease-in-out"
      style={{ right: '0', ...getMargin() }}
    >
      <nav
        className={`container-max rounded-2xl transition-all duration-300 ease-in-out ${
          scrolled || isOpen
            ? 'bg-white/70 shadow-card backdrop-blur-md'
            : 'bg-transparent shadow-none'
        }`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + wordmark */}
            <Link
              href="/"
              className="flex flex-shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-80"
            >
              <Image
                src="/images/SalesforceLogo.png"
                alt="AI Centre"
                width={36}
                height={36}
                className="flex-shrink-0 rounded-lg"
              />
              <span className="font-heading whitespace-nowrap text-lg font-semibold text-brand sm:text-xl">
                {siteConfig.siteName}
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-8 md:flex">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-sans text-base font-bold transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-navy underline decoration-2 underline-offset-8'
                      : 'text-gray-700 hover:text-navy'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            {siteConfig.ctaButton && (
              <div className="hidden md:block">
                <Button href={siteConfig.ctaButton.href}>
                  {siteConfig.ctaButton.name}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-navy md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div className="border-t border-navy/10 md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {siteConfig.navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-md px-3 py-2 font-sans text-base font-bold transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-brand/10 text-navy'
                        : 'text-gray-700 hover:bg-brand/5 hover:text-navy'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {siteConfig.ctaButton && (
                  <div className="px-3 pt-2">
                    <Button
                      href={siteConfig.ctaButton.href}
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      {siteConfig.ctaButton.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
