import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa';

const ClientHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo et nom */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-white"
              onClick={() => document.getElementById('sidebar').classList.toggle('hidden')}
            >
              <FaBars size={20} />
            </button>
            <Link to="/client" className="text-xl font-bold">
              Espace Client
            </Link>
          </div>

          {/* Actions droite */}
          <div className="flex items-center space-x-4">
            {/* Lien vers accueil */}
            <Link
              to="/"
              className="p-2 hover:bg-green-700 rounded-full"
              title="Retour à l'accueil"
            >
              <FaHome size={20} />
            </Link>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-green-700 rounded-full">
              <FaBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profil utilisateur */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 hover:bg-green-700 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaUserCircle size={24} />
                <span className="hidden md:inline">{user?.name}</span>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <Link
                    to="/client"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/client/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;