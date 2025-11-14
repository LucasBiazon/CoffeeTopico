import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { CoffeeDetailsPage } from './features/coffees/CoffeeDetailsPage';
import { CoffeeListPage } from './features/coffees/CoffeeListPage';
import { ProfilePage } from './features/profile/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CoffeeListPage />} />
      <Route path="/coffees" element={<CoffeeListPage />} />
      <Route path="/coffees/:id" element={<CoffeeDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
