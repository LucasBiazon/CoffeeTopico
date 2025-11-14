import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await apiLogin(email, password);
      setUser(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p>
        Não tem conta? <Link to="/signup">Cadastre-se</Link>
      </p>
    </div>
  );
}
