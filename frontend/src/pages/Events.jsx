import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';
import { FaPlus, FaFilter, FaCalendarAlt } from 'react-icons/fa';

const Events = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: ''
  });

  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(filters);
      setEvents(response.events || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'badge-success';
      case 'ONGOING': return 'badge-warning';
      case 'COMPLETED': return 'badge-info';
      case 'CANCELLED': return 'badge-danger';
      case 'DRAFT': return 'badge-secondary';
      default: return 'badge-info';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'SCHEDULED': 'Planifié',
      'ONGOING': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé',
      'DRAFT': 'Brouillon'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-600 mt-2">
            Consultez et participez aux événements programmés
          </p>
        </div>
        {isManagerOrAdmin && (
          <Link to="/events/new" className="btn btn-primary flex items-center gap-2">
            <FaPlus />
            Créer un événement
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaFilter />
          Filtres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="SCHEDULED">Planifié</option>
              <option value="ONGOING">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', start_date: '', end_date: '' })}
              className="btn btn-outline w-full"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Events Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DRAFT'].map(status => {
          const count = events.filter(e => e.status === status).length;
          return (
            <div key={status} className="card p-4 text-center">
              <span className={`badge ${getStatusColor(status)} mb-2`}>
                {getStatusLabel(status)}
              </span>
              <p className="text-2xl font-bold mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500">
              Aucun événement ne correspond à vos critères de recherche
            </p>
            {isManagerOrAdmin && (
              <Link to="/events/new" className="inline-block mt-4 btn btn-primary">
                Créer votre premier événement
              </Link>
            )}
          </div>
        ) : (
          events.map(event => (
            <EventCard 
              key={event.id} 
              event={event}
              canEdit={isManagerOrAdmin}
              onUpdate={fetchEvents}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;