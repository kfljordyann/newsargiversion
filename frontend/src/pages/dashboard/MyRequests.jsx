import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyRequests } from '../../api/requests';

const STATUS_CLASS = {
  'Nouvelle demande': 'status-pill--nouvelle',
  'En cours': 'status-pill--cours',
  "En attente d'informations": 'status-pill--attente',
  'Traitée': 'status-pill--traitee',
  'Clôturée': 'status-pill--cloturee',
};

export default function MyRequests() {
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMyRequests()
      .then((data) => setRequests(data.requests))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="stack">
      <div className="row row--between">
        <h1>Mes demandes</h1>
        <Link to="/espace-client/nouvelle-demande" className="btn btn--accent">Nouvelle demande</Link>
      </div>

      {error && <p className="error-text">Impossible de charger vos demandes.</p>}

      {!requests && !error && <div className="skeleton" style={{ height: 160 }} />}

      {requests && requests.length === 0 && (
        <div className="card state-panel">
          <p>Vous n'avez pas encore de demande en cours.</p>
          <Link to="/espace-client/nouvelle-demande" className="btn btn--primary">Faire une demande</Link>
        </div>
      )}

      {requests && requests.length > 0 && (
        <div className="stack">
          {requests.map((r) => (
            <div className="card" key={r.id}>
              <div className="row row--between">
                <h3>{r.serviceId}</h3>
                <span className={`status-pill ${STATUS_CLASS[r.statut] || ''}`}>{r.statut}</span>
              </div>
              <p>{r.description}</p>
              <p className="hint">Créée le {new Date(r.dateCreation).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
