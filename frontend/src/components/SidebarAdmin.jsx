import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxes,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SidebarAdmin = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'Utilisateurs' },
    { path: '/admin/resources', icon: FaBoxes, label: 'Ressources' },
    { path: '/admin/events', icon: FaCalendarAlt, label: 'Événements' },
    { path: '/admin/settings', icon: FaCog, label: 'Paramètres' },
  ];

  return (
    <aside
      id="sidebar"
      className="bg-gray-900 text-white w-64 min-h-screen hidden lg:block fixed left-0 top-0 z-40"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-800'
                }`
              }
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <div className="pt-8 mt-8 border-t border-gray-700">
            <a
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaHome />
              <span>Accueil public</span>
            </a>
            
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarAdmin;