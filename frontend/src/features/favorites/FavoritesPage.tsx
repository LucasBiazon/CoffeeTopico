import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Meus favoritos</h1>
          <p>Os cafés que você marcou com ♥.</p>
        </div>
      </div>

      {loading && <div className="page-loading">Carregando favoritos...</div>}

      {!loading && favorites.length === 0 && (
        <p className="reviews-empty">
          Você ainda não favoritou nenhum café. Explore o{' '}
          <Link to="/">catálogo</Link> e marque seus preferidos!
        </p>
      )}

      {!loading && favorites.length > 0 && (
        <div className="coffee-grid">
          {favorites.map((coffee) => (
            <Link
              key={coffee._id}
              to={`/coffees/${coffee._id}`}
              className="coffee-card"
            >
              {coffee.image_url && (
                <div className="coffee-image-wrapper">
                  <img src={coffee.image_url} alt={coffee.name} />
                </div>
              )}
              <div className="coffee-card-body">
                <h2>{coffee.name}</h2>
                {coffee.roastery && (
                  <p className="coffee-roastery">{coffee.roastery}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
