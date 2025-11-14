import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <Link to="/" className="logo">
            ☕ CoffeeTópico
          </Link>
          <nav className="nav">
            <Link
              to="/"
              className={
                location.pathname === '/' ? 'nav-link active' : 'nav-link'
              }
            >
              Catálogo
            </Link>
            {user && (
              <Link
                to="/profile"
                className={
                  location.pathname.startsWith('/profile')
                    ? 'nav-link active'
                    : 'nav-link'
                }
              >
                Perfil
              </Link>
            )}
          </nav>
        </div>
        <div className="app-header-right">
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button className="btn-outline" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Entrar
              </Link>
              <Link to="/signup" className="btn">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
