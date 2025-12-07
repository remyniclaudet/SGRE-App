import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

const ManagerHeader = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 lg:hidden"
            >
              <FaBars size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SGRE-Manager</h1>
              <p className="text-sm text-gray-600">Gestion des ressources et événements</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">{user?.fullName}</span>
                <FaChevronDown size={14} className="text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                  <Link
                    to="/manager/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="mr-2" />
                    Mon profil
                  </Link>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Déconnexion
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

export default ManagerHeader;