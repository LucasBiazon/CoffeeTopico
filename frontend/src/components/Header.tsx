import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink to="/" className="app-brand">
          <span className="app-logo">☕</span>
          <span className="app-title">CoffeeTópico</span>
        </NavLink>

        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link-active' : '')
            }
          >
            Catálogo
          </NavLink>
        </nav>

        <div className="app-nav-auth">
          {!user && (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  'nav-link nav-link-secondary' +
                  (isActive ? ' nav-link-active' : '')
                }
              >
                Criar conta
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'nav-link nav-link-primary' +
                  (isActive ? ' nav-link-active' : '')
                }
              >
                Entrar
              </NavLink>
            </>
          )}

          {user && (
            <>
              <span className="nav-user">
                Olá, <strong>{user.name ?? 'Coffeenerd'}</strong>
              </span>
              <button
                type="button"
                className="btn btn-outline"
                onClick={logout}
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
