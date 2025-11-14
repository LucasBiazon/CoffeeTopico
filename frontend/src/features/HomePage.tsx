import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  type Coffee,
  type Paginated,
  apiGetAiRecs,
  apiGetCoffees,
  apiGetWeatherRecs,
} from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

type RoastFilter = 'all' | 'light' | 'medium' | 'dark';

export default function HomePage() {
  const { user } = useAuth();
  const { favoriteIds, toggle } = useFavorites();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roast, setRoast] = useState<RoastFilter>('all');

  const [data, setData] = useState<Paginated<Coffee> | null>(null);
  const [loadingCoffees, setLoadingCoffees] = useState(true);
  const [errorCoffees, setErrorCoffees] = useState<string | null>(null);

  const [weatherRecs, setWeatherRecs] = useState<Coffee[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorWeather, setErrorWeather] = useState<string | null>(null);

  const [aiRecs, setAiRecs] = useState<Coffee[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorAi, setErrorAi] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoffees() {
      setLoadingCoffees(true);
      setErrorCoffees(null);
      try {
        const res = await apiGetCoffees({
          page,
          limit: 12,
          roast: roast === 'all' ? undefined : roast,
          search: search || undefined,
        });
        setData(res);
      } catch (err: any) {
        setErrorCoffees(err.message || 'Erro ao carregar cafés');
      } finally {
        setLoadingCoffees(false);
      }
    }
    void loadCoffees();
  }, [page, roast, search]);

  useEffect(() => {
    async function loadWeatherRecs() {
      setLoadingWeather(true);
      setErrorWeather(null);
      try {
        const res = await apiGetWeatherRecs();
        setWeatherRecs(res.items);
      } catch (err: any) {
        setErrorWeather(
          err.message || 'Não foi possível carregar recomendações pelo clima.',
        );
      } finally {
        setLoadingWeather(false);
      }
    }
    void loadWeatherRecs();
  }, []);

  useEffect(() => {
    if (!user) {
      setAiRecs([]);
      return;
    }

    async function loadAiRecs() {
      setLoadingAi(true);
      setErrorAi(null);
      try {
        const res = await apiGetAiRecs();
        setAiRecs(res.items);
      } catch (err: any) {
        setErrorAi(
          err.message ||
            'Não foi possível carregar recomendações personalizadas agora.',
        );
      } finally {
        setLoadingAi(false);
      }
    }

    void loadAiRecs();
  }, [user]);

  const renderCoffeeCard = (coffee: Coffee, small = false) => {
    const isFavorite = favoriteIds.has(coffee._id);
    const imageSrc =
      coffee.image_url ??
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';

    return (
      <article
        key={coffee._id}
        className={`coffee-card${small ? ' coffee-card-small' : ''}`}
      >
        <button
          type="button"
          className={
            'favorite-btn' + (isFavorite ? ' favorite-btn-active' : '')
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(coffee._id);
          }}
          aria-label={
            isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
          }
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <Link to={`/coffees/${coffee._id}`} className="coffee-card-link">
          <div className="coffee-image-wrapper">
            <img src={imageSrc} alt={coffee.name} />
          </div>
          <div className="coffee-card-body">
            <h3>{coffee.name}</h3>
            {coffee.roastery && (
              <p className="coffee-roastery">{coffee.roastery}</p>
            )}
            <p className="coffee-meta">
              {coffee.roast && (
                <span className={`tag tag-${coffee.roast}`}>
                  Torra {coffee.roast.toUpperCase()}
                </span>
              )}
              {coffee.price && (
                <span className="coffee-price">
                  {coffee.price.currency} {coffee.price.value.toFixed(2)}
                </span>
              )}
            </p>
            {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
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
      </article>
    );
  };

  return (
    <div className="page home-page">
      <header className="page-header page-header-centered">
        <div>
          <h1>Descubra seu próximo café e tópico</h1>
          <p>
            Recomendamos cafés com base no clima, nas suas preferências e nas
            avaliações da comunidade.
          </p>
        </div>
      </header>

      <section className="recs-section">
        <div className="section-header">
          <h2>De acordo com o tempo agora</h2>
          <p className="section-subtitle">
            Sugestões rápidas para combinar com o clima atual.
          </p>
        </div>

        {loadingWeather && (
          <div className="page-loading">Carregando recomendações...</div>
        )}
        {errorWeather && <div className="page-error">{errorWeather}</div>}

        {!loadingWeather && !errorWeather && weatherRecs.length === 0 && (
          <p className="muted">
            Não há recomendações baseadas no clima neste momento.
          </p>
        )}

        {!loadingWeather && !errorWeather && weatherRecs.length > 0 && (
          <div className="coffee-grid coffee-grid-compact">
            {weatherRecs.map((c) => renderCoffeeCard(c, true))}
          </div>
        )}
      </section>

      {user && (
        <section className="recs-section">
          <div className="section-header">
            <h2>Recomendados para você</h2>
            <p className="section-subtitle">
              Sugestões com base nas suas preferências e avaliações.
            </p>
          </div>

          {loadingAi && (
            <div className="page-loading">
              Carregando recomendações personalizadas...
            </div>
          )}
          {errorAi && <div className="page-error">{errorAi}</div>}

          {!loadingAi && !errorAi && aiRecs.length === 0 && (
            <p className="muted">
              Avalie alguns cafés e preencha seu perfil para personalizarmos
              melhor as recomendações.
            </p>
          )}

          {!loadingAi && !errorAi && aiRecs.length > 0 && (
            <div className="coffee-grid coffee-grid-compact">
              {aiRecs.map((c) => renderCoffeeCard(c, true))}
            </div>
          )}
        </section>
      )}

      <section className="coffee-section">
        <div className="section-header">
          <h2>Catálogo de cafés</h2>
          <p className="section-subtitle">
            Explore a lista completa e encontre o próximo tópico para conversar.
          </p>
        </div>

        <div className="filters">
          <input
            className="input"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            className="select"
            value={roast}
            onChange={(e) => {
              setPage(1);
              setRoast(e.target.value as RoastFilter);
            }}
          >
            <option value="all">Todas as torras</option>
            <option value="light">Clara</option>
            <option value="medium">Média</option>
            <option value="dark">Escura</option>
          </select>
        </div>

        {loadingCoffees && (
          <div className="page-loading">Carregando cafés...</div>
        )}
        {errorCoffees && <div className="page-error">{errorCoffees}</div>}

        {!loadingCoffees && !errorCoffees && data && (
          <>
            <div className="coffee-grid">
              {data.items.map((c) => renderCoffeeCard(c))}
            </div>

            {data.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {data.page} de {data.pages}
                </span>
                <button
                  className="btn"
                  disabled={page >= data.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
