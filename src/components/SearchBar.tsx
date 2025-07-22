'use client';

import { useSearch } from '@/hooks/useSearch';
import { useChat } from '@/contexts/ChatContext';
import { Search, X, FileText, Zap, Mic, Bot, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * SearchBar Component
 * 
 * Provides real-time search functionality for workshops and experiences.
 * Features dropdown results with type indicators and quick navigation.
 * 
 * @component
 */
export default function SearchBar() {
  const { 
    query, 
    setQuery, 
    isOpen, 
    setIsOpen, 
    groupedResults, 
    hasResults 
  } = useSearch();
  
  const { openChatWithMessage } = useChat();
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Navigate to selected result
  const handleResultClick = (url: string) => {
    setQuery('');
    setIsOpen(false);
    window.location.href = url;
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Handle asking the agent
  const handleAskAgent = () => {
    const searchMessage = `I searched for "${query}" but couldn't find what I was looking for. Can you help me find information about this?`;
    openChatWithMessage(searchMessage); // Will auto-send
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white text-opacity-60" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search workshops, experiences & keynotes..."
          className="w-full pl-10 pr-10 py-2 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-full text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white text-opacity-60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {/* Workshop Results */}
              {groupedResults.workshops.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Standard Offerings ({groupedResults.workshops.length})
                  </div>
                  {groupedResults.workshops.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <FileText className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white group-hover:text-purple-200 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-400 line-clamp-2 mt-1">
                            {result.description}
                          </div>
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-purple-500 bg-opacity-20 text-purple-300 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Experience Results */}
              {groupedResults.experiences.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Immersive Experiences ({groupedResults.experiences.length})
                  </div>
                  {groupedResults.experiences.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Zap className="h-4 w-4 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white group-hover:text-orange-200 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-400 line-clamp-2 mt-1">
                            {result.description}
                          </div>
                          {result.category && (
                            <div className="mt-2">
                              <span className="px-2 py-0.5 bg-orange-500 bg-opacity-20 text-orange-300 text-xs rounded-full">
                                {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Keynote Results */}
              {groupedResults.keynotes.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Executive Keynotes ({groupedResults.keynotes.length})
                  </div>
                  {groupedResults.keynotes.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Mic className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white group-hover:text-indigo-200 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-400 line-clamp-2 mt-1">
                            {result.description}
                          </div>
                          {result.presenter && (
                            <div className="mt-2">
                              <span className="px-2 py-0.5 bg-indigo-500 bg-opacity-20 text-indigo-300 text-xs rounded-full">
                                {result.presenter}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* No Results State */
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-gray-500 mx-auto mb-3" />
              <div className="text-gray-400 font-medium mb-2">No results found for &quot;{query}&quot;</div>
              <div className="text-gray-500 text-sm mb-4">
                Try searching for workshops, experiences, keynotes, or topics
              </div>
              
              {/* Ask Agent Option */}
              <button
                onClick={handleAskAgent}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Bot className="w-4 h-4" />
                <span>Ask Agentforce Assistant</span>
                <Sparkles className="w-4 h-4" />
              </button>
              
              <div className="text-gray-500 text-xs mt-2">
                Get personalized help finding what you need
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}