import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ResourcesManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/admin/resources');
        setResources(response.data.resources);
      } catch (err) {
        setError('Erreur lors de la récupération des ressources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/resources/${id}`);
      setResources(resources.filter(resource => resource.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la ressource');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Gestion des Ressources</h1>
      <Link to="/admin/resources/add" className="btn btn-primary">Ajouter une ressource</Link>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.name}</td>
              <td>{resource.type}</td>
              <td>{resource.status}</td>
              <td>
                <Link to={`/admin/resources/${resource.id}`} className="btn btn-secondary">Modifier</Link>
                <button onClick={() => handleDelete(resource.id)} className="btn btn-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesManagement;