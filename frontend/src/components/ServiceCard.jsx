import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function ServiceCard({ service }) {
  return (
    <article className="card service-card" id={service.id}>
      <div className="service-card__icon">
        <Icon name={service.icone} size={26} />
      </div>
      <h3>{service.categorie}</h3>
      <p>{service.description}</p>
      <p className="service-card__count">{service.prestations.length} prestations</p>
      <div className="row">
        <Link to={`/services/${service.id}`} className="btn btn--ghost">
          Voir les détails
        </Link>
        <Link to={`/contact?service=${service.id}`} className="btn btn--accent">
          Demander ce service
        </Link>
      </div>
    </article>
  );
}
