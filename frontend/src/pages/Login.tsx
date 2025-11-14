import { useState, type FormEvent } from 'react';
import { login, setAuthToken, setAuthUser } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);

      if (data?.token) {
        setAuthToken(data.token);
      }
      if (data?.user) {
        setAuthUser(data.user);
      }

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  }

  return (
    <div className="auth-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">
            CoffeeTópico ☕
          </Link>
          <p className="muted">Login na área do usuário</p>
        </div>
        <div className="topbar-right">
          <Link to="/signup" className="top-button secondary">
            Criar conta
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Entrar</h1>
          <p className="auth-subtitle">Use o mesmo email da API.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button className="auth-button" type="submit">
              Entrar
            </button>
          </form>

          <p className="auth-footer">
            Não tem conta?{' '}
            <Link to="/signup" className="link-inline">
              Criar agora
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
