import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaSave, FaCog, FaBell, FaGlobe, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa';

const AdminSettings = () => {
  const [config, setConfig] = useState({
    site_name: '',
    site_logo: '',
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/config');
      setConfig(response.data.config);
    } catch (error) {
      console.error('Error fetching config:', error);
      showNotification('error', 'Erreur lors du chargement de la configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/config', config);
      showNotification('success', 'Configuration sauvegardée avec succès');
    } catch (error) {
      console.error('Error saving config:', error);
      showNotification('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Chargement de la configuration...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Paramètres du Système</h1>

      {notification.show && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <FaBell className="text-green-500" />
          ) : (
            <FaBell className="text-red-500" />
          )}
          <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {notification.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration du site */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center mb-6">
              <FaGlobe className="text-primary-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold">Configuration du site</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FaBuilding className="mr-2" />
                    Nom du site *
                  </div>
                </label>
                <input
                  type="text"
                  value={config.site_name || ''}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Nom de votre organisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={config.site_logo || ''}
                  onChange={(e) => handleChange('site_logo', e.target.value)}
                  className="input-field"
                  placeholder="/logo.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Chemin relatif ou URL complète vers votre logo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      Email de contact *
                    </div>
                  </label>
                  <input
                    type="email"
                    value={config.contact_email || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    required
                    className="input-field"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      Téléphone
                    </div>
                  </label>
                  <input
                    type="text"
                    value={config.contact_phone || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="input-field"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Panneau d'information */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <FaCog className="text-primary-600 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Informations système</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-medium">1.0.0</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="font-medium text-green-600">● En ligne</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Base de données</p>
                <p className="font-medium">MySQL connectée</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Dernière sauvegarde</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <FaBell className="text-primary-600 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications par email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications push</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Réservations en attente</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-700">Vider le cache</p>
                <p className="text-sm text-gray-600">Nettoyer les données temporaires</p>
              </button>
              
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg">
                <p className="font-medium text-green-700">Exporter les données</p>
                <p className="text-sm text-gray-600">Sauvegarde au format CSV</p>
              </button>
              
              <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg">
                <p className="font-medium text-yellow-700">Journal d'activité</p>
                <p className="text-sm text-gray-600">Voir les logs système</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;