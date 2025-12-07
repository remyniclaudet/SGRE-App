import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUserPlus } from 'react-icons/fa';

const AddUser = () => {
  const navigate = useNavigate();
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Simuler la création
    setTimeout(() => {
      setSuccess('Utilisateur créé avec succès !');
      setLoading(false);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="btn btn-outline flex items-center gap-2 mb-4"
        >
          <FaArrowLeft />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Ajouter un utilisateur</h1>
        <p className="text-gray-600 mt-2">
          Créez un nouveau compte utilisateur dans le système
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="email@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="••••••••"
              minLength="6"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 6 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="CLIENT">Client</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Compte actif (l'utilisateur peut se connecter)
          </label>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ <strong>Note importante :</strong> Pour cette démonstration, les mots de passe sont stockés en clair.
            Dans un environnement de production, utilisez toujours le hachage des mots de passe.
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            to="/admin/users"
            className="btn btn-outline"
            disabled={loading}
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? 'Création en cours...' : (
              <>
                <FaSave />
                Créer l'utilisateur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;