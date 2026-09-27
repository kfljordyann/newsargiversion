import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../api/services';
import { siteConfig } from '../config/siteConfig';
import Icon from '../components/ui/Icon';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data.services))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="section hero">
        <div className="container hero__grid">
          <div>
            <span className="badge badge--blue">Cabinet multidisciplinaire depuis {siteConfig.fondation}</span>
            <h1>Le bon expert pour chaque décision qui compte.</h1>
            <p style={{ maxWidth: '52ch', fontSize: '1.1rem' }}>
              SARGI BENIN réunit sous un même toit le droit, la finance, l'immobilier,
              l'informatique et l'intelligence artificielle, pour accompagner particuliers,
              entreprises et investisseurs à chaque étape de leurs projets.
            </p>
            <div className="row">
              <Link to="/services" className="btn btn--primary">Découvrir nos services</Link>
              <Link to="/contact" className="btn btn--accent">Demander un service</Link>
            </div>
          </div>
          <div className="hero__stats card">
            {siteConfig.chiffresClés.map((chiffre) => (
              <div key={chiffre.label} className="hero__stat">
                <strong>{chiffre.valeur}</strong>
                <span>{chiffre.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINES D'EXPERTISE */}
      <section className="section section--tint">
        <div className="container">
          <h2>Nos domaines d'expertise</h2>
          <p>Une approche globale et intégrée pour répondre à tous vos besoins.</p>

          {error && (
            <p className="error-text">
              Impossible de charger les services pour le moment. Vérifiez que l'API backend est démarrée.
            </p>
          )}

          {!services && !error && (
            <div className="grid grid--cards">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 220 }} />
              ))}
            </div>
          )}

          {services && (
            <div className="grid grid--cards">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="section">
        <div className="container">
          <h2>Pourquoi choisir SARGI BENIN ?</h2>
          <div className="grid grid--cards">
            <div className="card">
              <Icon name="check" className="service-card__icon" />
              <h3>Expertise pluridisciplinaire</h3>
              <p>Une équipe d'experts qualifiés couvrant le juridique, la finance, l'immobilier, l'informatique et l'IA.</p>
            </div>
            <div className="card">
              <Icon name="check" className="service-card__icon" />
              <h3>Approche sur mesure</h3>
              <p>Des solutions adaptées à chaque profil : particuliers, PME, grandes entreprises et investisseurs.</p>
            </div>
            <div className="card">
              <Icon name="check" className="service-card__icon" />
              <h3>Suivi transparent</h3>
              <p>Un espace client pour suivre l'avancement de chaque demande, du dépôt jusqu'à la clôture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--tint">
        <div className="container hero__cta">
          <div>
            <h2>Prêt à démarrer votre projet ?</h2>
            <p>Contactez SARGI BENIN dès aujourd'hui pour un premier échange sur votre besoin.</p>
          </div>
          <Link to="/contact" className="btn btn--primary">Contacter SARGI</Link>
        </div>
      </section>
    </>
  );
}
