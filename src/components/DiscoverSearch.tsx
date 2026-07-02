'use client';

import { useState, useCallback } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

interface DiscoverSearchProps {
  onFilter: (query: string) => void;
}

export default function DiscoverSearch({ onFilter }: DiscoverSearchProps) {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { openChatWithMessage } = useChat();

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    onFilter(value);
    if (!value) {
      setAiResponse('');
    }
  }, [onFilter]);

  const handleAskAgent = async () => {
    if (!query.trim()) return;

    setIsLoadingAI(true);
    setAiResponse('');

    try {
      const sessionRes = await fetch('/api/agent/session', { method: 'POST' });
      const { sessionId } = await sessionRes.json();

      const messageRes = await fetch('/api/agent/message-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: `Based on this need: "${query}", recommend the best AI Centre offerings (workshops, experiences, or keynotes). Be concise — 2-3 bullet points max with specific offering names.`,
          sequenceId: 1,
        }),
      });

      const data = await messageRes.json();
      if (data.success && data.response?.messages?.[0]?.content) {
        setAiResponse(data.response.messages[0].content);
      } else {
        openChatWithMessage(`Help me find offerings for: ${query}`);
      }
    } catch {
      openChatWithMessage(`Help me find offerings for: ${query}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleAskAgent();
    }
  };

  const clear = () => {
    setQuery('');
    setAiResponse('');
    onFilter('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-ink-tertiary" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What does your customer need? e.g. hands-on technical, executive alignment, early AI journey..."
          className="w-full pl-13 pr-24 py-4 bg-surface-elevated border border-border rounded-2xl text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm shadow-sm"
          style={{ paddingLeft: '3.25rem' }}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={clear}
              className="p-1.5 text-ink-tertiary hover:text-ink transition-colors rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleAskAgent}
            disabled={!query.trim() || isLoadingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-full transition-colors"
          >
            {isLoadingAI ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {query && !aiResponse && !isLoadingAI && (
        <p className="text-center text-ink-tertiary text-xs mt-3">
          Filtering results below &middot; Press Enter or click &ldquo;Ask AI&rdquo; for personalised recommendations
        </p>
      )}

      {isLoadingAI && (
        <div className="mt-4 p-4 bg-accent-light border border-accent/20 rounded-xl">
          <div className="flex items-center gap-2 text-accent text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            Agent Eric is thinking...
          </div>
        </div>
      )}

      {aiResponse && (
        <div className="mt-4 p-5 bg-accent-light border border-accent/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm font-semibold">Agent Eric recommends</span>
          </div>
          <div className="text-ink text-sm leading-relaxed whitespace-pre-line">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
}
