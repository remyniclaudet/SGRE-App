import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NewReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const resourceId = queryParams.get('resource');
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableResources, setAvailableResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(resourceId || '');
  const [formData, setFormData] = useState({
    resource_id: resourceId || '',
    start_date: '',
    end_date: '',
    notes: '',
    event_id: ''
  });
  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resourceId) {
      fetchResourceDetails(resourceId);
    }
    fetchAvailableResources();
    fetchEvents();
  }, [resourceId]);

  const fetchResourceDetails = async (id) => {
    try {
      const response = await api.get(`/resources/public/${id}`);
      setResource(response.data.resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };

  const fetchAvailableResources = async () => {
    try {
      const response = await api.get('/resources/public');
      setAvailableResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
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
    
    if (!formData.resource_id) {
      newErrors.resource_id = 'Veuillez sélectionner une ressource';
    }
    
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
      const response = await api.post('/reservations', formData);
      
      if (response.data.success) {
        alert('Réservation effectuée avec succès ! Elle est en attente de confirmation.');
        navigate('/client/reservations');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const handleResourceChange = (e) => {
    const resourceId = e.target.value;
    setSelectedResourceId(resourceId);
    setFormData({ ...formData, resource_id: resourceId });
    
    if (resourceId) {
      const selectedResource = availableResources.find(r => r.id == resourceId);
      setResource(selectedResource);
    } else {
      setResource(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
              {/* Sélection de la ressource */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ressource *
                </label>
                <select
                  value={selectedResourceId}
                  onChange={handleResourceChange}
                  className={`input-field ${errors.resource_id ? 'border-red-300' : ''}`}
                >
                  <option value="">Sélectionner une ressource</option>
                  {availableResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} - {resource.type}
                    </option>
                  ))}
                </select>
                {errors.resource_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.resource_id}</p>
                )}
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
                      {event.title} - {formatDate(event.date)}
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
                  rows="4"
                  className="input-field"
                  placeholder="Informations supplémentaires, demandes particulières..."
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/client/catalog')}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaCheckCircle />
                  <span>Effectuer la réservation</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-6">
          {/* Aperçu de la ressource */}
          {resource ? (
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Ressource sélectionnée</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">{resource.name}</h3>
                  <p className="text-sm text-gray-600">{resource.type}</p>
                </div>
                
                {resource.description && (
                  <p className="text-sm text-gray-700">{resource.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  {resource.capacity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacité:</span>
                      <span className="font-medium">{resource.capacity} personnes</span>
                    </div>
                  )}
                  
                  {resource.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Localisation:</span>
                      <span className="font-medium">{resource.location}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className={`font-medium ${
                      resource.status === 'available' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-6">
                <FaCalendarAlt className="text-gray-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-500">Aucune ressource sélectionnée</p>
                <p className="text-sm text-gray-400 mt-1">
                  Veuillez sélectionner une ressource dans la liste
                </p>
              </div>
            </div>
          )}

          {/* Informations importantes */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Informations importantes</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les réservations sont soumises à confirmation</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Vous recevrez une notification par email</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Annulation possible jusqu'à 24h avant</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Présence obligatoire à l'heure de début</span>
              </li>
            </ul>
          </div>

          {/* Assistance */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Besoin d'aide ?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pour toute question concernant votre réservation :
            </p>
            <a
              href="/contact"
              className="block text-center btn-secondary text-sm"
            >
              Contacter le support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;