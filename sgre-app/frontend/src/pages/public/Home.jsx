import React from 'react';

const Home = () => {
  const features = [
    {
      icon: <FaBuilding />,
      title: 'Gestion des Ressources',
      description: 'Gérez vos salles, équipements et véhicules en un seul endroit',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Planification d\'Événements',
      description: 'Organisez vos événements avec une gestion complète des participants',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: <FaUsers />,
      title: 'Réservations Intelligentes',
      description: 'Système de réservation avec détection de conflits et alternatives',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: <FaChartLine />,
      title: 'Rapports et Analytics',
      description: 'Suivez l\'utilisation de vos ressources avec des rapports détaillés',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const stats = [
    { value: '500+', label: 'Réservations mensuelles' },
    { value: '50+', label: 'Ressources disponibles' },
    { value: '1000+', label: 'Utilisateurs satisfaits' },
    { value: '99%', label: 'Disponibilité système' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Créez votre compte',
      description: 'Inscription gratuite et rapide en quelques clics'
    },
    {
      step: '2',
      title: 'Parcourez les ressources',
      description: 'Découvrez nos salles, équipements et véhicules disponibles'
    },
    {
      step: '3',
      title: 'Réservez en ligne',
      description: 'Choisissez vos dates et faites votre réservation instantanément'
    },
    {
      step: '4',
      title: 'Recevez confirmation',
      description: 'Obtenez votre confirmation et préparez votre événement'
    }
  ];

  return (
    <div>
      <h1>Bienvenue sur SGRE-App</h1>
      <section>
        <h2>Fonctionnalités</h2>
        <div>
          {features.map((feature, index) => (
            <div key={index} className={`${feature.bgColor} p-4 rounded`}>
              <div className={feature.color}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Statistiques</h2>
        <div>
          {stats.map((stat, index) => (
            <div key={index}>
              <strong>{stat.value}</strong> - {stat.label}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Comment ça marche</h2>
        <div>
          {howItWorks.map((step, index) => (
            <div key={index}>
              <strong>{step.step}. </strong>{step.title} - {step.description}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;