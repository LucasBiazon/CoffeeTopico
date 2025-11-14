// frontend/src/App.tsx
import type { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import { CoffeeListPage } from './features/coffees/CoffeeListPage';
import { FavoritesPage } from './features/favorites/FavoritesPage';
import { ProfilePage } from './features/profile/ProfilePage';

import { useAuth } from './context/AuthContext';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import CoffeeDetailsPage from './features/coffees/CoffeeDetailsPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CoffeeListPage />} />
        <Route path="coffees" element={<CoffeeListPage />} />
        <Route path="coffees/:id" element={<CoffeeDetailsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
