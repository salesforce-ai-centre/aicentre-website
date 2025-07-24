'use client';

import { useChat } from '@/contexts/ChatContext';
import { ReactNode, useEffect, useState } from 'react';

interface SidebarAwareLayoutProps {
  children: ReactNode;
}

export default function SidebarAwareLayout({ children }: SidebarAwareLayoutProps) {
  const { isSidebarOpen, sidebarSide } = useChat();
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
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

  return (
    <div 
      className="transition-all duration-300 ease-in-out"
      style={getMargin()}
    >
      {children}
    </div>
  );
}