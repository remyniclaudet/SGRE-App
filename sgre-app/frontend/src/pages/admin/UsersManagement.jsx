import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/v1/admin/users');
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term and filters
    const applyFilters = () => {
      let updatedUsers = users;

      if (searchTerm) {
        updatedUsers = updatedUsers.filter(user =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.role) {
        updatedUsers = updatedUsers.filter(user => user.role === filters.role);
      }

      if (filters.status) {
        updatedUsers = updatedUsers.filter(user => user.isActive === (filters.status === 'ACTIVE'));
      }

      setFilteredUsers(updatedUsers);
    };

    applyFilters();
  }, [users, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
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

  const toggleUserStatus = async (userId) => {
    // Logic to toggle user status
  };

  const deleteUser = async (userId) => {
    // Logic to delete user
  };

  const getUserStats = () => {
    // Logic to get user statistics
  };

  const stats = getUserStats();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users Management</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={resetFilters}>Reset Filters</button>
      {/* Render user list and management options */}
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.fullName} - {user.role}
            <button onClick={() => toggleUserStatus(user.id)}>Toggle Status</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersManagement;