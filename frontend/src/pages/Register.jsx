import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TYPES_CLIENT = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'investisseur', label: 'Investisseur' },
];

const initialForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  motDePasse: '',
  confirmationMotDePasse: '',
  typeClient: 'particulier',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.nom.trim()) next.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) next.prenom = 'Le prénom est requis.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email invalide.';
    if (!form.telephone.trim()) next.telephone = 'Le téléphone est requis.';
    if (form.motDePasse.length < 8) next.motDePasse = '8 caractères minimum.';
    if (form.confirmationMotDePasse !== form.motDePasse) {
      next.confirmationMotDePasse = 'La confirmation ne correspond pas.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      navigate('/espace-client', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section container" style={{ maxWidth: 520 }}>
      <h1>Créer un compte</h1>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="prenom">Prénom</label>
            <input id="prenom" className="input" value={form.prenom} onChange={(e) => update('prenom', e.target.value)} />
            {errors.prenom && <span className="error-text">{errors.prenom}</span>}
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="nom">Nom</label>
            <input id="nom" className="input" value={form.nom} onChange={(e) => update('nom', e.target.value)} />
            {errors.nom && <span className="error-text">{errors.nom}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="telephone">Téléphone</label>
          <input id="telephone" className="input" value={form.telephone} onChange={(e) => update('telephone', e.target.value)} />
          {errors.telephone && <span className="error-text">{errors.telephone}</span>}
        </div>

        <div className="field">
          <label htmlFor="typeClient">Type de client</label>
          <select id="typeClient" className="select" value={form.typeClient} onChange={(e) => update('typeClient', e.target.value)}>
            {TYPES_CLIENT.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="motDePasse">Mot de passe</label>
          <input id="motDePasse" type="password" className="input" value={form.motDePasse} onChange={(e) => update('motDePasse', e.target.value)} />
          {errors.motDePasse && <span className="error-text">{errors.motDePasse}</span>}
        </div>

        <div className="field">
          <label htmlFor="confirmationMotDePasse">Confirmer le mot de passe</label>
          <input
            id="confirmationMotDePasse"
            type="password"
            className="input"
            value={form.confirmationMotDePasse}
            onChange={(e) => update('confirmationMotDePasse', e.target.value)}
          />
          {errors.confirmationMotDePasse && <span className="error-text">{errors.confirmationMotDePasse}</span>}
        </div>

        {serverError && <p className="error-text">{serverError}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </button>

        <p style={{ marginTop: 14, textAlign: 'center' }}>
          Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </section>
  );
}
