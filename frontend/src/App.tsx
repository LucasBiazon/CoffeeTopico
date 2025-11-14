import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/Header';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { CoffeeDetailsPage } from './features/coffees/CoffeeDetailsPage';
import HomePage from './features/HomePage';

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coffees/:id" element={<CoffeeDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
