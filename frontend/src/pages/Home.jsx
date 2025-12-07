import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaBuilding, FaChartLine } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            SGRE-App
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Système de Gestion des Ressources et Événements
          </p>
          <p className="text-lg mb-10 max-w-3xl mx-auto">
            Une plateforme complète pour gérer vos ressources, planifier vos événements 
            et optimiser l'utilisation de vos espaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Créer un compte
            </Link>
            <Link 
              to="/login" 
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaBuilding className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestion des Ressources</h3>
              <p className="text-gray-600">
                Gérez tous vos espaces, équipements et véhicules en un seul endroit.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaCalendarAlt className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Planification d'Événements</h3>
              <p className="text-gray-600">
                Créez et organisez vos événements avec une gestion complète des participants.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaUsers className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Réservations Intelligentes</h3>
              <p className="text-gray-600">
                Système de réservation avec détection de conflits et suggestions d'alternatives.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaChartLine className="text-4xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rapports et Analytics</h3>
              <p className="text-gray-600">
                Suivez l'utilisation de vos ressources et générez des rapports détaillés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Rôles et Permissions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 border-t-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Administrateur</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Gestion complète des utilisateurs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Attribution des rôles
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Consultation des logs et rapports
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Paramétrage global du système
                </li>
              </ul>
            </div>
            
            <div className="card p-6 border-t-4 border-green-500">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Manager</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Gestion des ressources (CRUD)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Gestion des événements (CRUD)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Validation des réservations
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Gestion des participants
                </li>
              </ul>
            </div>
            
            <div className="card p-6 border-t-4 border-purple-500">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Client</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Consultation des ressources disponibles
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Réservation de ressources
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Inscription aux événements
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Suivi de ses réservations et notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme dès maintenant et simplifiez la gestion de vos ressources et événements.
          </p>
          <Link 
            to="/register" 
            className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg inline-block"
          >
            S'inscrire gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;