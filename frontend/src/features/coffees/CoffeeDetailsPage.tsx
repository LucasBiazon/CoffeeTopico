import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import {
  type Coffee,
  type Review,
  apiGetCoffee,
  apiGetReviews,
  apiCreateReview,
} from '../../lib/api';

export default function CoffeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { favoriteIds, toggle } = useFavorites();

  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingCoffee, setLoadingCoffee] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function loadCoffee() {
      setLoadingCoffee(true);
      setError(null);
      try {
        const data = await apiGetCoffee(id as string);
        setCoffee(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar café');
      } finally {
        setLoadingCoffee(false);
      }
    }

    async function loadReviews() {
      setLoadingReviews(true);
      try {
        const list = await apiGetReviews(id as string);
        setReviews(list);
      } catch {
      } finally {
        setLoadingReviews(false);
      }
    }

    void loadCoffee();
    void loadReviews();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setReviewError(null);
    try {
      const created = await apiCreateReview(id, rating, comment.trim());
      setReviews((prev) => {
        const idx = prev.findIndex(
          (r) => r.user.id && created.user.id && r.user.id === created.user.id,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = created;
          return next;
        }
        return [created, ...prev];
      });
      setComment('');
    } catch (err: any) {
      setReviewError(err.message || 'Erro ao enviar review');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCoffee) {
    return <div className="page-loading">Carregando café...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  if (!coffee) {
    return <div className="page-error">Café não encontrado.</div>;
  }

  const isFavorite = favoriteIds.has(coffee._id);
  const imageSrc =
    coffee.image_url ??
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{coffee.name}</h1>
          {coffee.roastery && (
            <p className="coffee-roastery">por {coffee.roastery}</p>
          )}
        </div>
        <div className="coffee-details-actions">
          <button
            type="button"
            className={
              'favorite-btn' + (isFavorite ? ' favorite-btn-active' : '')
            }
            onClick={() => toggle(coffee._id)}
          >
            {isFavorite ? '♥ Favorito' : '♡ Favoritar'}
          </button>
          <Link to="/" className="btn-outline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>

      <div className="coffee-details">
        <div className="coffee-details-image">
          <img src={imageSrc} alt={coffee.name} />
        </div>

        <div className="coffee-details-body">
          <div className="coffee-details-chips">
            {coffee.type && <span className="tag">{coffee.type}</span>}
            {coffee.roast && (
              <span className={`tag tag-${coffee.roast}`}>
                Torra {coffee.roast.toUpperCase()}
              </span>
            )}
            {coffee.price && (
              <span className="tag tag-price">
                {coffee.price.currency} {coffee.price.value.toFixed(2)}
              </span>
            )}
          </div>

          {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
            <section className="coffee-section">
              <h2>Notas sensoriais</h2>
              <p>{coffee.tasting_notes.join(' • ')}</p>
            </section>
          )}

          {typeof coffee.rating_avg === 'number' && (
            <section className="coffee-section">
              <h2>Avaliação média</h2>
              <p className="coffee-rating">
                ⭐ {coffee.rating_avg.toFixed(1)}{' '}
                <span className="rating-count">
                  ({coffee.rating_count ?? 0} avaliações)
                </span>
              </p>
            </section>
          )}

          <section className="coffee-section reviews-section">
            <div className="reviews-header">
              <h2>Avaliações</h2>
              <span className="reviews-count">
                {reviews.length} review
                {reviews.length === 1 ? '' : 's'}
              </span>
            </div>

            {loadingReviews && (
              <div className="page-loading">Carregando reviews...</div>
            )}

            {!loadingReviews && reviews.length === 0 && (
              <p className="reviews-empty">
                Este café ainda não tem avaliações. Seja o primeiro a avaliar!
              </p>
            )}

            {!loadingReviews && reviews.length > 0 && (
              <ul className="reviews-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="review-avatar">
                          {r.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="review-user-name">{r.user.name}</div>
                          <div className="review-date">
                            {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {'⭐'.repeat(r.rating)}{' '}
                        <span className="review-rating-number">
                          {r.rating}/5
                        </span>
                      </div>
                    </div>
                    {r.comment && <p className="review-comment">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}

            {user ? (
              <form className="review-form" onSubmit={handleSubmit}>
                <h3>Deixe sua avaliação</h3>

                <label>
                  Nota
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} -{' '}
                        {n === 5
                          ? 'Excelente'
                          : n === 4
                            ? 'Muito bom'
                            : n === 3
                              ? 'Ok'
                              : n === 2
                                ? 'Ruim'
                                : 'Péssimo'}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Comentário (opcional)
                  <textarea
                    rows={3}
                    maxLength={2000}
                    placeholder="Conte um pouco sobre a sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </label>

                {reviewError && <div className="page-error">{reviewError}</div>}

                <button className="btn" type="submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Salvar avaliação'}
                </button>
              </form>
            ) : (
              <p className="reviews-login-hint">
                <Link to="/login">Entre na sua conta</Link> para avaliar este
                café.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
