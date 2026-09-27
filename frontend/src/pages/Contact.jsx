import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../api/services';
import { sendContactMessage } from '../api/messages';
import VoiceInputButton from '../components/ui/VoiceInputButton';
import { useToast } from '../contexts/ToastContext';
import { siteConfig } from '../config/siteConfig';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    serviceId: searchParams.get('service') || '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchServices().then((data) => setServices(data.services)).catch(() => {});
  }, []);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.nom.trim()) next.nom = 'Le nom est requis.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email invalide.';
    if (!form.message.trim()) next.message = 'Merci de décrire votre besoin.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      await sendContactMessage(form);
      setSent(true);
      showToast('Message envoyé avec succès.', 'success');
    } catch (err) {
      showToast(err.message || "Une erreur est survenue lors de l'envoi.", 'error');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section className="section container state-panel">
        <h2>Message envoyé !</h2>
        <p>Merci, notre équipe reviendra vers vous rapidement.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <span className="badge badge--blue">Contact</span>
        <h1>Parlons de votre projet</h1>
        <p>
          Remplissez le formulaire ci-dessous, ou utilisez le micro pour dicter votre message.
          Vous pouvez relire et corriger le texte avant l'envoi.
        </p>

        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className={`field ${errors.nom ? 'field--error' : ''}`}>
            <label htmlFor="nom">Nom complet</label>
            <input
              id="nom"
              className="input"
              value={form.nom}
              onChange={(e) => update('nom', e.target.value)}
            />
            {errors.nom && <span className="error-text">{errors.nom}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="telephone">Téléphone (optionnel)</label>
            <input
              id="telephone"
              className="input"
              value={form.telephone}
              onChange={(e) => update('telephone', e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="service">Service concerné</label>
            <select
              id="service"
              className="select"
              value={form.serviceId}
              onChange={(e) => update('serviceId', e.target.value)}
            >
              <option value="">— Sélectionner un service (optionnel) —</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.categorie}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="message">Votre message</label>
            <div className="input-with-mic">
              <textarea
                id="message"
                className="textarea"
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
              />
            </div>
            <div className="hint">Vous pouvez utiliser la saisie vocale ci-dessous puis corriger le texte.</div>
            <VoiceInputButton currentValue={form.message} onTranscript={(t) => update('message', t)} />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
            {sending ? 'Envoi en cours…' : 'Envoyer le message'}
          </button>
        </form>

        <div className="card" style={{ marginTop: 24 }}>
          <h3>Autres moyens de nous contacter</h3>
          <p>Email : {siteConfig.contact.email}</p>
          <p>Téléphone : {siteConfig.contact.telephone}</p>
          <p>Adresse : {siteConfig.contact.adresse}</p>
        </div>
      </div>
    </section>
  );
}
