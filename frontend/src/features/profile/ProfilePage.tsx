import { useEffect, useState } from 'react';
import {
  type Profile,
  type RecsResponse,
  apiGetAiRecs,
  apiGetMyProfile,
  apiUpdateMyProfile,
} from '../../lib/api';
import { Link } from 'react-router-dom';

const EMPTY_PROFILE: Profile = {
  favoriteRoast: 'medium',
  prefersMilk: false,
  prefersSugar: false,
  budgetMin: 0,
  budgetMax: 999,
  brewMethods: [],
};

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await apiGetMyProfile();
        setProfile({ ...EMPTY_PROFILE, ...p });
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const [recs, setRecs] = useState<RecsResponse | null>(null);
  const [recsLoading, setRecsLoading] = useState(false);

  useEffect(() => {
    async function loadRecs() {
      setRecsLoading(true);
      try {
        const r = await apiGetAiRecs();
        setRecs(r);
      } catch {
      } finally {
        setRecsLoading(false);
      }
    }
    loadRecs();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await apiUpdateMyProfile(profile);
      setProfile({ ...EMPTY_PROFILE, ...updated });
      setMessage('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-loading">Carregando perfil...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Meu perfil de gosto</h1>
          <p>Use este perfil para personalizar recomendações de café.</p>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Torra favorita
          <select
            value={profile.favoriteRoast}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                favoriteRoast: e.target.value as Profile['favoriteRoast'],
              }))
            }
          >
            <option value="light">Clara</option>
            <option value="medium">Média</option>
            <option value="dark">Escura</option>
          </select>
        </label>

        <div className="profile-row">
          <label>
            <input
              type="checkbox"
              checked={profile.prefersMilk}
              onChange={(e) =>
                setProfile((p) => ({ ...p, prefersMilk: e.target.checked }))
              }
            />
            Prefiro com leite
          </label>
          <label>
            <input
              type="checkbox"
              checked={profile.prefersSugar}
              onChange={(e) =>
                setProfile((p) => ({ ...p, prefersSugar: e.target.checked }))
              }
            />
            Prefiro com açúcar
          </label>
        </div>

        <div className="profile-row">
          <label>
            Orçamento mínimo (R$)
            <input
              type="number"
              min={0}
              value={profile.budgetMin}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  budgetMin: Number(e.target.value),
                }))
              }
            />
          </label>
          <label>
            Orçamento máximo (R$)
            <input
              type="number"
              min={0}
              value={profile.budgetMax}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  budgetMax: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>

        <label>
          Métodos de preparo preferidos (separados por vírgula)
          <input
            type="text"
            value={profile.brewMethods.join(', ')}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                brewMethods: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
          />
        </label>

        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>

        {message && <div className="page-success">{message}</div>}
        {error && <div className="page-error">{error}</div>}
      </form>
      <section className="profile-recs">
        <div className="page-header" style={{ marginTop: 24 }}>
          <div>
            <h2>Recomendados para você</h2>
            <p>Sugestões baseadas nas suas avaliações recentes.</p>
          </div>
        </div>

        {recsLoading && (
          <div className="page-loading">Gerando recomendações...</div>
        )}

        {recs && recs.items.length === 0 && (
          <p className="reviews-empty">
            Avalie alguns cafés para receber recomendações melhores.
          </p>
        )}

        {recs && recs.items.length > 0 && (
          <div className="coffee-grid">
            {recs.items.map((coffee) => (
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
      </section>
    </div>
  );
}
