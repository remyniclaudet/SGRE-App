import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBars, 
  FaTimes, 
  FaBell, 
  FaUser, 
  FaSignOutAlt,
  FaHome,
  FaBuilding,
  FaCalendarAlt
} from 'react-icons/fa';
import NotificationList from './NotificationList';

const Header = ({ notifications = [], unreadCount = 0 }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin';
      case 'MANAGER': return '/manager';
      case 'CLIENT': return '/client';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SGRE-App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2">
              Accueil
            </Link>
            
            {user ? (
              <>
                <Link to="/resources" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Ressources
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Événements
                </Link>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Tableau de bord
                </Link>
              </>
            ) : (
              <>
                <Link to="/resources" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Ressources
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Événements
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 text-gray-700 hover:text-primary-600"
                  >
                    <FaBell className="text-xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                      <NotificationList 
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                      />
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-primary-600" />
                    </div>
                    <span className="hidden md:inline">{user.fullName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser className="mr-2" />
                        Mon profil
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaHome className="mr-2" />
                        Tableau de bord
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaBell className="mr-2" />
                        Notifications
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-outline">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="mr-2" />
                Accueil
              </Link>
              
              <Link
                to="/resources"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBuilding className="mr-2" />
                Ressources
              </Link>
              
              <Link
                to="/events"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCalendarAlt className="mr-2" />
                Événements
              </Link>
              
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaHome className="mr-2" />
                    Tableau de bord
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Mon profil
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;