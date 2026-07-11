'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { TOKEN_STORAGE_KEY, useUser } from '@/context/UserProvider';

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

type ItemsContextValue = {
  items: Item[];
  itemsLoading: boolean;
  updateItem: (item: Item) => void;
};

const ItemsContext = createContext<ItemsContextValue | null>(null);

export const useItems = () => {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }

  return context;
};

const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

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
    if (!user) {
      setItems([]);

      return;
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      return;
    }

    fetchItems(token);
  }, [user, fetchItems]);

  const updateItem = useCallback((item: Item) => {
    setItems(prev => prev.map(i => (i.id === item.id ? item : i)));
  }, []);

  return <ItemsContext.Provider value={{ items, itemsLoading, updateItem }}>{children}</ItemsContext.Provider>;
};

export default ItemsProvider;
