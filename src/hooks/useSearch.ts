'use client';

import { useState, useMemo } from 'react';
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

  // Get all content and format for search
  const searchableContent = useMemo(() => {
    const workshops = getWorkshops();
    const experiences = getExperiences();
    const keynotes = getKeynotes();
    
    const results: SearchResult[] = [
      // Format workshops for search
      ...workshops.map(workshop => ({
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        type: 'workshop' as const,
        tags: workshop.tags,
        audienceSize: workshop.audienceSize,
        url: `/workshops/${workshop.id}`
      })),
      // Format experiences for search
      ...experiences.map(experience => ({
        id: experience.id,
        title: experience.title,
        description: experience.description,
        type: 'experience' as const,
        category: experience.category,
        url: `/experiences/${experience.id}`
      })),
      // Format keynotes for search
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
    
    return results;
  }, []);

  // Filter results based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return searchableContent.filter(item => {
      // Search in title
      if (item.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in description
      if (item.description.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in tags (for workshops)
      if (item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      
      // Search in category (for experiences)
      if (item.category?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in audience size (for workshops and keynotes)
      if (item.audienceSize?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in presenter (for keynotes)
      if (item.presenter?.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in focus area (for keynotes)
      if (item.focusArea?.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    }).slice(0, 8); // Limit to 8 results for performance
  }, [query, searchableContent]);

  // Group results by type for better display
  const groupedResults = useMemo(() => {
    const workshops = searchResults.filter(r => r.type === 'workshop');
    const experiences = searchResults.filter(r => r.type === 'experience');
    const keynotes = searchResults.filter(r => r.type === 'keynote');
    
    return { workshops, experiences, keynotes };
  }, [searchResults]);

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