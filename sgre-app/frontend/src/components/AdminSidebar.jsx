// frontend/src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaUserShield,
  FaHistory
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/users', label: 'Utilisateurs', icon: <FaUsers /> },
    { path: '/admin/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/admin/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/admin/reservations', label: 'Réservations', icon: <FaClipboardList /> },
    { path: '/admin/reports', label: 'Rapports', icon: <FaChartBar /> },
    { path: '/admin/settings', label: 'Paramètres', icon: <FaCog /> },
    { path: '/admin/audit', label: 'Logs d\'audit', icon: <FaHistory /> },
    { path: '/admin/profile', label: 'Mon profil', icon: <FaUserShield /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Administration</h2>
          <p className="text-gray-400 text-sm mt-1">Gestion complète du système</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;