import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendarAlt, FaBuilding, FaUsers } from 'react-icons/fa';
import ResourceCard from '../../components/ResourceCard';

const PublicResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: 'AVAILABLE',
    capacity: ''
  });

  useEffect(() => {
    // Simuler le chargement des ressources
    setTimeout(() => {
      const sampleResources = [
        {
          id: 1,
          name: 'Salle de Conférence A',
          type: 'SALLE',
          capacity: 50,
          location: 'Bâtiment A, Étage 1',
          status: 'AVAILABLE',
          description: 'Salle équipée avec projecteur, écran et système audio professionnel',
          attributes: {
            equipment: ['projecteur', 'écran', 'wifi', 'climatisation', 'tableau blanc'],
            access: ['handicapé']
          },
          total_reservations: 15,
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          name: 'Salle de Réunion B',
          type: 'SALLE',
          capacity: 12,
          location: 'Bâtiment B, Étage 2',
          status: 'AVAILABLE',
          description: 'Salle de réunion standard avec tableau blanc et connexion wifi',
          attributes: {
            equipment: ['tableau blanc', 'wifi', 'vidéoconférence'],
            access: ['standard']
          },
          total_reservations: 8,
          created_at: '2024-01-05T14:00:00Z'
        },
        {
          id: 3,
          name: 'Projecteur HD',
          type: 'EQUIPEMENT',
          capacity: 1,
          location: 'Stock Équipements',
          status: 'AVAILABLE',
          description: 'Projecteur HD 4000 lumens avec câbles HDMI',
          attributes: {
            specifications: ['HD 1920x1080', '4000 lumens', 'HDMI/VGA'],
            compatibility: ['PC', 'Mac', 'Smartphone']
          },
          total_reservations: 22,
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: 4,
          name: 'Véhicule de Service',
          type: 'VEHICULE',
          capacity: 7,
          location: 'Parking Principal',
          status: 'AVAILABLE',
          description: 'Minibus 7 places, permis B requis, GPS inclus',
          attributes: {
            features: ['7 places', 'GPS', 'Climatisation', 'Sièges cuir'],
            requirements: ['Permis B', 'Carte grise']
          },
          total_reservations: 5,
          created_at: '2024-01-15T11:00:00Z'
        },
        {
          id: 5,
          name: 'Salle Formation',
          type: 'SALLE',
          capacity: 25,
          location: 'Bâtiment C, RDC',
          status: 'UNAVAILABLE',
          description: 'En rénovation jusqu\'au 15/01, équipement neuf prévu',
          attributes: {
            equipment: ['projecteur', 'écran', 'wifi', 'climatisation'],
            notes: 'Réouverture le 16/01'
          },
          total_reservations: 0,
          created_at: '2024-01-20T08:00:00Z'
        }
      ];

      setResources(sampleResources);
      setFilteredResources(sampleResources);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Appliquer les filtres et la recherche
    let result = resources;

    // Filtre par type
    if (filters.type) {
      result = result.filter(resource => resource.type === filters.type);
    }

    // Filtre par statut
    if (filters.status) {
      result = result.filter(resource => resource.status === filters.status);
    }

    // Filtre par capacité
    if (filters.capacity) {
      const capacity = parseInt(filters.capacity);
      result = result.filter(resource => resource.capacity >= capacity);
    }

    // Recherche par texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(resource =>
        resource.name.toLowerCase().includes(term) ||
        resource.location.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term)
      );
    }

    setFilteredResources(result);
  }, [resources, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      status: 'AVAILABLE',
      capacity: ''
    });
    setSearchTerm('');
  };

  const getResourceTypeCount = (type) => {
    return resources.filter(r => r.type === type).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des ressources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nos Ressources</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Découvrez et réservez nos salles, équipements et véhicules pour vos événements et projets
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{resources.length}</p>
            <p className="text-gray-600">Total ressources</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.status === 'AVAILABLE').length}
            </p>
            <p className="text-gray-600">Disponibles</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {getResourceTypeCount('SALLE')}
            </p>
            <p className="text-gray-600">Salles</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {getResourceTypeCount('EQUIPEMENT') + getResourceTypeCount('VEHICULE')}
            </p>
            <p className="text-gray-600">Équipements & Véhicules</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="w-full md:w-auto md:flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une ressource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="btn btn-outline flex items-center gap-2"
              >
                <FaFilter />
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de ressource
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les types</option>
                <option value="SALLE">Salles</option>
                <option value="EQUIPEMENT">Équipements</option>
                <option value="VEHICULE">Véhicules</option>
                <option value="MATERIEL">Matériel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UNAVAILABLE">Indisponible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité minimale
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Toute capacité</option>
                <option value="1">1 personne</option>
                <option value="5">5 personnes</option>
                <option value="10">10 personnes</option>
                <option value="20">20 personnes</option>
                <option value="50">50 personnes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Ressources disponibles ({filteredResources.length})
            </h2>
            <div className="text-sm text-gray-600">
              Tri: Par défaut
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12 card">
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ressource trouvée</h3>
              <p className="text-gray-600 mb-4">
                Aucune ressource ne correspond à vos critères de recherche
              </p>
              <button
                onClick={resetFilters}
                className="btn btn-primary"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource}
                  canEdit={false}
                  isPublic={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Prêt à réserver une ressource ?
              </h3>
              <p className="text-gray-700">
                Créez un compte ou connectez-vous pour accéder à notre système de réservation
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="btn btn-primary px-6">
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-outline px-6">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900">Réservation simple</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Réservez vos ressources en quelques clics avec notre interface intuitive
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBuilding className="text-green-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900">Large choix</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Salles, équipements, véhicules : trouvez la ressource parfaite pour votre projet
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900">Support dédié</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Notre équipe est à votre disposition pour vous accompagner dans vos réservations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicResources;