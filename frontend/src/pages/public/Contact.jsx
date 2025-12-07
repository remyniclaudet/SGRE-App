import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouteriez l'appel API pour envoyer le message
    alert('Message envoyé avec succès !');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Téléphone',
      details: '+33 1 23 45 67 89',
      description: 'Lun-Ven, 9h-18h'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: 'contact@example.com',
      description: 'Réponse sous 24h'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adresse',
      details: '123 Rue de Paris',
      description: '75000 Paris, France'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Contactez-nous</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Informations de contact */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <info.icon className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{info.title}</h3>
                    <p className="text-gray-800">{info.details}</p>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="input-field"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <FaPaperPlane />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Questions Fréquentes</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Comment créer un compte ?</h3>
            <p className="text-gray-600">
              Cliquez sur le bouton "S'inscrire" en haut de la page et remplissez le formulaire 
              d'inscription. Vous recevrez une confirmation par email.
            </p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Comment réserver une ressource ?</h3>
            <p className="text-gray-600">
              Connectez-vous à votre compte, parcourez le catalogue des ressources disponibles, 
              sélectionnez la ressource souhaitée et choisissez vos dates de réservation.
            </p>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Quels sont les délais de réponse ?</h3>
            <p className="text-gray-600">
              Nous nous engageons à répondre à toutes les demandes dans un délai de 24 heures 
              ouvrables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;