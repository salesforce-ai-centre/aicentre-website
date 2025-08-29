/**
 * Agentforce Chat Component
 * 
 * A multi-modal AI chat assistant specifically designed for the Salesforce AI Centre.
 * Provides three different chat interfaces: compact widget, sidebar, and fullscreen modal.
 * Styled with purple gradient theme and glassmorphism effects to match the main site.
 * 
 * Features:
 * - Three display modes: compact widget, sidebar, fullscreen
 * - Context-aware responses about AI Centre offerings
 * - Preset quick action buttons for common queries
 * - Typing indicators and message timestamps
 * - Responsive design with smooth animations
 * 
 * @component
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { X, Maximize2, Minimize2, Send, Sparkles, ArrowLeft, ArrowRight, PanelRightOpen, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import FormattedText from './FormattedText';
import { usePathname } from 'next/navigation';

// Type definition for chat messages
interface Message {
  id: string;           // Unique identifier for each message
  text: string;         // Message content
  isUser: boolean;      // True if message is from user, false if from AI
  timestamp: Date;      // When the message was sent
}

// Predefined quick action messages tailored to AI Centre use cases
const presetMessages = [
  "Help me choose the right workshop",
  "What's included in customer engagements?", 
  "How do I book via Slack?",
  "Show me technical workshops"
];

export default function AgentforceChat() {
  // ==================== CHAT CONTEXT INTEGRATION ====================
  
  const { isOpen, setIsOpen, initialMessage, clearInitialMessage, setIsSidebarOpen, sidebarSide, setSidebarSide } = useChat();
  const pathname = usePathname();
  
  // ==================== STATE MANAGEMENT ====================
  
  // Controls fullscreen modal display
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Controls sidebar display mode
  const [isSidebar, setIsSidebar] = useState(false);
  
  // Array of all chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Current input field value
  const [inputValue, setInputValue] = useState('');
  
  // Shows typing indicator when AI is "responding"
  const [isTyping, setIsTyping] = useState(false);
  
  // Salesforce session management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sequenceId, setSequenceId] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Reference for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const floatingButtonRef = useRef<HTMLButtonElement>(null);
  
  // Don't render the chat on the access-denied page
  if (pathname === '/access-denied') {
    return null;
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Automatically scrolls chat to the bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==================== SALESFORCE SESSION MANAGEMENT ====================
  
  /**
   * Initialize Salesforce agent session
   */
  const initializeSession = useCallback(async () => {
    if (isInitialized || isConnecting) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      const response = await fetch('/api/agent/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      
      // Show user-friendly error message
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

  // Initialize session when chat opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeSession();
    }
  }, [isOpen, isInitialized, initializeSession]);

  // Sync local sidebar state with global context
  useEffect(() => {
    setIsSidebarOpen(isSidebar);
  }, [isSidebar, setIsSidebarOpen]);


  // ==================== ANIMATION HELPERS ====================
  
  /**
   * Simple transition between chat modes
   */
  const transitionToMode = useCallback((targetMode: 'compact' | 'sidebar' | 'fullscreen' | 'closed') => {
    setIsAnimating(true);
    
    setTimeout(() => {
      switch (targetMode) {
        case 'sidebar':
          setIsExpanded(false);
          // On mobile, redirect sidebar to fullscreen
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

  // ==================== MESSAGE HANDLING ====================
  
  /**
   * Processes and sends a new message to Salesforce Agent
   * @param text - The message text to send
   */
  const sendMessage = useCallback(async (text: string) => {
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    // Create user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to Salesforce Agent API
      const response = await fetch('/api/agent/message-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: text,
          sequenceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Extract response text from Salesforce response
      let responseText = "I'm processing your request...";
      if (data.response && data.response.messages) {
        const agentMessage = data.response.messages.find((msg: any) => msg.role === 'assistant');
        if (agentMessage && agentMessage.content) {
          responseText = agentMessage.content;
        }
      }

      // Create and add AI response
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
      
      // Show error message to user
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

  // Handle initial message from search - always auto-send
  useEffect(() => {
    if (isOpen && initialMessage && sessionId) {
      // Auto-send the message immediately once session is ready
      sendMessage(initialMessage);
      clearInitialMessage();
      // Auto-expand to show the conversation
      if (!isExpanded && !isSidebar) {
        setIsExpanded(true);
      }
    }
  }, [isOpen, initialMessage, sessionId, clearInitialMessage, isExpanded, isSidebar, sendMessage]);

  /**
   * Retry connection to Salesforce
   */
  const retryConnection = useCallback(() => {
    setIsInitialized(false);
    setSessionId(null);
    setConnectionError(null);
    setSequenceId(1);
    initializeSession();
  }, [initializeSession]);

  /**
   * Handles clicking on preset message buttons
   * Automatically expands chat if not already expanded
   */
  const handlePresetClick = (message: string) => {
    if (!sessionId && !isConnecting) {
      initializeSession();
      // Store message to send once session is ready
      setTimeout(() => sendMessage(message), 1000);
    } else if (sessionId) {
      sendMessage(message);
    }
    // Auto-expand to show conversation if in compact mode
    if (!isExpanded && !isSidebar) {
      setIsExpanded(true);
    }
  };

  /**
   * Handles form submission for text input
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      // Auto-expand to show conversation if in compact mode
      if (!isExpanded && !isSidebar) {
        setIsExpanded(true);
      }
    }
  };

  // ==================== RENDER MODES ====================

  /**
   * FLOATING BUTTON MODE
   * Shows when chat is completely closed
   * Displays animated floating action button in bottom right
   */
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={floatingButtonRef}
          onClick={() => transitionToMode('compact')}
          className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open Agent Eric"
        >
          {/* Online status indicators */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        </button>
        
        {/* Hover tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Hi! I&apos;m Agent Eric - Ask me about AI Centre offerings! 💜
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  /**
   * SIDEBAR MODE
   * Shows chat as a right-side panel overlay
   * Optimized for narrow width with vertical layout
   */
  if (isSidebar) {
    return (
      <>
        {/* Sidebar panel - no backdrop, allows interaction with main site */}
        <div 
          ref={chatContainerRef}
          className={`fixed top-0 z-50 h-full w-80 lg:w-96 bg-gray-900 shadow-2xl flex flex-col agentforce-chat border border-gray-700 transition-all duration-300 ease-in-out ${
            sidebarSide === 'left' 
              ? 'left-0' 
              : 'right-0'
          } ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
        >
          {/* Sidebar header with navigation controls */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {/* AI avatar with online indicator */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src="/images/Avatars.png" 
                    alt="Agent Eric" 
                    width={32} 
                    height={32} 
                    className="w-full h-full object-cover"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Agent Eric</h3>
                <p className="text-xs text-white/80">AI Centre Helper</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
                title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}
              >
                {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              </button>
              <button
                onClick={() => transitionToMode('fullscreen')}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
                title="Expand to fullscreen"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={() => transitionToMode('compact')}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800">
            {/* Welcome state when no messages */}
            {messages.length === 0 && (
              <div className="text-center mt-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  {isConnecting ? (
                    <>
                      <h4 className="text-lg font-semibold text-white mb-2">Connecting...</h4>
                      <p className="text-white/70 text-sm">Setting up your AI assistant</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <h4 className="text-lg font-semibold text-red-400 mb-2">Connection Error</h4>
                      <p className="text-white/70 text-sm mb-3">Unable to connect to AI system</p>
                      <button
                        onClick={retryConnection}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                      >
                        Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg font-semibold text-white mb-2">How can I help?</h4>
                      <p className="text-white/70 text-sm">I&apos;m Agent Eric, ask me about AI Centre offerings</p>
                    </>
                  )}
                </div>
                {/* Preset buttons stacked vertically for sidebar */}
                {!connectionError && (
                  <div className="space-y-2">
                    {presetMessages.map((message) => (
                      <button
                        key={message}
                        onClick={() => handlePresetClick(message)}
                        disabled={isConnecting || !sessionId}
                        className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {message}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Render all messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-700 border border-gray-600 text-white'
                  }`}
                >
                  {message.isUser ? (
                    <p className="leading-relaxed">{message.text}</p>
                  ) : (
                    <FormattedText text={message.text} />
                  )}
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-white/50'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 border border-gray-600 text-white p-3 rounded-xl">
                  <div className="flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="ml-2 text-xs text-white/70">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Sidebar input area */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !sessionId || isConnecting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  /**
   * FULLSCREEN MODE
   * Shows chat as a large centered modal overlay
   * Provides maximum space for conversation
   */
  if (isExpanded) {
    return (
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 agentforce-chat transition-opacity duration-300 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}>
        <div 
          ref={chatContainerRef}
          className={`w-full max-w-4xl h-[85vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
        >
          {/* Fullscreen header */}
          <div className="flex items-center justify-between p-3 md:p-6 bg-gradient-to-r from-purple-600 to-indigo-600 border-b border-gray-700">
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* AI avatar and info */}
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                  <Image 
                    src="/images/Avatars.png" 
                    alt="Agent Eric" 
                    width={40} 
                    height={40} 
                    className="w-full h-full object-cover"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-white">Agent Eric</h3>
                <p className="text-xs md:text-sm text-white/80 hidden sm:block">Here to help with customer engagements</p>
              </div>
            </div>
            {/* Navigation controls */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <button
                onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')}
                className="hidden md:flex text-white/80 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                title={`Sidebar will open on ${sidebarSide === 'left' ? 'right' : 'left'} side`}
              >
                {sidebarSide === 'left' ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <button
                onClick={() => transitionToMode('sidebar')}
                className="hidden md:flex text-white/80 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                title="Open as sidebar"
              >
                {sidebarSide === 'left' ? <PanelRightOpen className="w-4 h-4 md:w-5 md:h-5" /> : <PanelLeftOpen className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              <button
                onClick={() => transitionToMode('compact')}
                className="text-white/80 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => transitionToMode('closed')}
                className="text-white/80 hover:text-white p-1 md:p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                title="Close"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-800">
            {/* Welcome state for fullscreen */}
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-white" />
                  </div>
                  {isConnecting ? (
                    <>
                      <h4 className="text-xl font-semibold text-white mb-2">Connecting to AI Assistant...</h4>
                      <p className="text-white/70">Setting up your conversation</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <h4 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h4>
                      <p className="text-white/70 mb-4">Unable to connect to our AI system</p>
                      <button
                        onClick={retryConnection}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm transition-all duration-200"
                      >
                        Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="text-xl font-semibold text-white mb-2">How can I help you today?</h4>
                      <p className="text-white/70">I&apos;m here to assist with AI Centre customer engagements</p>
                    </>
                  )}
                </div>
                {/* Preset buttons in grid layout for fullscreen */}
                <div className="flex flex-wrap justify-center gap-3">
                  {presetMessages.map((message) => (
                    <button
                      key={message}
                      onClick={() => handlePresetClick(message)}
                      className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Render all messages with more spacing */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-700 border border-gray-600 text-white'
                  }`}
                >
                  {message.isUser ? (
                    <p className="leading-relaxed">{message.text}</p>
                  ) : (
                    <FormattedText text={message.text} />
                  )}
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-white/50'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator for fullscreen */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 border border-gray-600 text-white p-4 rounded-2xl">
                  <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="ml-2 text-sm text-white/70">Agent Eric is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Fullscreen input area */}
          <div className="p-6 bg-gray-800 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about workshops, bookings, or customer engagements..."
                className="flex-1 p-4 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /**
   * COMPACT WIDGET MODE
   * Shows as small bottom-right widget when opened but not expanded
   * Provides quick access and preset buttons
   */
  return (
    <div 
      ref={chatContainerRef}
      className={`fixed bottom-6 z-50 agentforce-chat transition-all duration-300 ease-in-out w-full px-4 md:w-auto md:max-w-md md:right-6 md:left-auto md:px-0 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Compact widget header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            {/* AI avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src="/images/Avatars.png" 
                  alt="Agent Eric" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            <div>
              <span className="text-white font-medium text-sm">Agent Eric</span>
              <p className="text-white/70 text-xs">Ask me anything!</p>
            </div>
          </div>
          {/* Compact widget controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                const newSide = sidebarSide === 'left' ? 'right' : 'left';
                setSidebarSide(newSide);
              }}
              className="hidden md:flex text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
              title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}
            >
              {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
            <button
              onClick={() => transitionToMode('sidebar')}
              className="hidden md:flex text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
              title="Open as sidebar"
            >
              {sidebarSide === 'left' ? <PanelRightOpen size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <button
              onClick={() => transitionToMode('fullscreen')}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
              title="Expand"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={() => transitionToMode('closed')}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-all duration-200"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Compact widget content */}
        <div className="p-4">
          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex space-x-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="How can I help you?"
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-3 rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              <Send size={16} />
            </button>
          </form>

          {/* Quick action preset buttons in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {presetMessages.slice(0, 4).map((message) => (
              <button
                key={message}
                onClick={() => handlePresetClick(message)}
                className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left"
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