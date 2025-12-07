import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById, createResource, updateResource } from '../api/resources';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ResourceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    type: 'SALLE',
    capacity: 1,
    location: '',
    status: 'AVAILABLE',
    attributes: '{}'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await getResourceById(id);
      if (response.resource) {
        setFormData({
          name: response.resource.name || '',
          type: response.resource.type || 'SALLE',
          capacity: response.resource.capacity || 1,
          location: response.resource.location || '',
          status: response.resource.status || 'AVAILABLE',
          attributes: JSON.stringify(response.resource.attributes || {}, null, 2)
        });
      }
    } catch (error) {
      setError('Erreur lors du chargement de la ressource');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Parse JSON attributes
      let parsedAttributes = {};
      try {
        parsedAttributes = JSON.parse(formData.attributes);
      } catch {
        parsedAttributes = {};
      }

      const resourceData = {
        ...formData,
        attributes: parsedAttributes
      };

      if (isEditMode) {
        await updateResource(id, resourceData);
      } else {
        await createResource(resourceData);
      }

      navigate('/resources');
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/resources')}
          className="btn btn-outline flex items-center gap-2 mb-4"
        >
          <FaArrowLeft />
          Retour aux ressources
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Modifier la ressource' : 'Nouvelle ressource'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ex: Salle de conférence A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="SALLE">Salle</option>
              <option value="EQUIPEMENT">Équipement</option>
              <option value="VEHICULE">Véhicule</option>
              <option value="MATERIEL">Matériel</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacité
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ex: Bâtiment A, Étage 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="AVAILABLE">Disponible</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UNAVAILABLE">Indisponible</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attributs (JSON)
          </label>
          <textarea
            name="attributes"
            value={formData.attributes}
            onChange={handleChange}
            rows="6"
            className="input font-mono text-sm"
            placeholder='{"equipment": ["projecteur", "écran"], "notes": "..."}'
          />
          <p className="text-xs text-gray-500 mt-2">
            Format JSON valide. Peut contenir des équipements, spécifications, etc.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/resources')}
            className="btn btn-outline"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaSave />
            {saving ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResourceForm;