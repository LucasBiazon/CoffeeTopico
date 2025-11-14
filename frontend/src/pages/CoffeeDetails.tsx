import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getCoffeeById,
  getReviews,
  createReview,
  type Coffee,
  type Review,
  getAuthToken,
} from '../lib/api';

export default function CoffeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [savingReview, setSavingReview] = useState(false);

  const isLogged = !!getAuthToken();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const [c, r] = await Promise.all([getCoffeeById(id), getReviews(id)]);
        setCoffee(c);
        setReviews(r);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar café');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSubmitReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!id) return;
    if (!reviewText.trim()) return;

    setSavingReview(true);
    try {
      const created = await createReview(id, {
        rating: reviewRating,
        comment: reviewText.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setReviewText('');
      setReviewRating(5);
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar review');
    } finally {
      setSavingReview(false);
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <p className="status-text" style={{ padding: '24px' }}>
          Carregando café…
        </p>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="app-shell">
        <p className="error-text" style={{ padding: '24px' }}>
          {error || 'Café não encontrado.'}
        </p>
      </div>
    );
  }

  const fallbackImage =
    coffee.type === 'drink' ? '/coffee-drink.jpg' : '/coffee-beans.jpg';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">CoffeeTópico</span>
          <span className="brand-dot">☕</span>
        </div>

        <nav className="app-nav">
          <Link to="/" className="nav-link">
            Início
          </Link>
          <Link to="/coffees" className="nav-link">
            Catálogo
          </Link>
        </nav>
      </header>

      <main className="page-main">
        <section className="details-layout">
          <div className="details-media">
            <img
              src={coffee.image_url || fallbackImage}
              alt={coffee.name}
              className="details-image"
            />
          </div>

          <div className="details-info">
            <h1 className="details-title">{coffee.name}</h1>
            <p className="details-meta">
              {coffee.brand ?? '—'}
              {coffee.origin_country ? ' • ' + coffee.origin_country : ''}
            </p>

            <div className="details-tags">
              {coffee.type && <span className="tag-chip">{coffee.type}</span>}
              {coffee.roast && (
                <span className="tag-chip">torra: {coffee.roast}</span>
              )}
              {coffee.temperature && (
                <span className="tag-chip">
                  {coffee.temperature === 'hot'
                    ? 'Quente'
                    : coffee.temperature === 'cold'
                      ? 'Gelado'
                      : 'Quente ou gelado'}
                </span>
              )}
            </div>

            {coffee.price && (
              <p className="details-price">
                {coffee.price.currency} {coffee.price.value}
              </p>
            )}

            {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
              <div className="details-section">
                <h2>Notas sensoriais</h2>
                <p>{coffee.tasting_notes.join(' · ')}</p>
              </div>
            )}

            {coffee.attributes && (
              <div className="details-section">
                <h2>Perfil</h2>
                <ul className="attributes-list">
                  {Object.entries(coffee.attributes).map(([k, v]) => {
                    if (v == null) return null;
                    return (
                      <li key={k}>
                        <span className="attr-label">{k}</span>
                        <span className="attr-bar">
                          <span
                            className="attr-bar-fill"
                            style={{ width: `${(v / 5) * 100}%` }}
                          />
                        </span>
                        <span className="attr-value">{v}/5</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {coffee.brew_methods && coffee.brew_methods.length > 0 && (
              <div className="details-section">
                <h2>Métodos sugeridos</h2>
                <div className="tags-row">
                  {coffee.brew_methods.map((m) => (
                    <span key={m} className="tag-chip">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {coffee.contains && coffee.contains.length > 0 && (
              <div className="details-section">
                <h2>Contém</h2>
                <p>{coffee.contains.join(', ')}</p>
              </div>
            )}
          </div>
        </section>

        <section className="details-reviews">
          <div className="section-header">
            <h2 className="section-title">Reviews</h2>
            <p className="section-subtitle">
              Veja o que outras pessoas acharam e deixe sua opinião.
            </p>
          </div>

          {isLogged ? (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <label>
                Nota
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  disabled={savingReview}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Comentário
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  placeholder="Como foi a experiência com esse café?"
                  disabled={savingReview}
                />
              </label>

              <button
                type="submit"
                className="primary-btn"
                disabled={savingReview}
              >
                {savingReview ? 'Enviando…' : 'Enviar review'}
              </button>
            </form>
          ) : (
            <p className="status-text">
              Faça <Link to="/login">login</Link> para avaliar este café.
            </p>
          )}

          <div className="reviews-list">
            {reviews.length === 0 && (
              <p className="status-text">Ainda não há reviews.</p>
            )}

            {reviews.map((r) => (
              <article key={r._id} className="review-card">
                <div className="review-header">
                  <div className="review-rating">
                    {'★'.repeat(r.rating)}{' '}
                    <span className="review-rating-light">{r.rating}/5</span>
                  </div>
                  <div className="review-author">
                    {r.user?.name ?? 'Usuário'}
                  </div>
                </div>
                {r.comment && <p className="review-text">{r.comment}</p>}
                {r.createdAt && (
                  <p className="review-date">
                    {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
