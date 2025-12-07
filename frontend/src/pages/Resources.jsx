import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getResources } from '../api/resources';
import ResourceCard from '../components/ResourceCard';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';

const Resources = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: ''
  });

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await getResources(filters);
      setResources(response.resources || []);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implémenter la recherche si nécessaire
  };

  const filteredResources = resources.filter(resource => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resource.name.toLowerCase().includes(searchLower) ||
      resource.type.toLowerCase().includes(searchLower) ||
      resource.location.toLowerCase().includes(searchLower)
    );
  });

  const resourceTypes = [...new Set(resources.map(r => r.type))];
  const resourceLocations = [...new Set(resources.map(r => r.location))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des ressources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ressources</h1>
          <p className="text-gray-600 mt-2">
            Consultez et gérez les ressources disponibles
          </p>
        </div>
        {isManagerOrAdmin && (
          <Link to="/resources/new" className="btn btn-primary flex items-center gap-2">
            <FaPlus />
            Ajouter une ressource
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <form onSubmit={handleSearch} className="mb-6">
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
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
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
              Localisation
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Toutes les localisations</option>
              {resourceLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilters({ type: '', status: '', location: '' })}
            className="btn btn-outline flex items-center gap-2"
          >
            <FaFilter />
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ressource trouvée</h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource}
              canEdit={isManagerOrAdmin}
              onUpdate={fetchResources}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <p className="text-2xl font-bold text-primary-600">{resources.length}</p>
          <p className="text-gray-600">Total ressources</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-2xl font-bold text-green-600">
            {resources.filter(r => r.status === 'AVAILABLE').length}
          </p>
          <p className="text-gray-600">Ressources disponibles</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {resources.filter(r => r.status === 'MAINTENANCE').length}
          </p>
          <p className="text-gray-600">En maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default Resources;