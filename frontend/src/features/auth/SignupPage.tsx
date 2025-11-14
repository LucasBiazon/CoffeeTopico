import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiSignup } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await apiSignup(name, email, password);
      setUser(user);
      navigate('/', { replace: true });
    } catch (err: any) {
      let msg = err?.message || 'Erro ao criar conta';
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
          <h1>Criar conta</h1>
          <p>Comece a organizar seus cafés e receber recomendações.</p>
        </div>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nome
            <input
              type="text"
              placeholder="Como devemos te chamar?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && <div className="page-error">{error}</div>}

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
