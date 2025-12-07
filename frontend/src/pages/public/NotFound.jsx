import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-2xl text-gray-700 mb-4">Page non trouvée</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            ← Retour
          </button>
          <Link to="/" className="btn btn-primary">
            Aller à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;