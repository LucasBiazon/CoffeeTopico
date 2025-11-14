import { useState } from 'react';
import { createCoffee } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function NewCoffeePage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('drink');
  const [brand, setBrand] = useState('CoffeeTópico Bar');
  const [price, setPrice] = useState(12);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        type,
        name,
        brand,
        origin_country: 'Brazil',
        roast: 'dark',
        tasting_notes: ['cacau', 'caramelo'],
        attributes: {
          acidity: 2,
          sweetness: 4,
          bitterness: 2,
          body: 5,
          aroma: 4,
        },
        brew_methods: ['espresso', 'steam-milk'],
        price: { currency: 'BRL', value: price },
        contains: ['milk'],
        available: true,
      };
      await createCoffee(payload);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar café (precisa ser admin?)');
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="title">Novo Café</h1>
        <Link to="/" className="btn small">
          Voltar
        </Link>
      </header>

      {error && <p className="message error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="form-field">
          <span>Tipo</span>
          <input value={type} onChange={(e) => setType(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Marca</span>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label className="form-field">
          <span>Preço (BRL)</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <button className="btn primary">Criar</button>
      </form>
    </div>
  );
}
