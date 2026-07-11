'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Item = {
  id: string;
  user_id: string;
  item_name: string;
  person_name: string;
  is_borrowed: boolean;
  lent_at: string;
  returned_at: string | null;
  notes: string | null;
};

type UserContextValue = {
  user: User | null;
  items: Item[];
  itemsLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  updateItem: (item: Item) => void;
};

const TOKEN_STORAGE_KEY = 'who-has-it:token';

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
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState<boolean>(true);

  const fetchItems = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(error);

      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  }, []);

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
    fetchItems(token);
  }, [fetchItems]);

  const signIn = useCallback(
    (token: string) => {
      const decodedUser = decodeToken(token);

      if (!decodedUser) {
        return;
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      setUser(decodedUser);
      fetchItems(token);
    },
    [fetchItems]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    setUser(null);
    setItems([]);
  }, []);

  const updateItem = useCallback((item: Item) => {
    setItems(prev => prev.map(i => (i.id === item.id ? item : i)));
  }, []);

  return (
    <UserContext.Provider value={{ user, items, itemsLoading, signIn, signOut, updateItem }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
