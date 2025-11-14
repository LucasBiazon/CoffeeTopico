import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { apiGetMyFavorites, apiToggleFavorite, type Coffee } from '../lib/api';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favorites: Coffee[];
  favoriteIds: Set<string>;
  loading: boolean;
  toggle(coffeeId: string): Promise<void>;
  refresh(): Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Coffee[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const res = await apiGetMyFavorites();
      setFavorites(res.items);
      setFavoriteIds(new Set(res.coffeeIds.map(String)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user]);

  async function toggle(coffeeId: string) {
    if (!user) return;
    const res = await apiToggleFavorite(coffeeId);
    const next = new Set(favoriteIds);
    if (res.isFavorite) {
      next.add(coffeeId);
    } else {
      next.delete(coffeeId);
    }
    setFavoriteIds(next);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteIds, loading, toggle, refresh }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  return ctx;
}
