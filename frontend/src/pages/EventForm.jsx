import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEventById, createEvent, updateEvent } from '../api/events';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_at: '',
    end_at: '',
    location: '',
    status: 'DRAFT',
    organizer_id: user?.id || ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    } else {
      // Set default dates for new event
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setFormData(prev => ({
        ...prev,
        start_at: now.toISOString().slice(0, 16),
        end_at: tomorrow.toISOString().slice(0, 16)
      }));
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await getEventById(id);
      if (response.event) {
        const event = response.event;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          start_at: event.start_at ? event.start_at.slice(0, 16) : '',
          end_at: event.end_at ? event.end_at.slice(0, 16) : '',
          location: event.location || '',
          status: event.status || 'DRAFT',
          organizer_id: event.organizer_id || user?.id || ''
        });
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'événement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validation
    if (new Date(formData.start_at) >= new Date(formData.end_at)) {
      setError('La date de début doit être antérieure à la date de fin');
      setSaving(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateEvent(id, formData);
      } else {
        await createEvent(formData);
      }

      navigate('/events');
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
          onClick={() => navigate('/events')}
          className="btn btn-outline flex items-center gap-2 mb-4"
        >
          <FaArrowLeft />
          Retour aux événements
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input"
            placeholder="Ex: Conférence annuelle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="input"
            placeholder="Description détaillée de l'événement..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date et heure de début *
            </label>
            <input
              type="datetime-local"
              name="start_at"
              value={formData.start_at}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date et heure de fin *
            </label>
            <input
              type="datetime-local"
              name="end_at"
              value={formData.end_at}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
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
            placeholder="Ex: Salle de conférence A, Bâtiment principal"
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
            <option value="DRAFT">Brouillon</option>
            <option value="SCHEDULED">Planifié</option>
            <option value="ONGOING">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/events')}
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

export default EventForm;