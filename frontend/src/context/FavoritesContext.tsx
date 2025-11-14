import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadFavoriteIds, saveFavoriteIds } from '../lib/api';

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  toggle: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavoriteIds(loadFavoriteIds());
  }, []);

  const toggle = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavoriteIds(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({
      favoriteIds,
      toggle,
    }),
    [favoriteIds],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
