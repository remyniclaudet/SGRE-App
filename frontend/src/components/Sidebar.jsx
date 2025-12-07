import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaBell,
  FaChartBar,
  FaCog,
  FaUser,
  FaHome
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'MANAGER': return '/manager';
      case 'CLIENT': return '/client';
      default: return '/';
    }
  };

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/users', label: 'Utilisateurs', icon: <FaUsers /> },
    { path: '/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/reservations', label: 'Réservations', icon: <FaClipboardList /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/reports', label: 'Rapports', icon: <FaChartBar /> },
    { path: '/admin/settings', label: 'Paramètres', icon: <FaCog /> },
  ];

  const managerLinks = [
    { path: '/manager', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/reservations', label: 'Réservations', icon: <FaClipboardList /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/reports', label: 'Rapports', icon: <FaChartBar /> },
  ];

  const clientLinks = [
    { path: '/client', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/reservations', label: 'Mes Réservations', icon: <FaClipboardList /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/profile', label: 'Mon Profil', icon: <FaUser /> },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN': return adminLinks;
      case 'MANAGER': return managerLinks;
      case 'CLIENT': return clientLinks;
      default: return [];
    }
  };

  if (!user) {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SGRE-App</span>
        </Link>

        <div className="mb-8">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FaUser className="text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.fullName}</p>
              <p className="text-sm text-gray-600 capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            to="/"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaHome />
            <span>Accueil public</span>
          </Link>

          {getLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;