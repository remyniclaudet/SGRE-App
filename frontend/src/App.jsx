import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardManager from './pages/DashboardManager';
import DashboardClient from './pages/DashboardClient';
import Resources from './pages/Resources';
import ResourceForm from './pages/ResourceForm';
import Events from './pages/Events';
import EventForm from './pages/EventForm';
import Reservations from './pages/Reservations';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Reports from './pages/Reports';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header notifications={notifications} unreadCount={unreadCount} />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes by role */}
              <Route path="/admin/*" element={
                <PrivateRoute role="ADMIN">
                  <DashboardAdmin />
                </PrivateRoute>
              } />
              
              <Route path="/manager/*" element={
                <PrivateRoute role="MANAGER">
                  <DashboardManager />
                </PrivateRoute>
              } />
              
              <Route path="/client/*" element={
                <PrivateRoute role="CLIENT">
                  <DashboardClient />
                </PrivateRoute>
              } />
              
              {/* Common protected routes */}
              <Route path="/resources" element={
                <PrivateRoute>
                  <Resources />
                </PrivateRoute>
              } />
              
              <Route path="/resources/new" element={
                <PrivateRoute roles={['MANAGER', 'ADMIN']}>
                  <ResourceForm />
                </PrivateRoute>
              } />
              
              <Route path="/resources/:id/edit" element={
                <PrivateRoute roles={['MANAGER', 'ADMIN']}>
                  <ResourceForm />
                </PrivateRoute>
              } />
              
              <Route path="/events" element={<Events />} />
              
              <Route path="/events/new" element={
                <PrivateRoute roles={['MANAGER', 'ADMIN']}>
                  <EventForm />
                </PrivateRoute>
              } />
              
              <Route path="/events/:id/edit" element={
                <PrivateRoute roles={['MANAGER', 'ADMIN']}>
                  <EventForm />
                </PrivateRoute>
              } />
              
              <Route path="/reservations" element={
                <PrivateRoute>
                  <Reservations />
                </PrivateRoute>
              } />
              
              <Route path="/notifications" element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/reports" element={
                <PrivateRoute roles={['ADMIN', 'MANAGER']}>
                  <Reports />
                </PrivateRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;