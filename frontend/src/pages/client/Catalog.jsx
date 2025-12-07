import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEye } from 'react-icons/fa';

const ClientCatalog = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchTerm, selectedType, selectedCategory, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources/public');
      setResources(response.data.resources);
      setFilteredResources(response.data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/public');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category_id == selectedCategory);
    }

    setFilteredResources(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCategory('');
  };

  const resourceTypes = Array.from(new Set(resources.map(r => r.type)));

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Salle': return '🎪';
      case 'Véhicule': return '🚗';
      case 'Équipement': return '🎥';
      case 'Matériel': return '💻';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement du catalogue...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catalogue des Ressources</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center space-x-2"
        >
          <FaFilter />
          <span>Filtres</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="card mb-6">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                <option value="">Tous les types</option>
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvée{filteredResources.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des ressources */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                  <h3 className="font-bold text-lg mt-2">{resource.name}</h3>
                  <p className="text-gray-600 text-sm">{resource.type}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Disponible
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {resource.description || 'Aucune description disponible.'}
              </p>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                {resource.capacity && (
                  <div className="flex items-center">
                    <FaUsers className="mr-2" />
                    <span>Capacité: {resource.capacity} personnes</span>
                  </div>
                )}
                {resource.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{resource.location}</span>
                  </div>
                )}
                {resource.category_name && (
                  <div className="flex items-center">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {resource.category_name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/client/reservations/new?resource=${resource.id}`}
                  className="btn-primary flex-1 text-center"
                >
                  Réserver
                </Link>
                <Link
                  to={`/client/catalog/${resource.id}`}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <FaEye />
                  <span>Détails</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune ressource trouvée</h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Événements publics */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Événements à venir</h2>
          <Link to="/client/events" className="text-primary-600 hover:text-primary-700">
            Voir tous les événements
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center mb-3">
                <FaCalendarAlt className="text-primary-600 mr-2" />
                <h3 className="font-semibold">Événement public {i}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Date: {new Date(Date.now() + i * 86400000 * 7).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Description de l'événement public {i}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientCatalog;