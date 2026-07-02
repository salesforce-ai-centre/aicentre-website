'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/content';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const getMargin = () => {
    if (!isSidebarOpen) return { marginLeft: '0', marginRight: '0' };

    const marginValue = isLargeScreen ? '24rem' : '20rem';

    if (sidebarSide === 'left') {
      return { marginLeft: marginValue, marginRight: '0' };
    } else {
      return { marginLeft: '0', marginRight: marginValue };
    }
  };

  const getNavigationHref = (href: string) => {
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
      <nav className="container-max bg-white/80 backdrop-blur-md border border-border rounded-2xl shadow-nav">
        <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
            <Image
              src="/images/ai-centre-logo.png"
              alt="AI Centre"
              width={260}
              height={60}
              className="flex-shrink-0"
              style={{ height: '58px', width: 'auto' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={getNavigationHref(item.href)}
                className="text-ink-secondary hover:text-ink px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-60">
            <SearchBar />
          </div>

          {/* User Menu */}
          {user && (
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-black/5 transition-colors duration-200"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-ink">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-ink-secondary font-medium max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink-secondary truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-sm text-ink-secondary hover:text-ink hover:bg-black/5 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-2.5 text-sm text-ink-secondary hover:text-ink hover:bg-black/5 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink-secondary hover:text-ink p-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={getNavigationHref(item.href)}
                  className="text-ink-secondary hover:text-ink block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-2 border-t border-border">
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
