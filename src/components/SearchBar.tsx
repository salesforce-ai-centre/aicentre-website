'use client';

import { useSearch } from '@/hooks/useSearch';
import { useChat } from '@/contexts/ChatContext';
import { Search, X, FileText, Zap, Mic, Bot, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (url: string) => {
    setQuery('');
    setIsOpen(false);
    window.location.href = url;
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleAskAgent = () => {
    const searchMessage = `I searched for "${query}" but couldn't find what I was looking for. Can you help me find information about this?`;
    openChatWithMessage(searchMessage);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-ink-tertiary" />
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
          placeholder="Search offerings..."
          className="w-full pl-10 pr-10 py-2 bg-surface-muted border border-border rounded-full text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-tertiary hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border rounded-xl shadow-card-hover overflow-hidden z-50 max-h-96 overflow-y-auto">
          {hasResults ? (
            <div className="p-2">
              {groupedResults.workshops.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                    Standard Offerings ({groupedResults.workshops.length})
                  </div>
                  {groupedResults.workshops.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <FileText className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink group-hover:text-accent truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-ink-secondary line-clamp-2 mt-0.5">
                            {result.description}
                          </div>
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-accent-light text-accent text-xs rounded-full"
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

              {groupedResults.experiences.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                    Immersive Experiences ({groupedResults.experiences.length})
                  </div>
                  {groupedResults.experiences.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Zap className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink group-hover:text-accent truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-ink-secondary line-clamp-2 mt-0.5">
                            {result.description}
                          </div>
                          {result.category && (
                            <div className="mt-1.5">
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full">
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

              {groupedResults.keynotes.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-ink-tertiary uppercase tracking-wide">
                    Executive Keynotes ({groupedResults.keynotes.length})
                  </div>
                  {groupedResults.keynotes.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Mic className="h-4 w-4 text-accent-dark" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-ink group-hover:text-accent truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-ink-secondary line-clamp-2 mt-0.5">
                            {result.description}
                          </div>
                          {result.presenter && (
                            <div className="mt-1.5">
                              <span className="px-2 py-0.5 bg-accent-light text-accent text-xs rounded-full">
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
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-ink-tertiary mx-auto mb-3" />
              <div className="text-ink font-medium mb-1">No results found for &quot;{query}&quot;</div>
              <div className="text-ink-secondary text-sm mb-4">
                Try searching for workshops, experiences, keynotes, or topics
              </div>

              <button
                onClick={handleAskAgent}
                className="inline-flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                <Bot className="w-4 h-4" />
                <span>Ask Agent Eric</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <div className="text-ink-tertiary text-xs mt-2">
                Get personalized help finding what you need
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
