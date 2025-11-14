// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCoffees, type Coffee } from '../lib/api';

export default function Home() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isLogged = !!localStorage.getItem('auth_token');

  useEffect(() => {
    (async () => {
      try {
        // ⬇️ AGORA usando CoffeeListResponse
        const resp = await getCoffees({
          page: 1,
          limit: 12,
          available: true,
        });
        setCoffees(resp.items);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar cafés');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const highlighted = coffees.slice(0, 3);
  const more = coffees.slice(3, 9);

  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">CoffeeTópico</span>
          <span className="brand-dot">☕</span>
        </div>

        <nav className="app-nav">
          <Link to="/" className="nav-link nav-link-active">
            Início
          </Link>
          <Link to="/coffees" className="nav-link">
            Catálogo
          </Link>
          {isLogged && (
            <Link to="/profile" className="nav-link">
              Meu perfil
            </Link>
          )}
        </nav>

        <div className="auth-area">
          {isLogged ? (
            <button
              className="secondary-btn"
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.reload();
              }}
            >
              Sair
            </button>
          ) : (
            <>
              <Link to="/login" className="secondary-btn">
                Entrar
              </Link>
              <Link to="/signup" className="primary-btn">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="home-main">
        {/* HERO + painel lateral */}
        <section className="home-hero">
          <div className="hero-copy">
            <h1 className="hero-title">
              O café certo
              <br />
              para o momento certo.
            </h1>
            <p className="hero-subtitle">
              Explore grãos especiais, bebidas prontas e, em breve,
              recomendações inteligentes pelo clima e pelo seu gosto.
            </p>

            <div className="hero-actions">
              <Link to="/coffees" className="primary-btn">
                Ver catálogo completo
              </Link>
              {isLogged && (
                <Link to="/profile" className="secondary-btn">
                  Ajustar minhas preferências
                </Link>
              )}
            </div>

            <div className="hero-profile-hint">
              {isLogged ? (
                <span>
                  Você está logado. Vá em <strong>Meu perfil</strong> para
                  atualizar o que você gosta (doces, intensos, etc).
                </span>
              ) : (
                <span>
                  Crie uma conta para salvar favoritos e ganhar recomendações
                  personalizadas.
                </span>
              )}
            </div>
          </div>

          <aside className="hero-panel">
            <h2 className="panel-title">Sugestões do dia</h2>

            {loading && <p>Carregando cafés…</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && highlighted.length === 0 && (
              <p>Nenhum café cadastrado ainda.</p>
            )}

            <div className="hero-coffee-list">
              {highlighted.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  className="mini-coffee-card"
                  onClick={() => navigate(`/coffees/${c._id}`)}
                >
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt={c.name}
                      className="mini-coffee-thumb"
                    />
                  ) : (
                    <div className="mini-coffee-thumb placeholder" />
                  )}

                  <div className="mini-coffee-info">
                    <div className="mini-coffee-name">{c.name}</div>
                    <div className="mini-coffee-meta">
                      {c.brand ?? '—'}
                      {c.origin_country ? ' • ' + c.origin_country : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        {/* RECOMENDAÇÕES / “IA + clima” futura */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">Recomendações para você</h2>
            <p className="section-subtitle">
              Aqui vai entrar a IA com clima e o seu histórico. Por enquanto,
              mostramos alguns cafés do catálogo.
            </p>
          </div>

          <div className="coffee-grid">
            {more.map((c) => (
              <article
                key={c._id}
                className="coffee-card"
                onClick={() => navigate(`/coffees/${c._id}`)}
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="coffee-card-image"
                  />
                ) : (
                  <div className="coffee-card-placeholder" />
                )}

                <div className="coffee-card-body">
                  <div className="coffee-card-topline">
                    <h3 className="coffee-card-name">{c.name}</h3>
                    {c.type && <span className="coffee-pill">{c.type}</span>}
                  </div>

                  <p className="coffee-card-meta">
                    {c.brand ?? '—'}
                    {c.origin_country ? ' • ' + c.origin_country : ''}
                  </p>

                  {c.price && (
                    <p className="coffee-card-price">
                      {c.price.currency} {c.price.value}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
