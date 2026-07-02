'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import { X, Maximize2, Minimize2, Send, Sparkles, ArrowLeft, ArrowRight, PanelRightOpen, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import FormattedText from './FormattedText';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const presetMessages = [
  "Recommend an engagement for executive AI alignment",
  "What tier and format works for upskilling a team of 20?",
  "Help me plan a half-day customer visit",
  "My customer wants to explore Agentforce use cases"
];

export default function AgentforceChat() {
  const { isOpen, setIsOpen, initialMessage, clearInitialMessage, setIsSidebarOpen, sidebarSide, setSidebarSide } = useChat();
  const { user, firstName } = useUser();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebar, setIsSidebar] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sequenceId, setSequenceId] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const floatingButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSession = useCallback(async () => {
    if (isInitialized || isConnecting) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const response = await fetch('/api/agent/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to initialize session`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setIsInitialized(true);
      setConnectionError(null);
    } catch (error) {
      console.error('Failed to initialize Salesforce session:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setConnectionError(errorMsg);

      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble connecting to our AI system right now. Please try refreshing the page or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsConnecting(false);
    }
  }, [isInitialized, isConnecting]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeSession();
    }
  }, [isOpen, isInitialized, initializeSession]);

  useEffect(() => {
    setIsSidebarOpen(isSidebar);
  }, [isSidebar, setIsSidebarOpen]);

  const transitionToMode = useCallback((targetMode: 'compact' | 'sidebar' | 'fullscreen' | 'closed') => {
    setIsAnimating(true);

    setTimeout(() => {
      switch (targetMode) {
        case 'sidebar':
          setIsExpanded(false);
          if (window.innerWidth < 768) {
            setIsSidebar(false);
            setIsSidebarOpen(false);
            setIsExpanded(true);
          } else {
            setIsSidebar(true);
          }
          if (!isOpen) setIsOpen(true);
          break;
        case 'fullscreen':
          setIsSidebar(false);
          setIsSidebarOpen(false);
          setIsExpanded(true);
          if (!isOpen) setIsOpen(true);
          break;
        case 'compact':
          setIsSidebar(false);
          setIsSidebarOpen(false);
          setIsExpanded(false);
          if (!isOpen) setIsOpen(true);
          break;
        case 'closed':
          setIsOpen(false);
          setIsSidebar(false);
          setIsSidebarOpen(false);
          setIsExpanded(false);
          break;
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }, 50);
  }, [isOpen, setIsSidebarOpen, setIsOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/agent/message-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          sequenceId,
          userContext: user ? { name: user.name, email: user.email } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      let responseText = "I'm processing your request...";
      if (data.response && data.response.messages) {
        const agentMessage = data.response.messages.find((msg: any) => msg.role === 'assistant');
        if (agentMessage && agentMessage.content) {
          responseText = agentMessage.content;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setSequenceId(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, sequenceId]);

  useEffect(() => {
    if (isOpen && initialMessage && sessionId) {
      sendMessage(initialMessage);
      clearInitialMessage();
      if (!isExpanded && !isSidebar) {
        setIsExpanded(true);
      }
    }
  }, [isOpen, initialMessage, sessionId, clearInitialMessage, isExpanded, isSidebar, sendMessage]);

  const retryConnection = useCallback(() => {
    setIsInitialized(false);
    setSessionId(null);
    setConnectionError(null);
    setSequenceId(1);
    initializeSession();
  }, [initializeSession]);

  if (pathname === '/login') {
    return null;
  }

  const handlePresetClick = (message: string) => {
    if (!sessionId && !isConnecting) {
      initializeSession();
      setTimeout(() => sendMessage(message), 1000);
    } else if (sessionId) {
      sendMessage(message);
    }
    if (!isExpanded && !isSidebar) {
      setIsExpanded(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      if (!isExpanded && !isSidebar) {
        setIsExpanded(true);
      }
    }
  };

  // FLOATING BUTTON MODE
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={floatingButtonRef}
          onClick={() => transitionToMode('compact')}
          className="group relative bg-accent hover:bg-accent-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open Agent Eric"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    );
  }

  // SIDEBAR MODE
  if (isSidebar) {
    return (
      <div
        ref={chatContainerRef}
        className={`fixed top-0 z-50 h-full w-80 lg:w-96 bg-white shadow-2xl flex flex-col agentforce-chat border border-border transition-all duration-300 ease-in-out ${
          sidebarSide === 'left' ? 'left-0' : 'right-0'
        } ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent border-b border-accent-dark">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src="/images/Avatars.png" alt="Agent Eric" width={32} height={32} className="w-full h-full object-cover" style={{ width: 'auto', height: 'auto' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Agent Eric</h3>
              <p className="text-xs text-white/90">AI Centre Helper</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')} className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}>
              {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
            <button onClick={() => transitionToMode('fullscreen')} className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title="Expand to fullscreen">
              <Maximize2 size={16} />
            </button>
            <button onClick={() => transitionToMode('compact')} className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
          {messages.length === 0 && (
            <div className="text-center mt-6">
              <div className="mb-4">
                <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-accent" />
                </div>
                {isConnecting ? (
                  <>
                    <h4 className="text-lg font-semibold text-ink mb-2">Connecting...</h4>
                    <p className="text-ink-secondary text-sm">Setting up your AI assistant</p>
                  </>
                ) : connectionError ? (
                  <>
                    <h4 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h4>
                    <p className="text-ink-secondary text-sm mb-3">Unable to connect to AI system</p>
                    <button onClick={retryConnection} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200">
                      Retry Connection
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-semibold text-ink mb-2">{firstName ? `Hey ${firstName}, how can I help?` : 'How can I help?'}</h4>
                    <p className="text-ink-secondary text-sm">I&apos;m Agent Eric, ask me about AI Centre offerings</p>
                  </>
                )}
              </div>
              {!connectionError && (
                <div className="space-y-2">
                  {presetMessages.map((message) => (
                    <button
                      key={message}
                      onClick={() => handlePresetClick(message)}
                      disabled={isConnecting || !sessionId}
                      className="w-full bg-surface-muted hover:bg-border/50 border border-border text-ink px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                message.isUser
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-surface-muted border border-border text-ink'
              }`}>
                {message.isUser ? (
                  <p className="leading-relaxed">{message.text}</p>
                ) : (
                  <FormattedText text={message.text} />
                )}
                <p className={`text-xs mt-2 ${message.isUser ? 'text-white/80' : 'text-ink-tertiary'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-muted border border-border text-ink p-3 rounded-xl">
                <div className="flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2 text-xs text-ink-tertiary">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-border">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-ink placeholder-ink-tertiary text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || !sessionId || isConnecting}
              className="bg-accent hover:bg-accent-dark text-white px-3 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // FULLSCREEN MODE
  if (isExpanded) {
    return (
      <div className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 agentforce-chat transition-opacity duration-300 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}>
        <div
          ref={chatContainerRef}
          className={`w-full max-w-4xl h-[85vh] bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-6 bg-accent border-b border-accent-dark">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                  <Image src="/images/Avatars.png" alt="Agent Eric" width={40} height={40} className="w-full h-full object-cover" style={{ width: 'auto', height: 'auto' }} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-white">Agent Eric</h3>
                <p className="text-xs md:text-sm text-white/90 hidden sm:block">Here to help with customer engagements</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <button onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')} className="hidden md:flex text-white/90 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200" title={`Sidebar will open on ${sidebarSide === 'left' ? 'right' : 'left'} side`}>
                {sidebarSide === 'left' ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <button onClick={() => transitionToMode('sidebar')} className="hidden md:flex text-white/90 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200" title="Open as sidebar">
                {sidebarSide === 'left' ? <PanelRightOpen className="w-4 h-4 md:w-5 md:h-5" /> : <PanelLeftOpen className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <button onClick={() => transitionToMode('compact')} className="text-white/90 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200" title="Minimize">
                <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button onClick={() => transitionToMode('closed')} className="text-white/90 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200" title="Close">
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-accent" />
                  </div>
                  {isConnecting ? (
                    <>
                      <h4 className="text-xl font-semibold text-ink mb-2">Connecting to AI Assistant...</h4>
                      <p className="text-ink-secondary">Setting up your conversation</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <h4 className="text-xl font-semibold text-red-600 mb-2">Connection Error</h4>
                      <p className="text-ink-secondary mb-4">Unable to connect to our AI system</p>
                      <button onClick={retryConnection} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm transition-all duration-200">
                        Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="text-xl font-semibold text-ink mb-2">{firstName ? `Hey ${firstName}, how can I help?` : 'How can I help you today?'}</h4>
                      <p className="text-ink-secondary">I&apos;m here to assist with AI Centre customer engagements</p>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {presetMessages.map((message) => (
                    <button
                      key={message}
                      onClick={() => handlePresetClick(message)}
                      className="bg-surface-muted hover:bg-border/50 border border-border text-ink px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-4 rounded-2xl ${
                  message.isUser
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-surface-muted border border-border text-ink'
                }`}>
                  {message.isUser ? (
                    <p className="leading-relaxed">{message.text}</p>
                  ) : (
                    <FormattedText text={message.text} />
                  )}
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-white/80' : 'text-ink-tertiary'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-muted border border-border text-ink p-4 rounded-2xl">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="ml-2 text-sm text-ink-tertiary">Agent Eric is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-6 bg-white border-t border-border">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about workshops, bookings, or customer engagements..."
                className="flex-1 p-4 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-ink placeholder-ink-tertiary"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-accent hover:bg-accent-dark text-white px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // COMPACT WIDGET MODE
  return (
    <div
      ref={chatContainerRef}
      className={`fixed bottom-6 z-50 agentforce-chat transition-all duration-300 ease-in-out w-full px-4 md:w-auto md:max-w-md md:right-6 md:left-auto md:px-0 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
    >
      <div className="bg-white border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src="/images/Avatars.png" alt="Agent Eric" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div>
              <span className="text-white font-medium text-sm">Agent Eric</span>
              <p className="text-white/85 text-xs">Ask me anything!</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')} className="hidden md:flex text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}>
              {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
            <button onClick={() => transitionToMode('sidebar')} className="hidden md:flex text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title="Open as sidebar">
              {sidebarSide === 'left' ? <PanelRightOpen size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <button onClick={() => transitionToMode('fullscreen')} className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title="Expand">
              <Maximize2 size={16} />
            </button>
            <button onClick={() => transitionToMode('closed')} className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200" title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="How can I help you?"
              className="flex-1 p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-ink placeholder-ink-tertiary text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-accent hover:bg-accent-dark text-white px-3 py-3 rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              <Send size={16} />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {presetMessages.slice(0, 4).map((message) => (
              <button
                key={message}
                onClick={() => handlePresetClick(message)}
                className="bg-surface-muted hover:bg-border/50 border border-border text-ink px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
