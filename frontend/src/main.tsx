// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';
import { AppRouter } from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <AppRouter />
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
