import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const NewReservation = () => {
  const { id } = useParams(); // ID de la ressource depuis l'URL
  const location = useLocation();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    resource_id: id || '',
    start_date: '',
    end_date: '',
    notes: '',
    event_id: ''
  });
  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (id) {
      fetchResourceDetails(id);
      fetchAvailableTimes(id);
    }
    fetchEvents();
  }, [id]);

  const fetchResourceDetails = async (resourceId) => {
    try {
      setLoading(true);
      const response = await api.get(`/resources/public/${resourceId}`);
      setResource(response.data.resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      alert('Erreur lors du chargement de la ressource');
      navigate('/client/catalog');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimes = async (resourceId) => {
    try {
      // Pour simplifier, on va générer des créneaux pour les 7 prochains jours
      const times = [];
      const now = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(now.getDate() + i);
        
        // Créneaux du matin
        const morningStart = new Date(date);
        morningStart.setHours(9, 0, 0, 0);
        
        const morningEnd = new Date(date);
        morningEnd.setHours(12, 0, 0, 0);
        
        // Créneaux de l'après-midi
        const afternoonStart = new Date(date);
        afternoonStart.setHours(14, 0, 0, 0);
        
        const afternoonEnd = new Date(date);
        afternoonEnd.setHours(17, 0, 0, 0);
        
        times.push({
          date: date.toISOString().split('T')[0],
          morning: { start: morningStart, end: morningEnd },
          afternoon: { start: afternoonStart, end: afternoonEnd }
        });
      }
      
      setAvailableTimes(times);
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events/public');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.start_date) {
      newErrors.start_date = 'Veuillez sélectionner une date de début';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'Veuillez sélectionner une date de fin';
    }
    
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = 'La date de fin doit être après la date de début';
      }
      
      if (startDate < new Date()) {
        newErrors.start_date = 'La date de début ne peut pas être dans le passé';
      }
      
      // Vérifier que la durée ne dépasse pas 8 heures
      const durationHours = (endDate - startDate) / (1000 * 60 * 60);
      if (durationHours > 8) {
        newErrors.end_date = 'La durée maximale de réservation est de 8 heures';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await api.post('/reservations', formData);
      
      if (response.data.success) {
        alert('✅ Réservation effectuée avec succès ! Elle est en attente de confirmation.');
        navigate('/client/reservations');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(error.response?.data?.message || '❌ Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSelect = (start, end) => {
    setFormData({
      ...formData,
      start_date: start.toISOString().slice(0, 16),
      end_date: end.toISOString().slice(0, 16)
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement de la ressource...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-12">
        <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ressource non trouvée</h2>
        <p className="text-gray-600 mb-6">Cette ressource n'existe pas ou n'est plus disponible.</p>
        <button
          onClick={() => navigate('/client/catalog')}
          className="btn-primary inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/client/catalog')}
        className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
      >
        <FaArrowLeft className="mr-2" />
        Retour au catalogue
      </button>

      <h1 className="text-3xl font-bold mb-8">Nouvelle réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aperçu de la ressource */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{resource.name}</h3>
                    <p className="text-gray-600">{resource.type}</p>
                    {resource.description && (
                      <p className="text-sm text-gray-700 mt-2">{resource.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    resource.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {resource.status === 'available' ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {resource.capacity && (
                    <div className="flex items-center">
                      <FaUsers className="text-gray-400 mr-2" />
                      <span className="text-sm">Capacité: {resource.capacity} personnes</span>
                    </div>
                  )}
                  
                  {resource.location && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-2" />
                      <span className="text-sm">{resource.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de début *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={`input-field ${errors.start_date ? 'border-red-300' : ''}`}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={`input-field ${errors.end_date ? 'border-red-300' : ''}`}
                    min={formData.start_date || new Date().toISOString().slice(0, 16)}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                  )}
                </div>
              </div>

              {/* Créneaux rapides */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FaClock className="inline mr-2" />
                  Créneaux recommandés
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableTimes.slice(0, 4).map((timeSlot, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        {formatDate(timeSlot.date)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleQuickSelect(
                            timeSlot.morning.start,
                            timeSlot.morning.end
                          )}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm"
                        >
                          Matin (9h-12h)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelect(
                            timeSlot.afternoon.start,
                            timeSlot.afternoon.end
                          )}
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-sm"
                        >
                          Après-midi (14h-17h)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Événement associé */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Événement associé (optionnel)
                </label>
                <select
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner un événement</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {formatDate(event.date)} {formatTime(event.date)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="input-field"
                  placeholder="Informations supplémentaires, demandes particulières..."
                />
              </div>

              {/* Résumé */}
              {formData.start_date && formData.end_date && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Résumé de votre réservation</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">Du</p>
                      <p className="font-medium">
                        {new Date(formData.start_date).toLocaleString('fr-FR', {
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-600">Au</p>
                      <p className="font-medium">
                        {new Date(formData.end_date).toLocaleString('fr-FR', {
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/client/catalog')}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || resource.status !== 'available'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold ${
                    submitting || resource.status !== 'available'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      <span>Confirmer la réservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {/* Conditions */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Conditions d'utilisation</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Réservation soumise à confirmation</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Vous recevrez un email de confirmation</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Annulation gratuite jusqu'à 24h avant</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Présence requise à l'heure de début</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Durée max : 8 heures par réservation</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Assistance</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pour toute question concernant votre réservation ou en cas de problème :
            </p>
            <div className="space-y-3">
              <a
                href="/contact"
                className="block text-center btn-secondary text-sm"
              >
                Contacter le support
              </a>
              <button
                onClick={() => navigate('/client/reservations')}
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Voir mes réservations
              </button>
            </div>
          </div>

          {/* Statut de la ressource */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Disponibilité</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut actuel</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  resource.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {resource.status === 'available' ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{resource.type}</span>
              </div>
              
              {resource.category_name && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium">{resource.category_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;