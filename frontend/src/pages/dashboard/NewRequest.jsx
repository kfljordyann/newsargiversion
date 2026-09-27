import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../../api/services';
import { createRequest } from '../../api/requests';
import VoiceInputButton from '../../components/ui/VoiceInputButton';
import { useToast } from '../../contexts/ToastContext';

export default function NewRequest() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: '',
    prestationId: '',
    description: '',
    urgence: 'normale',
    informationsComplementaires: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices().then((data) => setServices(data.services)).catch(() => {});
  }, []);

  const selectedService = services.find((s) => s.id === form.serviceId);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value, ...(field === 'serviceId' ? { prestationId: '' } : {}) }));
  }

  function validate() {
    const next = {};
    if (!form.serviceId) next.serviceId = 'Choisissez un service.';
    if (!form.description.trim()) next.description = 'Merci de décrire votre besoin.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createRequest(form);
      showToast('Votre demande a bien été enregistrée.', 'success');
      navigate('/espace-client/demandes');
    } catch (err) {
      showToast(err.message || "Une erreur est survenue.", 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="stack" style={{ maxWidth: 640 }}>
      <h1>Nouvelle demande</h1>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="serviceId">Service</label>
          <select id="serviceId" className="select" value={form.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
            <option value="">— Sélectionner un service —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.categorie}</option>
            ))}
          </select>
          {errors.serviceId && <span className="error-text">{errors.serviceId}</span>}
        </div>

        {selectedService && (
          <div className="field">
            <label htmlFor="prestationId">Prestation précise (optionnel)</label>
            <select id="prestationId" className="select" value={form.prestationId} onChange={(e) => update('prestationId', e.target.value)}>
              <option value="">— Toute la catégorie —</option>
              {selectedService.prestations.map((p) => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="urgence">Niveau d'urgence</label>
          <select id="urgence" className="select" value={form.urgence} onChange={(e) => update('urgence', e.target.value)}>
            <option value="faible">Faible</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="description">Description de votre besoin</label>
          <textarea
            id="description"
            className="textarea"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
          <VoiceInputButton currentValue={form.description} onTranscript={(t) => update('description', t)} />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="field">
          <label htmlFor="infos">Informations complémentaires (optionnel)</label>
          <textarea
            id="infos"
            className="textarea"
            rows={3}
            value={form.informationsComplementaires}
            onChange={(e) => update('informationsComplementaires', e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Envoi en cours…' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
  );
}
