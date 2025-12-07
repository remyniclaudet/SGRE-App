import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaCalendarAlt } from 'react-icons/fa';

const ManagerResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category_id: '',
    status: 'available',
    description: '',
    capacity: '',
    location: ''
  });
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = resources.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources');
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

  const fetchReservations = async (resourceId) => {
    try {
      const response = await api.get(`/reservations?resource_id=${resourceId}`);
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        type: '',
        category_id: '',
        status: 'available',
        description: '',
        capacity: '',
        location: ''
      });
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleEditResource = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/resources/${selectedResource.id}`, formData);
      setShowEditModal(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error editing resource:', error);
    }
  };

  const handleDeleteResource = async () => {
    try {
      await api.delete(`/resources/${selectedResource.id}`);
      setShowDeleteModal(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const openEditModal = (resource) => {
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      category_id: resource.category_id,
      status: resource.status,
      description: resource.description || '',
      capacity: resource.capacity || '',
      location: resource.location || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const openAvailabilityModal = async (resource) => {
    setSelectedResource(resource);
    await fetchReservations(resource.id);
    setShowAvailabilityModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement des ressources...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Ressources</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Ajouter une ressource</span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="card mb-6">
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

      {/* Tableau des ressources */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">Nom</th>
                <th className="table-header">Type</th>
                <th className="table-header">Statut</th>
                <th className="table-header">Capacité</th>
                <th className="table-header">Localisation</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <td className="table-cell font-medium">{resource.name}</td>
                  <td className="table-cell">{resource.type}</td>
                  <td className="table-cell">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="table-cell">{resource.capacity || '-'}</td>
                  <td className="table-cell">{resource.location || '-'}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openAvailabilityModal(resource)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir disponibilité"
                      >
                        <FaCalendarAlt />
                      </button>
                      <button
                        onClick={() => openEditModal(resource)}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(resource)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout ressource */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter une ressource</h2>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Ex: Salle, Véhicule, Équipement"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="available">Disponible</option>
                  <option value="unavailable">Indisponible</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Édition ressource */}
      {showEditModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier la ressource</h2>
            <form onSubmit={handleEditResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="available">Disponible</option>
                  <option value="unavailable">Indisponible</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacité
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedResource(null);
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Disponibilité */}
      {showAvailabilityModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              Disponibilité - {selectedResource.name}
            </h2>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Statut actuel</p>
                  <p className={`font-medium ${getStatusColor(selectedResource.status)} inline-block px-3 py-1 rounded-full`}>
                    {selectedResource.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedResource.type}</p>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold mb-3">Réservations à venir</h3>
            {reservations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="table-header">Client</th>
                      <th className="table-header">Date de début</th>
                      <th className="table-header">Date de fin</th>
                      <th className="table-header">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="table-cell">{reservation.user_name}</td>
                        <td className="table-cell">
                          {new Date(reservation.start_date).toLocaleString()}
                        </td>
                        <td className="table-cell">
                          {new Date(reservation.end_date).toLocaleString()}
                        </td>
                        <td className="table-cell">
                          <span className={`px-2 py-1 rounded text-xs ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune réservation à venir</p>
            )}
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la ressource <strong>{selectedResource.name}</strong> ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedResource(null);
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button onClick={handleDeleteResource} className="btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerResources;