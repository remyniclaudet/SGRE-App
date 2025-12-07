// frontend/src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ClientLayout from './layouts/ClientLayout';

// Pages publiques
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Resources from './pages/public/Resources';
import Events from './pages/public/Events';

// Pages admin
import Dashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import AddUser from './pages/admin/AddUser';
import ResourcesManagement from './pages/admin/ResourcesManagement';
import EventsManagement from './pages/admin/EventsManagement';
import ReservationsManagement from './pages/admin/ReservationsManagement';

// Pages manager
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerResources from './pages/manager/Resources';
import ManagerEvents from './pages/manager/Events';
import ManagerReservations from './pages/manager/Reservations';

// Pages client
import ClientDashboard from './pages/client/Dashboard';
import ClientResources from './pages/client/Resources';
import ClientEvents from './pages/client/Events';
import ClientReservations from './pages/client/Reservations';

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return !user ? children : <Navigate to={`/${user.role?.toLowerCase()}`} />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'ADMIN') return <Navigate to="/" />;
  
  return <AdminLayout>{children}</AdminLayout>;
};

const ManagerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'MANAGER') return <Navigate to="/" />;
  
  return <ManagerLayout>{children}</ManagerLayout>;
};

const ClientRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'CLIENT') return <Navigate to="/" />;
  
  return <ClientLayout>{children}</ClientLayout>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="resources" element={<Resources />} />
        <Route path="events" element={<Events />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="resources" element={<ResourcesManagement />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="reservations" element={<ReservationsManagement />} />
      </Route>
      <Route path="/manager" element={<ManagerRoute />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="resources" element={<ManagerResources />} />
        <Route path="events" element={<ManagerEvents />} />
        <Route path="reservations" element={<ManagerReservations />} />
      </Route>
      <Route path="/client" element={<ClientRoute />}>
        <Route index element={<ClientDashboard />} />
        <Route path="resources" element={<ClientResources />} />
        <Route path="events" element={<ClientEvents />} />
        <Route path="reservations" element={<ClientReservations />} />
      </Route>
    </Routes>
  );
}

export default App;