import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoffeeList from './pages/CoffeeList';
import CoffeeDetails from './pages/CoffeeDetails';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ProfilePage from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoffeeList />} />
        <Route path="/coffees/:id" element={<CoffeeDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
