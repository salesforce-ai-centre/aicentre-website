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
import styles from './AgentforceChat.module.css';

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

  // Don't render the chat on the access-denied page
  if (pathname === '/get-access') {
    return null;
  }

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
      <div className={styles.floatingWrapper}>
        <button
          ref={floatingButtonRef}
          onClick={() => transitionToMode('compact')}
          className={styles.floatingButton}
          aria-label="Open Agent Eric"
        >
          {/* Online status indicators */}
          <div className={styles.floatingBadge}></div>
          <div className={styles.floatingBadge}></div>
          <Sparkles size={24} className={styles.floatingIcon} />
        </button>

        {/* Hover tooltip */}
        <div className={styles.tooltip}>
          Hi! I&apos;m Agent Eric - Ask me about AI Centre offerings! 💜
          <div className={styles.tooltipArrow}></div>
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
          className={`${styles.sidebarPanel} agentforce-chat ${
            sidebarSide === 'left'
              ? styles.sidebarLeft
              : styles.sidebarRight
          } ${isAnimating ? styles.animating : styles.notAnimating}`}
        >
          {/* Sidebar header with navigation controls */}
          <div className={`${styles.headerBar} ${styles.sidebarHeader}`}>
            <div className={styles.headerIdentity}>
              {/* AI avatar with online indicator */}
              <div className={styles.avatarWrapper}>
                <div className={styles.headerAvatarCircle}>
                  <Image
                    src="/images/Avatars.png"
                    alt="Agent Eric"
                    width={32}
                    height={32}
                    className={styles.headerAvatarImage}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className={styles.onlineDot}></div>
              </div>
              <div>
                <h3 className={styles.headerName}>Agent Eric</h3>
                <p className={styles.headerSubtitle}>AI Centre Helper</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className={styles.headerActions}>
              <button
                onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')}
                className={styles.headerIconButton}
                title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}
              >
                {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              </button>
              <button
                onClick={() => transitionToMode('fullscreen')}
                className={styles.headerIconButton}
                title="Expand to fullscreen"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={() => transitionToMode('compact')}
                className={styles.headerIconButton}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar messages area */}
          <div className={styles.sidebarMessages}>
            {/* Welcome state when no messages */}
            {messages.length === 0 && (
              <div className={styles.welcomeBlock}>
                <div className={styles.welcomeIntro}>
                  <div className={`${styles.welcomeIconCircle} ${styles.welcomeIconSm}`}>
                    <Sparkles size={24} className={styles.welcomeIcon} />
                  </div>
                  {isConnecting ? (
                    <>
                      <h4 className={styles.welcomeHeadingSm}>Connecting...</h4>
                      <p className={styles.welcomeBodySm}>Setting up your AI assistant</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <h4 className={styles.welcomeHeadingError}>Connection Error</h4>
                      <p className={styles.welcomeBodySmMb}>Unable to connect to AI system</p>
                      <button
                        onClick={retryConnection}
                        className={`${styles.retryButton} ${styles.retryButtonSm}`}
                      >
                        Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className={styles.welcomeHeadingSm}>How can I help?</h4>
                      <p className={styles.welcomeBodySm}>I&apos;m Agent Eric, ask me about AI Centre offerings</p>
                    </>
                  )}
                </div>
                {/* Preset buttons stacked vertically for sidebar */}
                {!connectionError && (
                  <div className={styles.presetListVertical}>
                    {presetMessages.map((message) => (
                      <button
                        key={message}
                        onClick={() => handlePresetClick(message)}
                        disabled={isConnecting || !sessionId}
                        className={`${styles.presetButton} ${styles.presetButtonSm}`}
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
                className={`${styles.messageRow} ${message.isUser ? styles.messageRowUser : styles.messageRowBot}`}
              >
                <div
                  className={`${styles.bubble} ${styles.bubbleSm} ${
                    message.isUser
                      ? styles.bubbleUser
                      : styles.bubbleBot
                  }`}
                >
                  {message.isUser ? (
                    <p className={styles.bubbleText}>{message.text}</p>
                  ) : (
                    <FormattedText text={message.text} />
                  )}
                  <p className={`${styles.timestamp} ${styles.timestampSm} ${message.isUser ? styles.timestampUser : styles.timestampBot}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className={styles.messageRowBot}>
                <div className={`${styles.typingBubble} ${styles.typingBubbleSm}`}>
                  <div className={styles.typingRow}>
                    <div className={`${styles.typingDot} ${styles.typingDotSm}`}></div>
                    <div className={`${styles.typingDot} ${styles.typingDotSm}`}></div>
                    <div className={`${styles.typingDot} ${styles.typingDotSm}`}></div>
                    <span className={`${styles.typingLabel} ${styles.typingLabelSm}`}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Sidebar input area */}
          <div className={styles.sidebarInputArea}>
            <form onSubmit={handleSubmit} className={styles.sidebarInputForm}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className={`${styles.textInput} ${styles.textInputSm}`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !sessionId || isConnecting}
                className={`${styles.sendButton} ${styles.sendButtonSm}`}
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
      <div className={`${styles.fullscreenOverlay} agentforce-chat ${isAnimating ? styles.animating : styles.notAnimating}`}>
        <div
          ref={chatContainerRef}
          className={`${styles.fullscreenModal} ${isAnimating ? styles.animating : styles.notAnimating}`}
        >
          {/* Fullscreen header */}
          <div className={`${styles.headerBar} ${styles.fullscreenHeader}`}>
            <div className={styles.fullscreenIdentity}>
              {/* AI avatar and info */}
              <div className={styles.avatarWrapper}>
                <div className={styles.fullscreenAvatarCircle}>
                  <Image
                    src="/images/Avatars.png"
                    alt="Agent Eric"
                    width={40}
                    height={40}
                    className={styles.headerAvatarImage}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <div className={styles.fullscreenOnlineDot}></div>
              </div>
              <div>
                <h3 className={styles.fullscreenName}>Agent Eric</h3>
                <p className={styles.fullscreenSubtitle}>Here to help with customer engagements</p>
              </div>
            </div>
            {/* Navigation controls */}
            <div className={styles.fullscreenActions}>
              <button
                onClick={() => setSidebarSide(sidebarSide === 'left' ? 'right' : 'left')}
                className={`${styles.hiddenMdFlex} ${styles.fullscreenIconButton}`}
                title={`Sidebar will open on ${sidebarSide === 'left' ? 'right' : 'left'} side`}
              >
                {sidebarSide === 'left' ? <ArrowRight className={styles.fullscreenIcon} /> : <ArrowLeft className={styles.fullscreenIcon} />}
              </button>
              <button
                onClick={() => transitionToMode('sidebar')}
                className={`${styles.hiddenMdFlex} ${styles.fullscreenIconButton}`}
                title="Open as sidebar"
              >
                {sidebarSide === 'left' ? <PanelRightOpen className={styles.fullscreenIcon} /> : <PanelLeftOpen className={styles.fullscreenIcon} />}
              </button>
              <button
                onClick={() => transitionToMode('compact')}
                className={styles.fullscreenIconButton}
                title="Minimize"
              >
                <Minimize2 className={styles.fullscreenIcon} />
              </button>
              <button
                onClick={() => transitionToMode('closed')}
                className={styles.fullscreenIconButton}
                title="Close"
              >
                <X className={styles.fullscreenIcon} />
              </button>
            </div>
          </div>

          {/* Fullscreen messages area */}
          <div className={styles.fullscreenMessages}>
            {/* Welcome state for fullscreen */}
            {messages.length === 0 && (
              <div className={styles.welcomeBlockLg}>
                <div className={styles.welcomeIntroLg}>
                  <div className={`${styles.welcomeIconCircle} ${styles.welcomeIconLg}`}>
                    <Sparkles size={32} className={styles.welcomeIcon} />
                  </div>
                  {isConnecting ? (
                    <>
                      <h4 className={styles.welcomeHeadingLg}>Connecting to AI Assistant...</h4>
                      <p className={styles.welcomeBodyLg}>Setting up your conversation</p>
                    </>
                  ) : connectionError ? (
                    <>
                      <h4 className={styles.welcomeHeadingErrorLg}>Connection Error</h4>
                      <p className={styles.welcomeBodyLgMb}>Unable to connect to our AI system</p>
                      <button
                        onClick={retryConnection}
                        className={`${styles.retryButton} ${styles.retryButtonLg}`}
                      >
                        Retry Connection
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className={styles.welcomeHeadingLg}>How can I help you today?</h4>
                      <p className={styles.welcomeBodyLg}>I&apos;m here to assist with AI Centre customer engagements</p>
                    </>
                  )}
                </div>
                {/* Preset buttons in grid layout for fullscreen */}
                <div className={styles.presetGrid}>
                  {presetMessages.map((message) => (
                    <button
                      key={message}
                      onClick={() => handlePresetClick(message)}
                      className={`${styles.presetButton} ${styles.presetButtonLg}`}
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
                className={`${styles.messageRow} ${message.isUser ? styles.messageRowUser : styles.messageRowBot}`}
              >
                <div
                  className={`${styles.bubble} ${styles.bubbleLg} ${
                    message.isUser
                      ? styles.bubbleUser
                      : styles.bubbleBot
                  }`}
                >
                  {message.isUser ? (
                    <p className={styles.bubbleText}>{message.text}</p>
                  ) : (
                    <FormattedText text={message.text} />
                  )}
                  <p className={`${styles.timestamp} ${message.isUser ? styles.timestampUser : styles.timestampBot}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator for fullscreen */}
            {isTyping && (
              <div className={styles.messageRowBot}>
                <div className={`${styles.typingBubble} ${styles.typingBubbleLg}`}>
                  <div className={styles.typingRow}>
                    <div className={`${styles.typingDot} ${styles.typingDotLg}`}></div>
                    <div className={`${styles.typingDot} ${styles.typingDotLg}`}></div>
                    <div className={`${styles.typingDot} ${styles.typingDotLg}`}></div>
                    <span className={`${styles.typingLabel} ${styles.typingLabelLg}`}>Agent Eric is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Fullscreen input area */}
          <div className={styles.fullscreenInputArea}>
            <form onSubmit={handleSubmit} className={styles.fullscreenInputForm}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about workshops, bookings, or customer engagements..."
                className={`${styles.textInput} ${styles.textInputLg}`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`${styles.sendButton} ${styles.sendButtonLg}`}
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
      className={`${styles.compactWrapper} agentforce-chat ${isAnimating ? styles.animating : styles.notAnimating}`}
    >
      <div className={styles.compactCard}>
        {/* Compact widget header */}
        <div className={`${styles.headerBar} ${styles.compactHeader}`}>
          <div className={styles.headerIdentity}>
            {/* AI avatar */}
            <div className={styles.avatarWrapper}>
              <div className={styles.headerAvatarCircle}>
                <Image
                  src="/images/Avatars.png"
                  alt="Agent Eric"
                  width={32}
                  height={32}
                  className={styles.headerAvatarImage}
                />
              </div>
              <div className={styles.onlineDot}></div>
            </div>
            <div>
              <span className={styles.compactLabel}>Agent Eric</span>
              <p className={styles.compactSubtitle}>Ask me anything!</p>
            </div>
          </div>
          {/* Compact widget controls */}
          <div className={styles.headerActions}>
            <button
              onClick={() => {
                const newSide = sidebarSide === 'left' ? 'right' : 'left';
                setSidebarSide(newSide);
              }}
              className={`${styles.hiddenMdFlex} ${styles.headerIconButton}`}
              title={`Move to ${sidebarSide === 'left' ? 'right' : 'left'} side`}
            >
              {sidebarSide === 'left' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>
            <button
              onClick={() => transitionToMode('sidebar')}
              className={`${styles.hiddenMdFlex} ${styles.headerIconButton}`}
              title="Open as sidebar"
            >
              {sidebarSide === 'left' ? <PanelRightOpen size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <button
              onClick={() => transitionToMode('fullscreen')}
              className={styles.headerIconButton}
              title="Expand"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={() => transitionToMode('closed')}
              className={styles.headerIconButton}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Compact widget content */}
        <div className={styles.compactBody}>
          {/* Input form */}
          <form onSubmit={handleSubmit} className={styles.compactInputForm}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="How can I help you?"
              className={`${styles.textInput} ${styles.textInputSm}`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`${styles.sendButton} ${styles.sendButtonSm}`}
            >
              <Send size={16} />
            </button>
          </form>

          {/* Quick action preset buttons in 2x2 grid */}
          <div className={styles.compactPresetGrid}>
            {presetMessages.slice(0, 4).map((message) => (
              <button
                key={message}
                onClick={() => handlePresetClick(message)}
                className={`${styles.presetButton} ${styles.compactPresetButton}`}
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