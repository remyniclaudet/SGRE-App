import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaSave, FaBell, FaKey, FaHistory } from 'react-icons/fa';

const ClientProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reservationUpdates: true,
    eventReminders: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const result = await updateProfile(formData);
      if (result.success) {
        alert('Profil mis à jour avec succès');
      } else {
        alert(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try {
      setSaving(true);
      // Note: Dans une application réelle, vous auriez une API pour changer le mot de passe
      alert('Fonctionnalité de changement de mot de passe à implémenter');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Erreur lors du changement de mot de passe');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSettingsChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      {/* Onglets */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaUser />
              <span>Informations personnelles</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaBell />
              <span>Notifications</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaKey />
              <span>Sécurité</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaHistory />
              <span>Activité récente</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-4xl mx-auto">
        {/* Onglet Informations personnelles */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaUser className="text-primary-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      Nom complet *
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      Adresse email *
                    </div>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Informations du compte</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date d'inscription</p>
                    <p className="font-medium">
                      {user?.created_at ? formatDate(user.created_at) : 'Non disponible'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rôle</p>
                    <p className="font-medium">{user?.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Onglet Notifications */}
        {activeTab === 'notifications' && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaBell className="text-primary-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Paramètres de notification</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationSettingsChange('emailNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Notifications push</p>
                    <p className="text-sm text-gray-600">Recevoir des notifications dans le navigateur</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationSettingsChange('pushNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Mises à jour des réservations</p>
                    <p className="text-sm text-gray-600">Être informé des changements de statut</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.reservationUpdates}
                      onChange={() => handleNotificationSettingsChange('reservationUpdates')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Historique des notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Tout marquer comme lu
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-xl">Chargement des notifications...</div>
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        notification.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">Aucune notification</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'password' && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaKey className="text-primary-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold">Sécurité du compte</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Pour des raisons de sécurité, veuillez suivre ces recommandations :
                </p>
                <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                  <li>Utilisez un mot de passe d'au moins 6 caractères</li>
                  <li>Combinez lettres, chiffres et caractères spéciaux</li>
                  <li>N'utilisez pas le même mot de passe sur plusieurs sites</li>
                </ul>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{saving ? 'Changement...' : 'Changer le mot de passe'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Onglet Activité récente */}
        {activeTab === 'history' && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FaHistory className="text-primary-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold">Activité récente</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Dernières connexions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Connexion réussie</p>
                      <p className="text-sm text-gray-600">Depuis votre navigateur habituel</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Connexion réussie</p>
                      <p className="text-sm text-gray-600">Depuis votre navigateur habituel</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(Date.now() - 86400000))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Statistiques du compte</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {reservations?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Réservations</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {reservations?.filter(r => r.status === 'confirmed').length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Confirmées</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {reservations?.filter(r => r.status === 'pending').length || 0}
                    </p>
                    <p className="text-sm text-gray-600">En attente</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {notifications.filter(n => !n.is_read).length}
                    </p>
                    <p className="text-sm text-gray-600">Notifications non lues</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Compte créé le : {user?.created_at ? formatDate(user.created_at) : 'Non disponible'}
                  </p>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Télécharger mes données
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;