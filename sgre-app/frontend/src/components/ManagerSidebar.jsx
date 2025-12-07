// frontend/src/components/ManagerSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaUsers,
  FaCheckCircle,
  FaChartLine,
  FaUser
} from 'react-icons/fa';

const ManagerSidebar = () => {
  const navItems = [
    { path: '/manager', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/manager/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/manager/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/manager/reservations', label: 'Réservations', icon: <FaClipboardList /> },
    { path: '/manager/approvals', label: 'Validations', icon: <FaCheckCircle /> },
    { path: '/manager/participants', label: 'Participants', icon: <FaUsers /> },
    { path: '/manager/reports', label: 'Rapports', icon: <FaChartLine /> },
    { path: '/manager/profile', label: 'Mon profil', icon: <FaUser /> },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Gestion</h2>
          <p className="text-blue-300 text-sm mt-1">Gestion des ressources et événements</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
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

export default ManagerSidebar;