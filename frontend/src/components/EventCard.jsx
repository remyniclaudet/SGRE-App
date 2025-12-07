import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaTrash, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';

const EventCard = ({ event, canEdit = false, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'badge-success';
      case 'ONGOING':
        return 'badge-warning';
      case 'COMPLETED':
        return 'badge-info';
      case 'CANCELLED':
        return 'badge-danger';
      case 'DRAFT':
        return 'badge-secondary';
      default:
        return 'badge-info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      try {
        setLoading(true);
        // Implémenter la suppression
        console.log('Supprimer événement:', event.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleParticipate = async () => {
    // Implémenter la participation
    console.log('Participer à l\'événement:', event.id);
  };

  const isParticipant = false; // À implémenter

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
              {event.organizer_name && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <FaUser className="text-xs" />
                  {event.organizer_name}
                </span>
              )}
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Link
                to={`/events/${event.id}/edit`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Modifier"
              >
                <FaEdit />
              </Link>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        )}

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>Début: {formatDate(event.start_at)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>Fin: {formatDate(event.end_at)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{event.location}</span>
          </div>
          
          {event.participant_count !== undefined && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaUsers />
              <span>{event.participant_count} participants</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/events/${event.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Voir détails →
          </Link>
          
          {user && user.role === 'CLIENT' && (
            <button
              onClick={handleParticipate}
              className={`text-sm px-3 py-1 rounded-lg ${
                isParticipant
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isParticipant ? 'Déjà inscrit' : 'S\'inscrire'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;