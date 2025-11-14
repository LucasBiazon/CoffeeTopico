import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { CoffeeListPage } from './features/coffees/CoffeeListPage';
import { CoffeeDetailsPage } from './features/coffees/CoffeeDetailsPage';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { useAuth } from './context/AuthContext';
import type { JSX } from 'react';
import { FavoritesPage } from './features/favorites/FavoritesPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<CoffeeListPage />} />
        <Route path="/coffees/:id" element={<CoffeeDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
