import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import DashboardOverview from './pages/dashboard/Overview';
import MyRequests from './pages/dashboard/MyRequests';
import NewRequest from './pages/dashboard/NewRequest';
import Messages from './pages/dashboard/Messages';
import Profile from './pages/dashboard/Profile';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/espace-client" element={<DashboardOverview />} />
        <Route path="/espace-client/demandes" element={<MyRequests />} />
        <Route path="/espace-client/nouvelle-demande" element={<NewRequest />} />
        <Route path="/espace-client/messages" element={<Messages />} />
        <Route path="/espace-client/profil" element={<Profile />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
