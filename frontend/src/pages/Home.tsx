// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCoffees } from '../lib/api';
import './home.css';

type Coffee = {
  _id: string;
  name: string;
  brand?: string;
  origin_country?: string;
  type?: string;
  price?: { currency: string; value: number };
  image_url?: string;
};

export default function Home() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await getCoffees();
        // mostra só alguns na home
        setCoffees(list.slice(0, 4));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const apiUrl =
    (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/v1/coffees';

  return (
    <div className="home-page">
      {/* HEADER */}
      <header className="home-header">
        <div className="home-logo">
          <span className="home-logo-icon">☕</span>
          <div>
            <h1 className="home-title">CoffeeTópico</h1>
            <p className="home-subtitle">Dashboard de cafés</p>
          </div>
        </div>

        <nav className="home-nav">
          <Link to="/" className="home-nav-link active">
            Home
          </Link>
          <Link to="/coffees" className="home-nav-link">
            Cafés
          </Link>
          <Link to="/login" className="home-nav-link">
            Login
          </Link>
        </nav>

        {/* Sessão de perfil (fake por enquanto) */}
        <div className="home-profile">
          <div className="home-profile-avatar">A</div>
          <div className="home-profile-text">
            <p className="home-profile-name">André</p>
            <p className="home-profile-role">admin</p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="home-main">
        {/* hero */}
        <section className="home-hero">
          <div>
            <h2 className="home-hero-title">Bem-vindo ao CoffeeTópico ☕</h2>
            <p className="home-hero-text">
              Veja os cafés cadastrados na API, faça login, gerencie perfis e
              futuramente adicione reviews.
            </p>
            <p className="home-hero-api">
              API ativa em: <code>{apiUrl}</code>
            </p>
            <Link to="/coffees" className="home-hero-button">
              Ver todos os cafés →
            </Link>
          </div>
          <div className="home-hero-box">
            <p className="home-hero-box-title">Status rápido</p>
            <p className="home-hero-box-text">
              {loading ? 'Carregando...' : `${coffees.length} cafés na home`}
            </p>
          </div>
        </section>

        {/* recomendações (placeholder) */}
        <section className="home-section">
          <div className="home-section-head">
            <h3 className="home-section-title">Recomendações para você</h3>
            <p className="home-section-subtitle">
              Vamos puxar isso do backend depois.
            </p>
          </div>
          <div className="home-recommend-grid">
            <div className="home-recommend-card">
              <p className="home-recommend-title">Para espresso</p>
              <p className="home-recommend-text">
                Cafés mais escuros e com corpo.
              </p>
            </div>
            <div className="home-recommend-card">
              <p className="home-recommend-title">Filtrados</p>
              <p className="home-recommend-text">
                Grãos claros, notas florais e frutas.
              </p>
            </div>
            <div className="home-recommend-card">
              <p className="home-recommend-title">Bebidas prontas</p>
              <p className="home-recommend-text">
                Cappuccino, latte, mocha e cold brew.
              </p>
            </div>
          </div>
        </section>

        {/* últimos cafés */}
        <section className="home-section">
          <div className="home-section-head">
            <h3 className="home-section-title">Últimos cafés</h3>
            <Link to="/coffees" className="home-section-link">
              Ver todos
            </Link>
          </div>

          <div className="home-coffee-grid">
            {loading && <p>Carregando…</p>}
            {!loading &&
              coffees.map((c) => (
                <div key={c._id} className="home-coffee-card">
                  <div className="home-coffee-thumb" />
                  <div className="home-coffee-body">
                    <p className="home-coffee-name">{c.name}</p>
                    <p className="home-coffee-meta">
                      {c.brand ?? '—'}
                      {c.origin_country ? ' • ' + c.origin_country : ''}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
