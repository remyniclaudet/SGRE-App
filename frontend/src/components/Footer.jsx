import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaEnvelope, FaInfoCircle, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SG</span>
              </div>
              <div>
                <span className="text-2xl font-bold">SGRE-App</span>
                <p className="text-sm text-gray-400">Système de Gestion des Ressources et Événements</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Une plateforme complète pour optimiser la gestion de vos espaces, 
              planifier vos événements et simplifier vos réservations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="GitHub"
              >
                <FaGithub className="text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a 
                href="mailto:contact@sgre-app.test" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="Contact"
              >
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
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
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Légal</h3>
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
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <FaEnvelope className="mt-1 flex-shrink-0" />
                <span>contact@sgre-app.test</span>
              </li>
              <li className="flex items-start gap-2">
                <FaInfoCircle className="mt-1 flex-shrink-0" />
                <span>Support disponible 9h-18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Warning */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} SGRE-App. Tous droits réservés.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Version: 1.0.0 | Dernière mise à jour: Janvier 2024
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="inline-block px-3 py-1 bg-red-900/30 border border-red-800 rounded-lg">
                <p className="text-xs text-red-300">
                  ⚠️ Version de démonstration - Non destinée à la production
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;