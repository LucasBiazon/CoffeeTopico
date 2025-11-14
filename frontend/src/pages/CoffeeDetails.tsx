import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCoffeeById,
  getReviews,
  createReview,
  getAuthToken,
} from '../lib/api';

export default function CoffeeDetails() {
  const { id } = useParams<{ id: string }>();
  const [coffee, setCoffee] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [score, setScore] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const isLogged = !!getAuthToken();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const c = await getCoffeeById(id);
        setCoffee(c);
        const r = await getReviews(id);
        setReviews(r.items || r || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      await createReview(id, {
        comment: reviewText,
        rating: score,
      });
      setReviewText('');
      const r = await getReviews(id);
      setReviews(r.items || r || []);
    } catch (err: any) {
      alert(err.message || 'Erro ao criar review');
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link to="/" className="brand">
            CoffeeTópico ☕
          </Link>
          <p className="muted">Detalhes do café</p>
        </div>
        <div className="topbar-right">
          <Link to="/profile" className="top-link">
            Meu perfil
          </Link>
        </div>
      </header>

      <main className="page-body">
        {loading && <p>Carregando…</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && coffee && (
          <>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: '0 0 280px' }}>
                {coffee.image_url ? (
                  <img
                    src={coffee.image_url}
                    alt={coffee.name}
                    style={{
                      width: '100%',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      height: '200px',
                      background: '#f0e0ce',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '16px',
                      background: '#f0e0ce',
                    }}
                  />
                )}
              </div>
              <div>
                <h1 style={{ marginBottom: '4px' }}>{coffee.name}</h1>
                <p style={{ color: '#8a6f60', fontSize: '0.85rem' }}>
                  {coffee.brand} • {coffee.origin_country}
                </p>
                {coffee.price && (
                  <p style={{ marginTop: '8px' }}>
                    {coffee.price.currency} {coffee.price.value}
                  </p>
                )}
              </div>
            </div>

            <section style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '1rem' }}>Reviews</h2>
              <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                {reviews.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: '#8a6f60' }}>
                    Nenhum review ainda.
                  </p>
                )}
                {reviews.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      border: '1px solid rgba(0,0,0,0.02)',
                    }}
                  >
                    <p style={{ fontSize: '0.8rem' }}>{r.comment}</p>
                    {r.rating && (
                      <p style={{ fontSize: '0.7rem', color: '#8a6f60' }}>
                        Nota: {r.rating}/5
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginTop: '20px' }}>
              {isLogged ? (
                <form onSubmit={handleSubmitReview}>
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      marginBottom: '6px',
                    }}
                  >
                    Adicionar review
                  </h3>
                  <label style={{ fontSize: '0.7rem' }}>Comentário</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.05)',
                      padding: '8px 10px',
                      marginBottom: '8px',
                    }}
                  />
                  <label style={{ fontSize: '0.7rem' }}>Nota (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    style={{
                      width: '80px',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.05)',
                      padding: '4px 6px',
                      marginBottom: '10px',
                      display: 'block',
                    }}
                  />
                  <button className="auth-button" type="submit">
                    Enviar review
                  </button>
                </form>
              ) : (
                <p style={{ fontSize: '0.75rem', color: '#8a6f60' }}>
                  Faça <Link to="/login">login</Link> para deixar um review.
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
