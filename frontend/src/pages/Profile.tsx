// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMyProfile,
  updateMyProfile,
  clearAuth,
  getAuthToken,
} from '../lib/api';

type Profile = {
  name?: string;
  email?: string;
  role?: string;
  favoriteRoast?: string;
  prefersMilk?: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);

  const isLogged = !!getAuthToken();

  useEffect(() => {
    if (!isLogged) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getMyProfile();
        const p = (data as any).profile || data;
        setProfile(p);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, [isLogged]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await updateMyProfile(profile);
      const p = (updated as any).profile || updated;
      setProfile(p);
      setEdit(false);
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  }

  if (!isLogged) {
    return (
      <div className="app-shell">
        <p className="status-text" style={{ padding: '24px' }}>
          Faça <Link to="/login">login</Link> para ver seu perfil.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-shell">
        <p className="status-text" style={{ padding: '24px' }}>
          Carregando perfil…
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="app-shell">
        <p className="error-text" style={{ padding: '24px' }}>
          {error || 'Perfil não encontrado.'}
        </p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">CoffeeTópico</span>
          <span className="brand-dot">☕</span>
        </div>

        <nav className="app-nav">
          <Link to="/" className="nav-link">
            Início
          </Link>
          <Link to="/coffees" className="nav-link">
            Catálogo
          </Link>
          <Link to="/profile" className="nav-link nav-link-active">
            Meu perfil
          </Link>
        </nav>

        <div className="auth-area">
          <button
            className="secondary-btn"
            onClick={() => {
              clearAuth();
              window.location.href = '/';
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main className="page-main">
        <section className="profile-card">
          <div className="profile-header">
            <h1 className="page-title">Meu perfil</h1>
            <button
              className="secondary-btn"
              onClick={() => setEdit((v) => !v)}
            >
              {edit ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <form className="profile-grid" onSubmit={handleSubmit}>
            <label>
              <span>Nome</span>
              <input
                value={profile.name ?? ''}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!edit}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                value={profile.email ?? ''}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                disabled
              />
            </label>

            <label>
              <span>Função</span>
              <input
                value={profile.role ?? ''}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                disabled={!edit}
              />
            </label>

            <label>
              <span>Torra preferida</span>
              <select
                value={profile.favoriteRoast ?? ''}
                onChange={(e) =>
                  setProfile({ ...profile, favoriteRoast: e.target.value })
                }
                disabled={!edit}
              >
                <option value="">Não definido</option>
                <option value="light">Clara</option>
                <option value="medium">Média</option>
                <option value="dark">Escura</option>
              </select>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={profile.prefersMilk ?? false}
                onChange={(e) =>
                  setProfile({ ...profile, prefersMilk: e.target.checked })
                }
                disabled={!edit}
              />
              <span>Prefiro bebidas com leite (latte, cappuccino, mocha…)</span>
            </label>

            {edit && (
              <div className="profile-actions">
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? 'Salvando…' : 'Salvar alterações'}
                </button>
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
