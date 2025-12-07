import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: ''
  });

  useEffect(() => {
    // Simuler le chargement des utilisateurs
    setTimeout(() => {
      const sampleUsers = [
        {
          id: 1,
          email: 'admin@sgre.test',
          fullName: 'Administrateur Principal',
          role: 'ADMIN',
          isActive: true,
          createdAt: '2024-01-01T10:00:00Z',
          lastLogin: '2024-01-15T14:30:00Z'
        },
        {
          id: 2,
          email: 'manager1@sgre.test',
          fullName: 'Manager Événements',
          role: 'MANAGER',
          isActive: true,
          createdAt: '2024-01-02T09:00:00Z',
          lastLogin: '2024-01-14T11:20:00Z'
        },
        {
          id: 3,
          email: 'manager2@sgre.test',
          fullName: 'Manager Ressources',
          role: 'MANAGER',
          isActive: true,
          createdAt: '2024-01-03T14:00:00Z',
          lastLogin: '2024-01-13T16:45:00Z'
        },
        {
          id: 4,
          email: 'client1@sgre.test',
          fullName: 'Jean Dupont',
          role: 'CLIENT',
          isActive: true,
          createdAt: '2024-01-05T11:30:00Z',
          lastLogin: '2024-01-15T10:15:00Z'
        },
        {
          id: 5,
          email: 'client2@sgre.test',
          fullName: 'Marie Martin',
          role: 'CLIENT',
          isActive: false,
          createdAt: '2024-01-06T15:45:00Z',
          lastLogin: '2024-01-10T09:30:00Z'
        },
        {
          id: 6,
          email: 'client3@sgre.test',
          fullName: 'Pierre Durand',
          role: 'CLIENT',
          isActive: true,
          createdAt: '2024-01-08T08:20:00Z',
          lastLogin: '2024-01-14T14:00:00Z'
        }
      ];

      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Appliquer les filtres et la recherche
    let result = users;

    // Filtre par rôle
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }

    // Filtre par statut
    if (filters.status === 'active') {
      result = result.filter(user => user.isActive);
    } else if (filters.status === 'inactive') {
      result = result.filter(user => !user.isActive);
    }

    // Recherche par texte
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(result);
  }, [users, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: '',
      status: ''
    });
    setSearchTerm('');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <FaUserShield className="text-red-500" />;
      case 'MANAGER':
        return <FaUserTie className="text-blue-500" />;
      case 'CLIENT':
        return <FaUser className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'CLIENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Manager';
      case 'CLIENT':
        return 'Client';
      default:
        return role;
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      managers: users.filter(u => u.role === 'MANAGER').length,
      clients: users.filter(u => u.role === 'CLIENT').length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length
    };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez les comptes utilisateurs et les rôles dans le système
          </p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary flex items-center gap-2">
          <FaUserPlus />
          Ajouter un utilisateur
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
          <p className="text-sm text-gray-600">Admins</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.managers}</p>
          <p className="text-sm text-gray-600">Managers</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.clients}</p>
          <p className="text-sm text-gray-600">Clients</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-600">Actifs</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          <p className="text-sm text-gray-600">Inactifs</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="w-full md:w-auto md:flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
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
              Rôle
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Administrateur</option>
              <option value="MANAGER">Manager</option>
              <option value="CLIENT">Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* Éditer */}}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-1 ${user.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 card">
          <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-600 mb-4">
            Aucun utilisateur ne correspond à vos critères de recherche
          </p>
          <button
            onClick={resetFilters}
            className="btn btn-primary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;