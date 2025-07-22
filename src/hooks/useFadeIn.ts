'use client';

import { useRef } from 'react';

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  
  // Return ref without any observer logic for maximum performance
  return ref;
}