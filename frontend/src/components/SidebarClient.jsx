import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaSearch,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SidebarClient = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/client', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/client/catalog', icon: FaSearch, label: 'Catalogue' },
    { path: '/client/reservations', icon: FaClipboardList, label: 'Mes réservations' },
    { path: '/client/profile', icon: FaUser, label: 'Mon profil' },
  ];

  return (
    <aside
      id="sidebar"
      className="bg-green-800 text-white w-64 min-h-screen hidden lg:block fixed left-0 top-0 z-40"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Espace Client</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'hover:bg-green-700'
                }`
              }
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <div className="pt-8 mt-8 border-t border-green-700">
            <a
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
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

export default SidebarClient;