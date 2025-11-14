import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoffeeListPage from './pages/CoffeeList';
import CoffeeDetailsPage from './pages/CoffeeDetails';
import ProfilePage from './pages/Profile';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoffeeListPage />} />
        <Route path="/coffees/:id" element={<CoffeeDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
