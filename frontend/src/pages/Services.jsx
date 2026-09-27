import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { fetchServices } from '../api/services';

export default function Services() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data.services))
      .catch(() => setError(true));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <span className="badge badge--blue">Nos services</span>
        <h1>Une offre complète, organisée par domaine</h1>
        <p style={{ maxWidth: '65ch' }}>
          Chaque domaine regroupe plusieurs prestations. Consultez le détail d'une catégorie
          ou envoyez directement une demande depuis le formulaire de contact.
        </p>

        {error && (
          <div className="state-panel">
            <p className="error-text">
              Impossible de charger le catalogue de services. Vérifiez que l'API backend est
              démarrée sur le port configuré.
            </p>
          </div>
        )}

        {!services && !error && (
          <div className="grid grid--cards" style={{ marginTop: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220 }} />
            ))}
          </div>
        )}

        {services && services.length === 0 && (
          <div className="state-panel">Aucun service disponible pour le moment.</div>
        )}

        {services && services.length > 0 && (
          <div className="grid grid--cards" style={{ marginTop: 24 }}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
