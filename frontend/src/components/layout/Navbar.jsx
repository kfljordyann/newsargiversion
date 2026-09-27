import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../ui/Icon';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src={siteConfig.logo} alt={siteConfig.nom} className="navbar__logo" />
          <span>{siteConfig.nom}</span>
        </Link>

        <button
          className="navbar__toggle"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Navigation principale">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                <Link to="/espace-client" className="btn btn--ghost" onClick={() => setOpen(false)}>
                  {user?.prenom ? `Bonjour, ${user.prenom}` : 'Mon espace'}
                </Link>
                <button className="btn btn--primary" onClick={() => { logout(); setOpen(false); }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="btn btn--ghost" onClick={() => setOpen(false)}>
                  Connexion
                </Link>
                <Link to="/inscription" className="btn btn--primary" onClick={() => setOpen(false)}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
