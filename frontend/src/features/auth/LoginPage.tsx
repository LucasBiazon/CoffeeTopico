import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiLogin } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from || '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await apiLogin(email, password);
      setUser(user);
      navigate(from, { replace: true });
    } catch (err: any) {
      let msg = err?.message || 'Erro ao fazer login';
      try {
        const parsed = JSON.parse(msg);
        if (parsed?.error) msg = parsed.error;
      } catch {
        // ignora
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="page-header">
        <div>
          <h1>Entrar</h1>
          <p>Entre para salvar seu perfil e receber recomendações.</p>
        </div>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && <div className="page-error">{error}</div>}

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          Ainda não tem conta? <Link to="/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
