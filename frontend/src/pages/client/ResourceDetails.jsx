import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    start_date: '',
    end_date: '',
    notes: ''
  });
  const [reservations, setReservations] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchResourceDetails();
    fetchReservations();
  }, [id]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/resources/public/${id}`);
      setResource(response.data.resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      setError('Ressource non trouvée');
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/reservations?resource_id=${id}`);
      setReservations(response.data.reservations);
      
      // Vérifier la disponibilité
      const now = new Date();
      const hasActiveReservation = response.data.reservations.some(reservation => 
        reservation.status === 'confirmed' && 
        new Date(reservation.end_date) > now
      );
      setIsAvailable(!hasActiveReservation);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/reservations', {
        resource_id: id,
        start_date: reservationData.start_date,
        end_date: reservationData.end_date,
        notes: reservationData.notes
      });
      
      if (response.data.success) {
        alert('Réservation effectuée avec succès ! Elle est en attente de confirmation.');
        setShowReservationModal(false);
        setReservationData({
          start_date: '',
          end_date: '',
          notes: ''
        });
        navigate('/client/reservations');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const checkAvailability = () => {
    if (!reservationData.start_date || !reservationData.end_date) return true;
    
    const startDate = new Date(reservationData.start_date);
    const endDate = new Date(reservationData.end_date);
    
    // Vérifier les conflits avec les réservations existantes
    const hasConflict = reservations.some(reservation => {
      if (reservation.status !== 'confirmed') return false;
      
      const resStart = new Date(reservation.start_date);
      const resEnd = new Date(reservation.end_date);
      
      return (startDate < resEnd && endDate > resStart);
    });
    
    return !hasConflict;
  };

  const isFormValid = () => {
    if (!reservationData.start_date || !reservationData.end_date) return false;
    
    const startDate = new Date(reservationData.start_date);
    const endDate = new Date(reservationData.end_date);
    const now = new Date();
    
    if (startDate < now) return false;
    if (endDate <= startDate) return false;
    
    return checkAvailability();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="text-center py-12">
        <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ressource non trouvée</h2>
        <p className="text-gray-600 mb-6">{error || 'Cette ressource n\'existe pas ou n\'est plus disponible.'}</p>
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

      {/* En-tête */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between">
          <div>
            <div className="flex items-center mb-4">
              <h1 className="text-3xl font-bold mr-4">{resource.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAvailable ? 'Disponible' : 'Indisponible'}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <span className="mr-4">{resource.type}</span>
              {resource.category_name && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                  {resource.category_name}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{resource.description || 'Aucune description disponible.'}</p>
          </div>
          
          <div className="md:text-right">
           <Link
  to={`/client/reservations/new/${resource.id}`}
  className={`px-6 py-3 rounded-lg font-semibold inline-block ${
    isAvailable
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
  }`}
>
  {isAvailable ? 'Réserver maintenant' : 'Indisponible'}
</Link>
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Détails de la ressource</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {resource.capacity && (
                  <div className="flex items-center">
                    <FaUsers className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Capacité</p>
                      <p className="font-medium">{resource.capacity} personnes</p>
                    </div>
                  </div>
                )}
                
                {resource.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Localisation</p>
                      <p className="font-medium">{resource.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className="font-medium capitalize">{resource.status}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Type</p>
                  <p className="font-medium">{resource.type}</p>
                </div>
                
                {resource.category_name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Catégorie</p>
                    <p className="font-medium">{resource.category_name}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Ajoutée le</p>
                  <p className="font-medium">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendrier de disponibilité */}
          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4">Disponibilité</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-3">
                Les périodes en rouge indiquent des réservations confirmées.
              </p>
              <div className="space-y-2">
                {reservations
                  .filter(r => r.status === 'confirmed')
                  .slice(0, 5)
                  .map((reservation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                      <div>
                        <p className="font-medium">Réservé</p>
                        <p className="text-sm text-gray-600">
                          {new Date(reservation.start_date).toLocaleDateString()} - 
                          {new Date(reservation.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-sm text-red-600">Confirmé</span>
                    </div>
                  ))}
                
                {reservations.filter(r => r.status === 'confirmed').length === 0 && (
                  <p className="text-gray-500 text-center py-4">Aucune réservation à venir</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div>
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Conditions d'utilisation</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Réservation soumise à confirmation</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Annulation possible jusqu'à 24h avant</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Présence obligatoire à l'heure de début</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Matériel à rendre en bon état</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Besoin d'aide ?</h2>
            <p className="text-gray-600 mb-4">
              Pour toute question concernant cette ressource ou pour une réservation urgente :
            </p>
            <div className="space-y-3">
              <a
                href="/contact"
                className="block text-center btn-primary"
              >
                Contacter le support
              </a>
              <a
                href="/client/reservations"
                className="block text-center btn-secondary"
              >
                Voir mes réservations
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Réserver {resource.name}</h2>
            
            <form onSubmit={handleReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de début *
                </label>
                <input
                  type="datetime-local"
                  value={reservationData.start_date}
                  onChange={(e) => setReservationData({ ...reservationData, start_date: e.target.value })}
                  required
                  className="input-field"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de fin *
                </label>
                <input
                  type="datetime-local"
                  value={reservationData.end_date}
                  onChange={(e) => setReservationData({ ...reservationData, end_date: e.target.value })}
                  required
                  className="input-field"
                  min={reservationData.start_date || new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              {!checkAvailability() && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    ⚠️ Cette plage horaire n'est pas disponible. Veuillez choisir d'autres dates.
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={reservationData.notes}
                  onChange={(e) => setReservationData({ ...reservationData, notes: e.target.value })}
                  rows="3"
                  className="input-field"
                  placeholder="Informations supplémentaires..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    isFormValid()
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;