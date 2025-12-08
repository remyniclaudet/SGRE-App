import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ClientLayout from './layouts/ClientLayout';

// Pages publiques
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Pages admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminResources from './pages/admin/Resources';
import AdminEvents from './pages/admin/Events';
import AdminSettings from './pages/admin/Settings';

// Pages manager
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerResources from './pages/manager/Resources';
import ManagerEvents from './pages/manager/Events';
import ManagerReservations from './pages/manager/Reservations';

// Pages client
import ClientDashboard from './pages/client/Dashboard';
import ClientCatalog from './pages/client/Catalog';
import ClientReservations from './pages/client/Reservations';
import ClientProfile from './pages/client/Profile';
import NewReservation from './pages/client/NewReservation';
import ResourceDetails from './pages/client/ResourceDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Routes admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Routes manager */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="resources" element={<ManagerResources />} />
            <Route path="events" element={<ManagerEvents />} />
            <Route path="reservations" element={<ManagerReservations />} />
          </Route>

          {/* Routes client */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="catalog" element={<ClientCatalog />} />
            <Route path="catalog/:id" element={<ResourceDetails />} />
            <Route path="reservations" element={<ClientReservations />} />
            <Route path="reservations/new" element={<NewReservation />} />
            <Route path="reservations/new/:id" element={<NewReservation />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          {/* Redirections par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;