import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SGRE-App</span>
            </div>
            <p className="text-gray-400 mb-4">
              Système de Gestion des Ressources et Événements.
              Une plateforme complète pour optimiser la gestion de vos espaces et événements.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a 
                href="mailto:contact@sgre-app.test" 
                className="text-gray-400 hover:text-white transition-colors"
                title="Contact"
              >
                <FaEnvelope className="text-xl" />
              </a>
              <Link 
                to="/about" 
                className="text-gray-400 hover:text-white transition-colors"
                title="À propos"
              >
                <FaInfoCircle className="text-xl" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Ressources
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} SGRE-App. Projet de démonstration.
            <span className="block mt-2 text-sm">
              ⚠️ Cette application est destinée à des fins de démonstration uniquement.
              Les mots de passe sont stockés en clair.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;