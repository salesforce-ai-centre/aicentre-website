'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openChatWithMessage: (message: string) => void;
  initialMessage: string | null;
  clearInitialMessage: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  sidebarSide: 'left' | 'right';
  setSidebarSide: (side: 'left' | 'right') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>('right');

  const openChatWithMessage = (message: string) => {
    setInitialMessage(message);
    setIsOpen(true);
  };

  const clearInitialMessage = () => {
    setInitialMessage(null);
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      openChatWithMessage,
      initialMessage,
      clearInitialMessage,
      isSidebarOpen,
      setIsSidebarOpen,
      sidebarSide,
      setSidebarSide
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}