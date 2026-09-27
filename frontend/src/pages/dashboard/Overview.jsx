import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMyRequests } from '../../api/requests';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    fetchMyRequests().then((data) => setRequests(data.requests)).catch(() => setRequests([]));
  }, []);

  const enCours = requests?.filter((r) => r.statut !== 'Clôturée').length ?? '—';

  return (
    <div className="stack">
      <h1>Bonjour {user?.prenom} 👋</h1>
      <p>Voici un aperçu de votre espace client SARGI BENIN.</p>

      <div className="grid grid--cards">
        <div className="card">
          <h3>Demandes en cours</h3>
          <p style={{ fontSize: '2rem', color: 'var(--sargi-blue-700)', fontWeight: 800 }}>
            {enCours}
          </p>
          <Link to="/espace-client/demandes" className="btn btn--ghost">Voir mes demandes</Link>
        </div>
        <div className="card">
          <h3>Nouvelle demande</h3>
          <p>Besoin d'un nouveau service ? Faites votre demande en quelques clics.</p>
          <Link to="/espace-client/nouvelle-demande" className="btn btn--accent">Nouvelle demande</Link>
        </div>
        <div className="card">
          <h3>Profil</h3>
          <p>Type de compte : {user?.typeClient}</p>
          <Link to="/espace-client/profil" className="btn btn--ghost">Modifier mon profil</Link>
        </div>
      </div>
    </div>
  );
}
