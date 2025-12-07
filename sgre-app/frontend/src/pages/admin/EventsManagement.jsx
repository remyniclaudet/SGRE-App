import React, { useEffect, useState } from 'react';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/v1/admin/events');
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des événements');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Chargement des événements...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Gestion des Événements</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventsManagement;