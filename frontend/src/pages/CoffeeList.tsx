import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCoffees, getMyProfile } from '../lib/api';

type Coffee = {
  _id: string;
  name: string;
  brand?: string;
  origin_country?: string;
  type?: string;
  price?: { currency: string; value: number };
  image_url?: string;
};

// fallback pra quando a API não manda imagem
const IMAGE_FALLBACKS: Record<string, string> = {
  Cappuccino:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  'Cappuccino Tradicional':
    'https://images.unsplash.com/photo-1519259929877-350bb09c1f47?w=800',
  Espresso:
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
  'Cold Brew':
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
};

export default function CoffeeListPage() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  const apiUrl =
    (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/v1/coffees';

  useEffect(() => {
    (async () => {
      try {
        const [list, user] = await Promise.allSettled([
          getCoffees(),
          getMyProfile(),
        ]);

        if (list.status === 'fulfilled') {
          setCoffees(list.value);
        } else {
          setError(list.reason?.message || 'Erro ao carregar cafés');
        }

        if (user.status === 'fulfilled') {
          setProfile(user.value);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="brand" onClick={() => navigate('/')}>
            CoffeeTópico ☕
          </h1>
          <p className="muted">API: {apiUrl}</p>
        </div>
        <nav className="topbar-right">
          <Link to="/" className="top-link">
            Home
          </Link>
          <Link to="/profile" className="top-link">
            Perfil
          </Link>
          <Link to="/login" className="top-button">
            Entrar
          </Link>
          <Link to="/signup" className="top-button secondary">
            Criar conta
          </Link>
          {profile && (
            <div className="user-mini">
              <div className="avatar">
                {profile.name ? profile.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <p className="user-name">{profile.name}</p>
                <p className="user-email">{profile.email}</p>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="page-body">
        {/* seção de recomendações */}
        <section className="section">
          <h2 className="section-title">Recomendações</h2>
          <p className="section-subtitle">
            Depois vamos puxar do endpoint real de recomendações 😉
          </p>
          <div className="recommend-row">
            <div className="recommend-card">Café do dia</div>
            <div className="recommend-card">Mais avaliados</div>
            <div className="recommend-card">Origem brasileira</div>
          </div>
        </section>

        {/* lista de cafés */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Catálogo</h2>
            <p className="section-subtitle">
              {loading
                ? 'Carregando...'
                : `${coffees.length} itens encontrados.`}
            </p>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="coffee-grid">
            {coffees.map((c) => {
              const img =
                c.image_url ||
                IMAGE_FALLBACKS[c.name] ||
                'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800';

              return (
                <article
                  key={c._id}
                  className="coffee-card"
                  onClick={() => navigate(`/coffees/${c._id}`)}
                >
                  <img src={img} alt={c.name} className="coffee-card-image" />
                  <div className="coffee-card-body">
                    <div className="coffee-card-topline">
                      <h3 className="coffee-card-name">{c.name}</h3>
                      {c.type && <span className="pill">{c.type}</span>}
                    </div>
                    <p className="coffee-card-meta">
                      {c.brand || '—'}
                      {c.origin_country ? ' • ' + c.origin_country : ''}
                    </p>
                    {c.price && (
                      <p className="coffee-card-price">
                        {c.price.currency} {c.price.value}
                      </p>
                    )}
                    <p className="coffee-card-link">Ver detalhes →</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
