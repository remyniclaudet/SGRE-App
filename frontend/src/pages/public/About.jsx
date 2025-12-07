import React from 'react';
import { FaBullseye, FaUsers, FaShieldAlt, FaRocket } from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: FaBullseye,
      title: 'Notre Mission',
      description: 'Simplifier la gestion des ressources et événements pour les organisations de toutes tailles.'
    },
    {
      icon: FaUsers,
      title: 'Notre Vision',
      description: 'Devenir la plateforme de référence pour la gestion collaborative des ressources.'
    },
    {
      icon: FaShieldAlt,
      title: 'Nos Valeurs',
      description: 'Simplicité, efficacité, collaboration et innovation au cœur de notre approche.'
    },
    {
      icon: FaRocket,
      title: 'Notre Engagement',
      description: 'Fournir une solution fiable et évolutive qui s\'adapte à vos besoins.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">À propos de RME System</h1>
      
      <div className="card mb-8">
        <p className="text-lg text-gray-700 mb-6">
          Bienvenue sur RME System, votre partenaire de confiance pour la gestion optimisée 
          des ressources et événements. Notre plateforme a été conçue pour répondre aux besoins 
          spécifiques des organisations modernes.
        </p>
        
        <p className="text-lg text-gray-700 mb-6">
          Fondée en 2024, notre entreprise s'est donnée pour mission de simplifier les processus 
          complexes de gestion des ressources tout en offrant une expérience utilisateur intuitive 
          et efficace.
        </p>
      </div>

      {/* Nos valeurs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Nos Valeurs Fondamentales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                <value.icon className="text-primary-600 text-2xl mr-3" />
                <h3 className="text-xl font-semibold">{value.title}</h3>
              </div>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notre équipe */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Notre Équipe</h2>
        <p className="text-gray-700 mb-6">
          Notre équipe est composée de professionnels passionnés par la technologie et 
          l'innovation. Nous combinons expertise technique et compréhension des besoins 
          métiers pour développer des solutions qui font la différence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h4 className="font-semibold">Jean Dupont</h4>
            <p className="text-gray-600">CEO & Fondateur</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h4 className="font-semibold">Marie Martin</h4>
            <p className="text-gray-600">Directrice Technique</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h4 className="font-semibold">Pierre Bernard</h4>
            <p className="text-gray-600">Responsable Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;