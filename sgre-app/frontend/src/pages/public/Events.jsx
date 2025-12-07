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
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/events');
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term and filters
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status ? event.status === filters.status : true;
      const matchesDate = filters.date ? new Date(event.start_at).toDateString() === new Date(filters.date).toDateString() : true;
      return matchesSearch && matchesStatus && matchesDate;
    });
    setFilteredEvents(filtered);
  }, [events, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: 'SCHEDULED', date: '' });
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      case 'COMPLETED':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Prévu';
      case 'CANCELLED':
        return 'Annulé';
      case 'COMPLETED':
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  const getEventStats = () => {
    return {
      total: filteredEvents.length,
      scheduled: filteredEvents.filter(event => event.status === 'SCHEDULED').length,
      cancelled: filteredEvents.filter(event => event.status === 'CANCELLED').length,
      completed: filteredEvents.filter(event => event.status === 'COMPLETED').length,
    };
  };

  const stats = getEventStats();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Événements</h1>
      <div>
        <input
          type="text"
          placeholder="Rechercher des événements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <button onClick={resetFilters} className="btn btn-secondary">Réinitialiser les filtres</button>
      </div>
      <div>
        {filteredEvents.map(event => (
          <div key={event.id} className={`event-card ${getStatusColor(event.status)}`}>
            <h2 className="text-xl">{event.title}</h2>
            <p>{formatDate(event.start_at)} - {getStatusLabel(event.status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicEvents;