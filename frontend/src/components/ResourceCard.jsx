import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaWrench, FaInfoCircle } from 'react-icons/fa';

const ResourceCard = ({ resource, canEdit = false, isPublic = false, onUpdate }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'MAINTENANCE':
        return 'Maintenance';
      case 'UNAVAILABLE':
        return 'Indisponible';
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'SALLE':
        return 'bg-blue-100 text-blue-800';
      case 'EQUIPEMENT':
        return 'bg-green-100 text-green-800';
      case 'VEHICULE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    const types = {
      'SALLE': 'Salle',
      'EQUIPEMENT': 'Équipement',
      'VEHICULE': 'Véhicule',
      'MATERIEL': 'Matériel'
    };
    return types[type] || type;
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la ressource "${resource.name}" ?`)) {
      try {
        // Implémenter la suppression
        console.log('Supprimer ressource:', resource.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`badge ${getStatusColor(resource.status)} flex items-center gap-1 text-xs`}>
                {getStatusIcon(resource.status)}
                {getStatusText(resource.status)}
              </span>
              <span className={`badge ${getTypeColor(resource.type)} text-xs`}>
                {getTypeText(resource.type)}
              </span>
              {resource.capacity > 1 && (
                <span className="badge badge-info text-xs flex items-center gap-1">
                  <FaUsers className="text-xs" />
                  {resource.capacity} pers.
                </span>
              )}
            </div>
          </div>
          {canEdit && !isPublic && (
            <div className="flex gap-2">
              <Link
                to={`/admin/resources/${resource.id}/edit`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Modifier"
              >
                <FaEdit />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {resource.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
        )}

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-gray-400" />
            <span className="text-sm">{resource.location}</span>
          </div>

          {/* Attributes */}
          {resource.attributes && (
            <div className="mt-3">
              {resource.attributes.equipment && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FaInfoCircle className="text-xs" />
                    Équipements
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {resource.attributes.equipment.map((equip, index) => (
                      <span key={index} className="badge badge-info text-xs">
                        {equip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            {isPublic ? (
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                <span>Connectez-vous pour réserver</span>
                <span>→</span>
              </Link>
            ) : canEdit ? (
              <Link
                to={`/admin/resources/${resource.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                <span>Gérer cette ressource</span>
                <span>→</span>
              </Link>
            ) : (
              <Link
                to={`/client/resources/${resource.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                <span>Réserver cette ressource</span>
                <span>→</span>
              </Link>
            )}
            
            {resource.total_reservations !== undefined && (
              <span className="text-xs text-gray-500">
                {resource.total_reservations} réservation(s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;