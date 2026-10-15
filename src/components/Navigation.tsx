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
import ShareAccess from './ShareAccess';
import { useChat } from '@/contexts/ChatContext';
import { useIsLite } from '@/contexts/AccessTierContext';
import { isLitePathAllowed } from '@/lib/auth-session';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const siteConfig = getSiteConfig();
  const pathname = usePathname();
  const { isSidebarOpen, sidebarSide } = useChat();
  const isLite = useIsLite();
  // Lite (client) sessions only see nav links to lite-visible routes, and not
  // the internal "Request to visit" CTA.
  const navItems = isLite
    ? siteConfig.navigation.filter((item) => isLitePathAllowed(item.href))
    : siteConfig.navigation;
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getMargin = () => {
    if (!isSidebarOpen) return { marginLeft: '0', marginRight: '0' };
    const marginValue = isLargeScreen ? '24rem' : '20rem';
    return sidebarSide === 'left'
      ? { marginLeft: marginValue, marginRight: '0' }
      : { marginLeft: '0', marginRight: marginValue };
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Active nav underline matches the section's colour (Mario's design note):
  // About = gold, Experiences = purple, Plan = green.
  const activeColour = (href: string) => {
    if (href.startsWith('/experiences')) return '#BA02FF';
    if (href.startsWith('/plan')) return '#09A49A';
    return '#E4A200'; // About / default
  };

  return (
    <div
      className={`section-padding ${styles.bar}`}
      style={{ right: '0', ...getMargin() }}
    >
      <nav
        className={`container-max ${styles.nav} ${(scrolled || isOpen) ? styles.navScrolled : ''}`}
      >
        <div className={styles.inner}>
          <div className={styles.row}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/images/SalesforceLogo.png"
                alt="AI Centre"
                width={64}
                height={64}
                className={styles.logo}
              />
              <span className={styles.wordmark}>
                {siteConfig.siteName}
              </span>
            </Link>

            <div className={styles.desktopLinks}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={isActive(item.href) ? { textDecorationColor: activeColour(item.href) } : undefined}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs — internal, hidden for lite sessions */}
            {!isLite && (
              <div className={styles.desktopCtas}>
                {/* Share the client-safe (lite) site with someone by email */}
                {siteConfig.ctaButton && (
                  <Button href={siteConfig.ctaButton.href} variant="outline" >
                    {siteConfig.ctaButton.name}
                  </Button>
                )}
                <ShareAccess />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.menuButton}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div className={styles.mobileNav}>
              <div className={styles.mobileList}>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!isLite && (
                  <div className={styles.mobileCtas}>
                    {siteConfig.ctaButton && (
                      <Button
                        href={siteConfig.ctaButton.href}
                        className={styles.mobileCtaButton}
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                      >
                        {siteConfig.ctaButton.name}
                      </Button>
                    )}
                    <ShareAccess />
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
