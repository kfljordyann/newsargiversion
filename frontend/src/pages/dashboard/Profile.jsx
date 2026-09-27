import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiFetch } from '../../api/client';

const TYPES_CLIENT = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'investisseur', label: 'Investisseur' },
];

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    typeClient: user?.typeClient || 'particulier',
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/utilisateurs/profil', { method: 'PUT', body: form });
      showToast('Profil mis à jour.', 'success');
    } catch (err) {
      showToast(err.message || 'Impossible de mettre à jour le profil.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack" style={{ maxWidth: 520 }}>
      <h1>Mon profil</h1>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input className="input" value={user?.email || ''} disabled />
          <span className="hint">L'email ne peut pas être modifié ici.</span>
        </div>

        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="prenom">Prénom</label>
            <input id="prenom" className="input" value={form.prenom} onChange={(e) => update('prenom', e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="nom">Nom</label>
            <input id="nom" className="input" value={form.nom} onChange={(e) => update('nom', e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="telephone">Téléphone</label>
          <input id="telephone" className="input" value={form.telephone} onChange={(e) => update('telephone', e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="typeClient">Type de client</label>
          <select id="typeClient" className="select" value={form.typeClient} onChange={(e) => update('typeClient', e.target.value)}>
            {TYPES_CLIENT.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
