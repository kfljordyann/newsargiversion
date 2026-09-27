import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand">
            <img src={siteConfig.logo} alt={siteConfig.nom} className="footer__logo" />
            <span>{siteConfig.nom}</span>
          </div>
          <p>
            Cabinet multidisciplinaire fondé en {siteConfig.fondation} au Bénin, actif dans le
            juridique, le financier, l'immobilier, l'informatique et l'intelligence artificielle.
          </p>
        </div>

        <div>
          <h3>Liens rapides</h3>
          <ul className="footer__list">
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/services">Nos services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/connexion">Espace client</Link></li>
          </ul>
        </div>

        <div>
          <h3>Services</h3>
          <ul className="footer__list">
            <li><Link to="/services#juridique">Juridique</Link></li>
            <li><Link to="/services#financier">Financier</Link></li>
            <li><Link to="/services#immobilier">Immobilier</Link></li>
            <li><Link to="/services#intelligence-artificielle">Intelligence artificielle</Link></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer__list">
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.telephone}</li>
            <li>{siteConfig.contact.adresse}</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {year} {siteConfig.nom}. Tous droits réservés.</span>
        <div className="footer__legal">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/confidentialite">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
