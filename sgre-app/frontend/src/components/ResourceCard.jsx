const ResourceCard = ({ resource, canEdit = false, isPublic = false, onUpdate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <FaCheckCircle className="text-green-500" />;
      case 'UNAVAILABLE':
        return <FaTimesCircle className="text-red-500" />;
      case 'MAINTENANCE':
        return <FaWrench className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100';
      case 'UNAVAILABLE':
        return 'bg-red-100';
      case 'MAINTENANCE':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'UNAVAILABLE':
        return 'Indisponible';
      case 'MAINTENANCE':
        return 'En maintenance';
      default:
        return 'Statut inconnu';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'SALLE':
        return 'bg-blue-100';
      case 'EQUIPEMENT':
        return 'bg-purple-100';
      case 'VEHICULE':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'SALLE':
        return 'Salle';
      case 'EQUIPEMENT':
        return 'Équipement';
      case 'VEHICULE':
        return 'Véhicule';
      default:
        return 'Type inconnu';
    }
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      await onUpdate(resource.id);
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${getStatusColor(resource.status)}`}>
      <h3 className="font-bold">{resource.name}</h3>
      <p>{getTypeText(resource.type)}</p>
      <p>{getStatusText(resource.status)}</p>
      {canEdit && (
        <button onClick={handleDelete} className="text-red-500 hover:underline">
          Supprimer
        </button>
      )}
    </div>
  );
};

export default ResourceCard;