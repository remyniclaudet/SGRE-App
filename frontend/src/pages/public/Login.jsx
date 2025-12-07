import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Rediriger selon le rôle
        const role = result.user.role;
        navigate(`/${role}`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Comptes de test
  const testAccounts = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'manager@example.com', password: 'manager123', role: 'manager' },
    { email: 'client@example.com', password: 'client123', role: 'client' }
  ];

  const fillTestAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-center mb-8">Connexion</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <FaExclamationCircle className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 input-field"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 input-field"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Inscrivez-vous
            </Link>
          </p>
        </div>

        {/* Comptes de test */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Comptes de test</h3>
          <div className="space-y-3">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestAccount(account)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{account.role.charAt(0).toUpperCase() + account.role.slice(1)}</p>
                    <p className="text-sm text-gray-600">{account.email}</p>
                  </div>
                  <span className="text-primary-600 font-medium">Remplir</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;