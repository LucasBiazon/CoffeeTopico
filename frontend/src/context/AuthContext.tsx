import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../lib/api';
import { clearAuth } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser(user: User | null): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  function setUser(next: User | null) {
    if (next) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    setUserState(next);
  }

  function logout() {
    clearAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
