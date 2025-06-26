'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronDown, Send, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const presetMessages = [
  "Summarize this unit",
  "What is an AgentBlazr?",
  "Quiz me!",
  "What all can you do?"
];

export default function AgentforceChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for your question about "${text}". I'm here to help with AI Centre offerings and Agentforce capabilities!`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePresetClick = (message: string) => {
    sendMessage(message);
    if (!isFullScreen) {
      setIsFullScreen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setIsFullScreen(true);
    }
  };

  if (!isOpen) {
    return (
      <div 
        className="agentforce-chat fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open Agentforce Chat"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-lg font-semibold">Hi Jacob! I&apos;m Agentforce for AI Centre, and I&apos;m here to help.</h3>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="text-white hover:text-gray-200 p-1"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="mb-4">How can I help you with AI Centre offerings today?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {presetMessages.map((message) => (
                    <button
                      key={message}
                      onClick={() => handlePresetClick(message)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="agentforce-chat fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-4xl w-full mx-4"
      style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
    >
      {/* Chat Bubble */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <CheckCircle size={20} fill="white" />
            </div>
            <span className="text-white font-medium">Hi Jacob! I&apos;m Agentforce for AI Centre, and I&apos;m here to help.</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Input Field */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder=""
                className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm border-0 w-80"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="ml-2 text-white hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preset Messages */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {presetMessages.map((message) => (
              <button
                key={message}
                onClick={() => handlePresetClick(message)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white border-opacity-30"
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