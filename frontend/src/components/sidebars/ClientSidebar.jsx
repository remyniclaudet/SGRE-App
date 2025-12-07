import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardList,
  FaBell,
  FaUser,
  FaTimes
} from 'react-icons/fa';

const ClientSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/client', label: 'Tableau de bord', icon: <FaTachometerAlt /> },
    { path: '/client/resources', label: 'Ressources', icon: <FaBuilding /> },
    { path: '/client/events', label: 'Événements', icon: <FaCalendarAlt /> },
    { path: '/client/reservations', label: 'Mes réservations', icon: <FaClipboardList /> },
    { path: '/client/notifications', label: 'Notifications', icon: <FaBell /> },
    { path: '/client/profile', label: 'Mon profil', icon: <FaUser /> },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 
        transform lg:transform-none transition-transform z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <Link to="/client" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SGRE</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
              <FaTimes />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default ClientSidebar;