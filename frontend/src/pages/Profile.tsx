// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile, clearAuth } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{ name?: string; email?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setForm({ name: data.name, email: data.email });
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfil');
      }
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    }
  }

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">
            CoffeeTópico ☕
          </Link>
          <p className="muted">Seu perfil</p>
        </div>
        <div className="topbar-right">
          <button onClick={handleLogout} className="top-button secondary">
            Sair
          </button>
        </div>
      </header>

      <main className="page-body">
        <h1 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Meu perfil</h1>

        {error && <p className="error-text">{error}</p>}

        {!profile && !error && <p>Carregando…</p>}

        {!profile && error && (
          <p>
            Você não está logado. <Link to="/login">Fazer login</Link>
          </p>
        )}

        {profile && (
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.03)',
              borderRadius: '16px',
              padding: '16px',
              maxWidth: '420px',
            }}
          >
            {!editing ? (
              <>
                <p>
                  <strong>Nome:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                {profile.role && (
                  <p>
                    <strong>Role:</strong> {profile.role}
                  </p>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="top-button"
                  style={{ marginTop: '12px' }}
                >
                  Editar dados
                </button>
              </>
            ) : (
              <>
                <label style={{ fontSize: '0.7rem' }}>Nome</label>
                <input
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  className="auth-input"
                />
                <label style={{ fontSize: '0.7rem' }}>Email</label>
                <input
                  name="email"
                  value={form.email || ''}
                  onChange={handleChange}
                  className="auth-input"
                />

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSave}
                    className="auth-button"
                    style={{ marginTop: '6px' }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="top-button secondary"
                    style={{ marginTop: '6px' }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
