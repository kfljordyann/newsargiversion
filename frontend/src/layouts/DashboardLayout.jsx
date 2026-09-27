import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import './DashboardLayout.css';

const NAV = [
  { to: '/espace-client', label: 'Vue d\'ensemble', end: true },
  { to: '/espace-client/demandes', label: 'Mes demandes' },
  { to: '/espace-client/nouvelle-demande', label: 'Nouvelle demande' },
  { to: '/espace-client/messages', label: 'Messages' },
  { to: '/espace-client/profil', label: 'Profil' },
];

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="container dashboard">
        <aside className="dashboard__sidebar" aria-label="Navigation de l'espace client">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dashboard__nav-link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </aside>
        <section className="dashboard__content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
