import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaFilter, FaSearch } from 'react-icons/fa';

const PublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'SCHEDULED',
    date: ''
  });

  useEffect(() => {
    // Simuler le chargement des événements
    setTimeout(() => {
      const sampleEvents = [
        {
          id: 1,
          title: 'Conférence Annuelle',
          description: 'Conférence annuelle sur les innovations technologiques et les tendances du secteur.',
          organizer_id: 1,
          organizer_name: 'Administrateur Principal',
          start_at: '2024-01-20T09:00:00Z',
          end_at: '2024-01-20T12:00:00Z',
          location: 'Salle de Conférence A',
          status: 'SCHEDULED',
          max_participants: 50,
          participant_count: 25,
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          title: 'Formation Management',
          description: 'Formation complète aux techniques de management moderne et leadership.',
          organizer_id: 2,
          organizer_name: 'Manager Événements',
          start_at: '2024-01-18T14:00:00Z',
          end_at: '2024-01-18T17:00:00Z',
          location: 'Salle de Réunion B',
          status: 'SCHEDULED',
          max_participants: 12,
          participant_count: 8,
          created_at: '2024-01-05T14:00:00Z'
        },
        {
          id: 3,
          title: 'Réunion Équipe Projet',
          description: 'Réunion de suivi hebdomadaire du projet X avec présentation des avancements.',
          organizer_id: 2,
          organizer_name: 'Manager Événements',
          start_at: '2024-01-16T10:00:00Z',
          end_at: '2024-01-16T12:00:00Z',
          location: 'Salle de Réunion B',
          status: 'ONGOING',
          max_participants: 8,
          participant_count: 6,
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: 4,
          title: 'Atelier Développement Web',
          description: 'Atelier pratique sur les dernières technologies web et bonnes pratiques.',
          organizer_id: 1,
          organizer_name: 'Administrateur Principal',
          start_at: '2024-01-25T09:00:00Z',
          end_at: '2024-01-25T18:00:00Z',
          location: 'Salle Formation',
          status: 'SCHEDULED',
          max_participants: 25,
          participant_count: 12,
          created_at: '2024-01-15T11:00:00Z'
        }
      ];

      setEvents(sampleEvents);
      setFilteredEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Appliquer les filtres et la recherche
    let result = events;

    // Filtre par statut
    if (filters.status) {
      result = result.filter(event => event.status === filters.status);
    }

    // Filtre par date
    if (filters.date) {
      const selectedDate = new Date(filters.date);
      result = result.filter(event => {
        const eventDate = new Date(event.start_at);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Recherche par texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    setFilteredEvents(result);
  }, [events, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'SCHEDULED',
      date: ''
    });
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getEventStats = () => {
    return {
      total: events.length,
      scheduled: events.filter(e => e.status === 'SCHEDULED').length,
      ongoing: events.filter(e => e.status === 'ONGOING').length,
      upcoming: events.filter(e => 
        e.status === 'SCHEDULED' && new Date(e.start_at) > new Date()
      ).length
    };
  };

  const stats = getEventStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Événements à venir</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Découvrez et participez à nos conférences, formations et ateliers organisés régulièrement
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.total}</p>
            <p className="text-gray-600">Événements</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            <p className="text-gray-600">Planifiés</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.ongoing}</p>
            <p className="text-gray-600">En cours</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{stats.upcoming}</p>
            <p className="text-gray-600">À venir</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="w-full md:w-auto md:flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut de l'événement
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="SCHEDULED">Planifié</option>
                <option value="ONGOING">En cours</option>
                <option value="COMPLETED">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date spécifique
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Événements disponibles ({filteredEvents.length})
            </h2>
            <div className="text-sm text-gray-600">
              Tri: Date croissante
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 card">
              <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun événement ne correspond à vos critères de recherche
              </p>
              <button
                onClick={resetFilters}
                className="btn btn-primary"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Event Image/Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                          <FaCalendarAlt className="text-white text-2xl" />
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <div className="flex items-center gap-4 mb-3">
                              <span className={`badge ${getStatusColor(event.status)}`}>
                                {getStatusLabel(event.status)}
                              </span>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <FaUsers className="text-xs" />
                                {event.participant_count}/{event.max_participants} participants
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatDate(event.start_at)}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock />
                            <span>
                              {new Date(event.start_at).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(event.end_at).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt />
                            <span>{event.location}</span>
                          </div>
                          <div className="text-gray-600">
                            Organisé par: {event.organizer_name}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                          <button className="btn btn-primary flex-1">
                            Voir les détails
                          </button>
                          <button className="btn btn-outline flex-1">
                            S'inscrire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Souhaitez-vous organiser un événement ?
              </h3>
              <p className="text-gray-700">
                Contactez-nous pour planifier et organiser votre événement avec nos ressources
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="btn bg-green-600 text-white hover:bg-green-700 px-6">
                Se connecter
              </Link>
              <button className="btn btn-outline px-6">
                Nous contacter
              </button>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Comment participer ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Créez un compte</h4>
              <p className="text-gray-600 text-sm">
                Inscrivez-vous gratuitement pour accéder à tous nos événements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choisissez un événement</h4>
              <p className="text-gray-600 text-sm">
                Parcourez notre catalogue et sélectionnez l'événement qui vous intéresse
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Inscrivez-vous</h4>
              <p className="text-gray-600 text-sm">
                Cliquez sur "S'inscrire" et recevez votre confirmation par email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEvents;