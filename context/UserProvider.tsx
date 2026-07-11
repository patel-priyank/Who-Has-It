'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  email: string;
  created_at: string;
};

type UserContextValue = {
  user: User | null;
  signIn: (token: string) => void;
  signOut: () => void;
};

export const TOKEN_STORAGE_KEY = 'who-has-it:token';

const UserContext = createContext<UserContextValue | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

const decodeToken = (token: string): User | null => {
  try {
    const [, payload] = token.split('.');
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) {
      return null;
    }

    if (!claims.id || !claims.email) {
      return null;
    }

    return { id: claims.id, email: claims.email, created_at: claims.created_at };
  } catch {
    return null;
  }
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return;
    }

    const decodedUser = decodeToken(token);

    if (!decodedUser) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }

    setUser(decodedUser);
  }, []);

  const signIn = useCallback((token: string) => {
    const decodedUser = decodeToken(token);

    if (!decodedUser) {
      return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    setUser(decodedUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setUser(null);
  }, []);

  return <UserContext.Provider value={{ user, signIn, signOut }}>{children}</UserContext.Provider>;
};

export default UserProvider;
