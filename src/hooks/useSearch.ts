'use client';

import { useState, useMemo, useEffect } from 'react';
import { getWorkshops, getExperiences, getKeynotes } from '@/lib/content';

// Combined search result type
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'experience' | 'keynote';
  tags?: string[];
  category?: string;
  audienceSize?: string;
  presenter?: string;
  focusArea?: string;
  url: string;
}

/**
 * Custom hook for searching workshops, experiences, and keynotes
 * Provides real-time search functionality across all content
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<SearchResult[]>([]);

  // Fetch content on mount
  useEffect(() => {
    async function fetchContent() {
      const workshops = await getWorkshops();
      const experiences = await getExperiences();
      const keynotes = await getKeynotes();

      const results: SearchResult[] = [
        ...workshops.map(workshop => ({
          id: workshop.id,
          title: workshop.title,
          description: workshop.description,
          type: 'workshop' as const,
          tags: workshop.tags,
          audienceSize: workshop.audienceSize,
          url: `/workshops/${workshop.id}`
        })),
        ...experiences.map(experience => ({
          id: experience.id,
          title: experience.title,
          description: experience.description,
          type: 'experience' as const,
          category: experience.category,
          url: `/experiences/${experience.id}`
        })),
        ...keynotes.map(keynote => ({
          id: keynote.id,
          title: keynote.title,
          description: keynote.description,
          type: 'keynote' as const,
          presenter: keynote.presenter,
          focusArea: keynote.focusArea,
          audienceSize: keynote.audienceSize,
          url: `/keynotes/${keynote.id}`
        }))
      ];

      setContent(results);
    }

    fetchContent();
  }, []);

  // Filter results based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return content.filter(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      if (item.description.toLowerCase().includes(lowerQuery)) return true;
      if (item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      if (item.category?.toLowerCase().includes(lowerQuery)) return true;
      if (item.audienceSize?.toLowerCase().includes(lowerQuery)) return true;
      if (item.presenter?.toLowerCase().includes(lowerQuery)) return true;
      if (item.focusArea?.toLowerCase().includes(lowerQuery)) return true;
      return false;
    }).slice(0, 8);
  }, [query, content]);

  // Group results by type
  const groupedResults = useMemo(() => ({
    workshops: searchResults.filter(r => r.type === 'workshop'),
    experiences: searchResults.filter(r => r.type === 'experience'),
    keynotes: searchResults.filter(r => r.type === 'keynote')
  }), [searchResults]);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    searchResults,
    groupedResults,
    hasResults: searchResults.length > 0
  };
}