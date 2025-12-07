import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const PrivateRoute = ({ children, role, roles = [] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle si spécifié
  if (role && user.role !== role) {
    if (roles.length === 0) {
      // Si un seul rôle est demandé
      switch (user.role) {
        case 'ADMIN':
          return <Navigate to="/admin" replace />;
        case 'MANAGER':
          return <Navigate to="/manager" replace />;
        case 'CLIENT':
          return <Navigate to="/client" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  // Vérification des rôles multiples
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Rediriger vers le dashboard approprié
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'MANAGER':
        return <Navigate to="/manager" replace />;
      case 'CLIENT':
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Layout avec sidebar pour les utilisateurs connectés
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default PrivateRoute;