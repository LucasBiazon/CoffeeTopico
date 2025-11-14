// src/pages/CoffeeList.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCoffees, type Coffee } from '../lib/api';

export default function CoffeeListPage() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [roastFilter, setRoastFilter] = useState<string>('');

  const navigate = useNavigate();
  const isLogged = !!localStorage.getItem('auth_token');

  const apiUrl =
    (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/v1/coffees';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getCoffees({
          page,
          limit: 12,
          available: true,
          type: typeFilter || undefined,
          roast: roastFilter || undefined,
        });
        setCoffees(resp.items);
        setTotalPages(resp.totalPages || 1);
      } catch (e: any) {
        setError(e.message || 'Erro ao buscar cafés');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, typeFilter, roastFilter]);

  return (
    <div className="coffee-page">
      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">CoffeeTópico</span>
          <span className="brand-dot">☕</span>
        </div>

        <nav className="app-nav">
          <Link to="/" className="nav-link">
            Início
          </Link>
          <Link to="/coffees" className="nav-link nav-link-active">
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

      {/* TOPO DA PÁGINA */}
      <main className="page-main">
        <section className="coffee-header">
          <div>
            <h1 className="coffee-title">Catálogo de cafés</h1>
            <p className="coffee-subtitle">
              Grãos e bebidas cadastrados na API CoffeeTópico.
            </p>
            <p className="coffee-api-hint">
              API usada: <code>{apiUrl}</code>
            </p>
          </div>

          <div className="coffee-filters">
            <div className="filter-group">
              <label htmlFor="type-filter">Tipo</label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => {
                  setPage(1);
                  setTypeFilter(e.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="bean">Grãos</option>
                <option value="drink">Bebidas</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="roast-filter">Torra</label>
              <select
                id="roast-filter"
                value={roastFilter}
                onChange={(e) => {
                  setPage(1);
                  setRoastFilter(e.target.value);
                }}
              >
                <option value="">Todas</option>
                <option value="light">Clara</option>
                <option value="medium">Média</option>
                <option value="dark">Escura</option>
              </select>
            </div>
          </div>
        </section>

        {/* ESTADOS */}
        {loading && <p className="coffee-status">Carregando cafés…</p>}
        {error && <p className="coffee-error">{error}</p>}

        {!loading && !error && coffees.length === 0 && (
          <p className="coffee-status">Nenhum café encontrado.</p>
        )}

        {/* GRID DE CARDS */}
        <section className="coffee-grid">
          {coffees.map((c) => (
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
                  <h2 className="coffee-card-name">{c.name}</h2>
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
        </section>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="secondary-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </button>
            <span className="pagination-info">
              Página {page} de {totalPages}
            </span>
            <button
              className="secondary-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
