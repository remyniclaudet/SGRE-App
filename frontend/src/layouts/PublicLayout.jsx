import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RME System</h3>
              <p className="text-gray-400">
                Système de gestion des ressources et événements
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Accueil</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white">À propos</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">contact@example.com</p>
              <p className="text-gray-400">+33 1 23 45 67 89</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 RME System. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;