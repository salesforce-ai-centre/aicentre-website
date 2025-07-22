'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

interface FadeInWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function FadeInWrapper({ children, className = "" }: FadeInWrapperProps) {
  const ref = useFadeIn();

  return (
    <div ref={ref} className={`fade-in ${className}`}>
      {children}
    </div>
  );
}