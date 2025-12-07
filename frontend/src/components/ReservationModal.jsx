import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';

const ReservationModal = ({ resources, onClose, onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    resource_id: '',
    start_at: '',
    end_at: '',
    event_id: '',
    user_id: userId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.resource_id || !formData.start_at || !formData.end_at) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }

    if (new Date(formData.start_at) >= new Date(formData.end_at)) {
      setError('La date de début doit être antérieure à la date de fin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  // Définir des dates par défaut
  const now = new Date();
  const defaultStart = now.toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle réservation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Resource Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ressource *
            </label>
            <select
              name="resource_id"
              value={formData.resource_id}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Sélectionnez une ressource</option>
              {resources
                .filter(r => r.status === 'AVAILABLE')
                .map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.type}) - {resource.location}
                  </option>
                ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Date et heure de début *
              </label>
              <input
                type="datetime-local"
                name="start_at"
                value={formData.start_at || defaultStart}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Date et heure de fin *
              </label>
              <input
                type="datetime-local"
                name="end_at"
                value={formData.end_at || defaultEnd}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          {/* Event (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Événement associé (optionnel)
            </label>
            <input
              type="text"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="input"
              placeholder="ID de l'événement"
            />
            <p className="text-xs text-gray-500 mt-2">
              Laissez vide si la réservation n'est pas liée à un événement
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Instructions :</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• La réservation sera soumise pour validation</li>
              <li>• Vous recevrez une notification une fois confirmée</li>
              <li>• Vérifiez les disponibilités avant de soumettre</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Création en cours...' : 'Créer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;