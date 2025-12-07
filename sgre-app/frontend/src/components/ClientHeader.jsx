import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ClientHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <h1 className="text-xl font-bold">Welcome, {user.fullName}</h1>
          </div>
          <div className="flex items-center">
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;