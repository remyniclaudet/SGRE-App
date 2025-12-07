import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaWrench } from 'react-icons/fa';

const ResourceCard = ({ resource, canEdit = false, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <FaCheckCircle className="text-green-500" />;
      case 'MAINTENANCE':
        return <FaWrench className="text-yellow-500" />;
      case 'UNAVAILABLE':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'badge-success';
      case 'MAINTENANCE':
        return 'badge-warning';
      case 'UNAVAILABLE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la ressource "${resource.name}" ?`)) {
      try {
        setLoading(true);
        // Implémenter la suppression
        console.log('Supprimer ressource:', resource.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${getStatusColor(resource.status)} flex items-center gap-1`}>
                {getStatusIcon(resource.status)}
                {resource.status}
              </span>
              <span className="badge badge-info">{resource.type}</span>
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Link
                to={`/resources/${resource.id}/edit`}
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

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{resource.location}</span>
          </div>
          
          {resource.capacity > 1 && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaUsers />
              <span>Capacité: {resource.capacity} personnes</span>
            </div>
          )}

          {resource.total_reservations !== undefined && (
            <div className="text-sm text-gray-500">
              {resource.total_reservations} réservation(s)
            </div>
          )}

          {/* Attributes */}
          {resource.attributes && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Équipements :</h4>
              <div className="flex flex-wrap gap-2">
                {resource.attributes.equipment?.map((equip, index) => (
                  <span key={index} className="badge badge-info text-xs">
                    {equip}
                  </span>
                )) || (
                  <span className="text-sm text-gray-500">Aucun équipement spécifié</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <Link
              to={`/resources/${resource.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Voir détails →
            </Link>
            <span className="text-xs text-gray-500">
              Créé le {new Date(resource.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;