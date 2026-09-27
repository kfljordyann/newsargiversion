import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchService } from '../api/services';
import Icon from '../components/ui/Icon';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [status, setStatus] = useState('chargement'); // chargement | ok | introuvable | erreur

  useEffect(() => {
    setStatus('chargement');
    fetchService(id)
      .then((data) => {
        setService(data.service);
        setStatus('ok');
      })
      .catch((err) => {
        setStatus(err.status === 404 ? 'introuvable' : 'erreur');
      });
  }, [id]);

  if (status === 'chargement') {
    return (
      <section className="section container">
        <div className="skeleton" style={{ height: 40, maxWidth: 320, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </section>
    );
  }

  if (status === 'introuvable') {
    return (
      <section className="section container state-panel">
        <h2>Service introuvable</h2>
        <p>Ce service n'existe pas ou n'est plus disponible.</p>
        <Link to="/services" className="btn btn--primary">Retour aux services</Link>
      </section>
    );
  }

  if (status === 'erreur') {
    return (
      <section className="section container state-panel">
        <p className="error-text">Impossible de charger ce service pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <span className="badge badge--blue">{service.categorie}</span>
        <h1>{service.categorie}</h1>
        <p style={{ maxWidth: '65ch' }}>{service.description}</p>
        <Link to={`/contact?service=${service.id}`} className="btn btn--accent">
          Demander ce service
        </Link>

        <div className="grid grid--cards" style={{ marginTop: 32 }}>
          {service.prestations.map((prestation) => (
            <div className="card" key={prestation.id}>
              <Icon name="check" className="service-card__icon" />
              <h3>{prestation.nom}</h3>
              <p>{prestation.description}</p>
              <Link
                to={`/contact?service=${service.id}&prestation=${prestation.id}`}
                className="btn btn--ghost"
              >
                Demander cette prestation
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
