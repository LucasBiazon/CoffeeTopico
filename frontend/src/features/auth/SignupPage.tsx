import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiSignup } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await apiSignup(name, email, password);
      setUser(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

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
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
