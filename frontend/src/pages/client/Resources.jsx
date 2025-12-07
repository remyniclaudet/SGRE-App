import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';
import resourcesAPI from '../../api/resources';

const ClientResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    minCapacity: ''
  });
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
        offset: 0
      };

      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.minCapacity) params.minCapacity = filters.minCapacity;

      const response = await resourcesAPI.getAllResources(params);
      setResources(response.data.data);

      // Extraire les types uniques
      const uniqueTypes = [...new Set(response.data.data.map(r => r.type))];
      setTypes(uniqueTypes);
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ressources disponibles</h1>
        <p className="text-gray-600 mt-2">Consultez et réservez les ressources de votre choix</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4 gap-2 text-gray-700">
          <FaFilter />
          <h2 className="font-semibold">Filtrer les résultats</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, type..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Capacité minimum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacité minimum
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ type: '', search: '', minCapacity: '' })}
              className="w-full btn btn-outline"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length > 0 ? (
          resources.map(resource => (
            <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                <div className="text-white text-4xl opacity-30">
                  <FaMapMarkerAlt />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                  <p className="text-sm text-gray-600">{resource.type}</p>
                </div>

                {/* Détails */}
                <div className="space-y-2">
                  {resource.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-primary-600" />
                      {resource.location}
                    </div>
                  )}
                  {resource.capacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUsers className="text-primary-600" />
                      Capacité: {resource.capacity} personnes
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    resource.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    resource.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.status === 'AVAILABLE' ? 'Disponible' :
                     resource.status === 'MAINTENANCE' ? 'Maintenance' :
                     'Non disponible'}
                  </span>
                </div>

                {/* Description */}
                {resource.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {resource.description}
                  </p>
                )}

                {/* Action */}
                <Link
                  to={`/client/resources/${resource.id}`}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  Voir les détails
                  <FaArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">Aucune ressource ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientResources;