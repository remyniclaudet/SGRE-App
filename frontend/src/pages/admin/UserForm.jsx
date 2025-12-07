import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as usersApi from '../../api/users';

const UserForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CLIENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await usersApi.fetchUser(id);
        const u = res.data || res;
        setForm({
          fullName: u.full_name || u.fullName || '',
          email: u.email || '',
          password: '',
          role: (u.role || 'CLIENT').toUpperCase(),
        });
      } catch (e) {
        console.error(e);
        setError('Impossible de charger l\'utilisateur.');
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        const payload = { fullName: form.fullName, email: form.email };
        if (form.password) payload.password = form.password;
        if (form.role) payload.role = form.role;
        await usersApi.updateUser(id, payload);
      } else {
        await usersApi.createUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role
        });
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Modifier' : 'Créer'} utilisateur</h2>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="label">Nom complet</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" />
        </div>

        <div>
          <label className="label">{isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="input" minLength={isEdit ? 0 : 8} />
        </div>

        <div>
          <label className="label">Rôle</label>
          <select name="role" value={form.role} onChange={handleChange} className="input">
            <option value="CLIENT">Client</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer')}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;