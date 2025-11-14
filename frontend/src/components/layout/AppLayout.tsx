import type { JSX } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AppLayout(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <span className="text-xl">☕</span>
            <span className="text-lg font-semibold text-slate-900">
              CoffeeTópico
            </span>
          </button>

          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${
                  isActive
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Cafés
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${
                  isActive
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Favoritos
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md ${
                  isActive
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Perfil
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user && (
              <div className="flex flex-col items-end">
                <span className="font-medium text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
