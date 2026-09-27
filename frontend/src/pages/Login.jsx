import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { forgotPassword } from '../api/auth';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ identifiant: '', motDePasse: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.identifiant, form.motDePasse);
      const redirectTo = location.state?.from?.pathname || '/espace-client';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!form.identifiant) {
      setError('Renseignez votre email ou téléphone pour réinitialiser votre mot de passe.');
      return;
    }
    const data = await forgotPassword(form.identifiant);
    showToast(data.message, 'info');
  }

  return (
    <section className="section container" style={{ maxWidth: 460 }}>
      <h1>Connexion</h1>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="identifiant">Email ou téléphone</label>
          <input
            id="identifiant"
            className="input"
            value={form.identifiant}
            onChange={(e) => setForm((f) => ({ ...f, identifiant: e.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="motDePasse">Mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            className="input"
            value={form.motDePasse}
            onChange={(e) => setForm((f) => ({ ...f, motDePasse: e.target.value }))}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <div className="row row--between" style={{ marginTop: 14 }}>
          <button type="button" className="btn btn--ghost" onClick={handleForgotPassword}>
            Mot de passe oublié ?
          </button>
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </form>
    </section>
  );
}
