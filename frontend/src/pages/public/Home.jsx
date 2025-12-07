import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaBox,
      title: 'Gestion des Ressources',
      description: 'Gérez efficacement vos salles, véhicules et équipements'
    },
    {
      icon: FaCalendarAlt,
      title: 'Planning des Événements',
      description: 'Organisez et planifiez vos événements en toute simplicité'
    },
    {
      icon: FaUsers,
      title: 'Réservations en ligne',
      description: 'Permettez à vos clients de réserver en ligne 24/7'
    },
    {
      icon: FaCheckCircle,
      title: 'Gestion Simplifiée',
      description: 'Interface intuitive pour une gestion optimale'
    }
  ];

  const resources = [
    { name: 'Salles de conférence', count: '12 disponibles' },
    { name: 'Véhicules de service', count: '8 disponibles' },
    { name: 'Équipements audiovisuels', count: '25 disponibles' },
    { name: 'Matériel informatique', count: '15 disponibles' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20 rounded-xl mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Système de Gestion des Ressources et Événements
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Solution complète pour la gestion de vos ressources, événements et réservations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="flex justify-center mb-4">
                <feature.icon className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Ressources Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{resource.name}</h3>
              <p className="text-primary-600 font-medium">{resource.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à commencer ?</h2>
        <p className="text-gray-600 mb-6">
          Rejoignez notre plateforme et simplifiez la gestion de vos ressources dès aujourd'hui
        </p>
        <Link
          to="/register"
          className="btn-primary inline-block px-8 py-3"
        >
          Créer un compte gratuit
        </Link>
      </section>
    </div>
  );
};

export default Home;