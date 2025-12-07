import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  getResourceUsage, 
  getEventStatistics, 
  getUserActivity,
  getAuditLogs,
  getManagerReservations,
  getManagerEvents
} from '../api/reports';
import { 
  FaChartBar, 
  FaUsers, 
  FaCalendarAlt, 
  FaBuilding,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  // Données des rapports
  const [resourceUsage, setResourceUsage] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [managerReservations, setManagerReservations] = useState([]);
  const [managerEvents, setManagerEvents] = useState([]);

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';

  useEffect(() => {
    fetchReportData();
  }, [activeReport, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      const requests = [];

      if (activeReport === 'overview' && isAdmin) {
        requests.push(
          getResourceUsage(dateRange.start_date, dateRange.end_date),
          getEventStatistics(dateRange.start_date, dateRange.end_date),
          getUserActivity(dateRange.start_date, dateRange.end_date)
        );
      } else if (activeReport === 'resources' && isAdmin) {
        requests.push(getResourceUsage(dateRange.start_date, dateRange.end_date));
      } else if (activeReport === 'events' && isAdmin) {
        requests.push(getEventStatistics(dateRange.start_date, dateRange.end_date));
      } else if (activeReport === 'users' && isAdmin) {
        requests.push(getUserActivity(dateRange.start_date, dateRange.end_date));
      } else if (activeReport === 'audit' && isAdmin) {
        requests.push(getAuditLogs(dateRange));
      } else if (activeReport === 'manager-reservations' && (isManager || isAdmin)) {
        requests.push(getManagerReservations(dateRange));
      } else if (activeReport === 'manager-events' && (isManager || isAdmin)) {
        requests.push(getManagerEvents(dateRange));
      }

      const responses = await Promise.all(requests);

      // Mettre à jour les états selon le rapport actif
      if (activeReport === 'overview' && isAdmin) {
        setResourceUsage(responses[0]?.stats || []);
        setEventStats(responses[1]?.stats || []);
        setUserActivity(responses[2]?.activity || []);
      } else if (activeReport === 'resources' && isAdmin) {
        setResourceUsage(responses[0]?.stats || []);
      } else if (activeReport === 'events' && isAdmin) {
        setEventStats(responses[0]?.stats || []);
      } else if (activeReport === 'users' && isAdmin) {
        setUserActivity(responses[0]?.activity || []);
      } else if (activeReport === 'audit' && isAdmin) {
        setAuditLogs(responses[0]?.logs || []);
      } else if (activeReport === 'manager-reservations' && (isManager || isAdmin)) {
        setManagerReservations(responses[0]?.reservations || []);
      } else if (activeReport === 'manager-events' && (isManager || isAdmin)) {
        setManagerEvents(responses[0]?.events || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (key, value) => {
    setDateRange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    // Fonction d'export simple
    console.log('Export CSV à implémenter');
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement du rapport...</div>
        </div>
      );
    }

    switch (activeReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Utilisation des ressources</h3>
                <div className="space-y-3">
                  {resourceUsage.slice(0, 5).map(resource => (
                    <div key={resource.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{resource.name}</span>
                      <span className="font-semibold">{resource.reservation_count} réservations</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Statistiques événements</h3>
                <div className="space-y-3">
                  {eventStats.map(stat => (
                    <div key={stat.status} className="flex justify-between items-center">
                      <span className="text-gray-700">{stat.status}</span>
                      <span className="font-semibold">{stat.event_count} événements</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Activité utilisateurs</h3>
                <div className="space-y-3">
                  {userActivity.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{activity.full_name}</span>
                      <span className="font-semibold">{activity.reservation_count} rés.</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ressource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heures totales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière réservation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resourceUsage.map(resource => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{resource.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-info">{resource.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.reservation_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.total_hours || 0}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.last_reservation ? formatDate(resource.last_reservation) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'audit':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Objet
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                        <div className="text-sm text-gray-500">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-info">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.object_type} #{log.object_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FaChartBar className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rapport non disponible</h3>
            <p className="text-gray-500">
              Ce rapport n'est pas accessible avec votre rôle
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Analytics</h1>
          <p className="text-gray-600 mt-2">
            Analysez les données et l'activité du système
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn btn-outline flex items-center gap-2"
        >
          <FaDownload />
          Exporter
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="font-medium">Période :</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              className="input"
            />
            <span className="self-center">au</span>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              className="input"
            />
            <button
              onClick={() => setDateRange({ start_date: '', end_date: '' })}
              className="btn btn-outline"
            >
              Toutes périodes
            </button>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex flex-wrap gap-2">
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveReport('overview')}
              className={`btn ${activeReport === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaChartBar className="mr-2" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveReport('resources')}
              className={`btn ${activeReport === 'resources' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaBuilding className="mr-2" />
              Ressources
            </button>
            <button
              onClick={() => setActiveReport('events')}
              className={`btn ${activeReport === 'events' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaCalendarAlt className="mr-2" />
              Événements
            </button>
            <button
              onClick={() => setActiveReport('users')}
              className={`btn ${activeReport === 'users' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaUsers className="mr-2" />
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveReport('audit')}
              className={`btn ${activeReport === 'audit' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaChartBar className="mr-2" />
              Logs d'audit
            </button>
          </>
        )}
        
        {(isManager || isAdmin) && (
          <>
            <button
              onClick={() => setActiveReport('manager-reservations')}
              className={`btn ${activeReport === 'manager-reservations' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaCalendarAlt className="mr-2" />
              Réservations Manager
            </button>
            <button
              onClick={() => setActiveReport('manager-events')}
              className={`btn ${activeReport === 'manager-events' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaBuilding className="mr-2" />
              Événements Manager
            </button>
          </>
        )}
      </div>

      {/* Report Content */}
      <div className="card p-6">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;