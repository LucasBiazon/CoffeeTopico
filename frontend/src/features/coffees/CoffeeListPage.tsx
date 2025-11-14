import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Coffee, type Paginated, apiGetCoffees } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';

export function CoffeeListPage() {
  const [data, setData] = useState<Paginated<Coffee> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roast, setRoast] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favoriteIds, toggle } = useFavorites();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiGetCoffees({
          page,
          limit: 12,
          roast,
          search,
        });
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar cafés');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [page, roast, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Catálogo de cafés</h1>
          <p>Explore os cafés e encontre o próximo tópico para discutir.</p>
        </div>
        <div className="filters">
          <input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            value={roast}
            onChange={(e) => {
              setPage(1);
              setRoast(e.target.value);
            }}
          >
            <option value="all">Todas as torras</option>
            <option value="light">Clara</option>
            <option value="medium">Média</option>
            <option value="dark">Escura</option>
          </select>
        </div>
      </div>

      {loading && <div className="page-loading">Carregando cafés...</div>}
      {error && <div className="page-error">{error}</div>}

      {!loading && !error && data && (
        <>
          <div className="coffee-grid">
            {data.items.map((coffee) => {
              const isFavorite = favoriteIds.has(coffee._id);

              return (
                <div key={coffee._id} className="coffee-card">
                  {/* Cabeçalho com imagem e coração */}
                  <div className="coffee-card-header">
                    <Link
                      to={`/coffees/${coffee._id}`}
                      className="coffee-card-link"
                    >
                      {coffee.image_url && (
                        <div className="coffee-image-wrapper">
                          <img src={coffee.image_url} alt={coffee.name} />
                        </div>
                      )}
                    </Link>
                    <button
                      type="button"
                      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void toggle(coffee._id);
                      }}
                      aria-label={
                        isFavorite
                          ? 'Remover dos favoritos'
                          : 'Adicionar aos favoritos'
                      }
                    >
                      {isFavorite ? '♥' : '♡'}
                    </button>
                  </div>

                  {/* Corpo do card, clicável pro detalhe */}
                  <Link
                    to={`/coffees/${coffee._id}`}
                    className="coffee-card-body-link"
                  >
                    <div className="coffee-card-body">
                      <h2>{coffee.name}</h2>
                      {coffee.roastery && (
                        <p className="coffee-roastery">{coffee.roastery}</p>
                      )}
                      <p className="coffee-meta">
                        {coffee.roast && (
                          <span className={`tag tag-${coffee.roast}`}>
                            Torra {coffee.roast}
                          </span>
                        )}
                        {coffee.price && (
                          <span className="coffee-price">
                            {coffee.price.currency}{' '}
                            {coffee.price.value.toFixed(2)}
                          </span>
                        )}
                      </p>
                      {coffee.tasting_notes &&
                        coffee.tasting_notes.length > 0 && (
                          <p className="coffee-notes">
                            {coffee.tasting_notes.slice(0, 3).join(' • ')}
                          </p>
                        )}
                      {typeof coffee.rating_avg === 'number' && (
                        <p className="coffee-rating">
                          ⭐ {coffee.rating_avg.toFixed(1)}{' '}
                          <span className="rating-count">
                            ({coffee.rating_count ?? 0})
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {data.pages > 1 && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
              <span>
                Página {data.page} de {data.pages}
              </span>
              <button
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
