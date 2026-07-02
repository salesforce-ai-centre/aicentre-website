'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  firstName: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const isHumanName = (name: string) =>
    !/^[a-z0-9_]{5,}$/.test(name) && !/^U[A-Z0-9]{8,}$/.test(name);

  const firstName = user?.name && isHumanName(user.name)
    ? user.name.split(' ')[0]
    : '';

  return (
    <UserContext.Provider value={{ user, isLoading, firstName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
