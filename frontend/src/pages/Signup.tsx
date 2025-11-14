import { useState, type FormEvent } from 'react';
import { signup } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user' | ''>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = { name, email, password };
      if (role) payload.role = role;
      await signup(payload);
      // se deu certo, manda pro login
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    }
  }

  return (
    <div className="auth-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">
            CoffeeTópico ☕
          </Link>
          <p className="muted">Criar conta</p>
        </div>
        <div className="topbar-right">
          <Link to="/login" className="top-link">
            Já tenho conta
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-subtitle">
            Cadastre-se para poder cadastrar cafés e deixar reviews.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <label htmlFor="name">Nome</label>
            <input
              id="name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="role">Função (opcional)</label>
            <select
              id="role"
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="">Escolher…</option>
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="auth-button" type="submit">
              Criar conta
            </button>
          </form>

          <p className="auth-footer">
            Já tem conta?{' '}
            <Link to="/login" className="link-inline">
              Fazer login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
