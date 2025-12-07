import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AddUser = () => {
  const navigate = useNavigate();
  const { addUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'CLIENT',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addUser(formData);
      setSuccess('Utilisateur ajouté avec succès');
      navigate('/admin/users');
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ajouter un Utilisateur</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Nom Complet</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <label>Rôle</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="CLIENT">Client</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>
        <div>
          <label>Actif</label>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={() => setFormData({ ...formData, isActive: !formData.isActive })} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Ajout en cours...' : 'Ajouter Utilisateur'}</button>
      </form>
    </div>
  );
};

export default AddUser;