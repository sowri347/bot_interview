/**
 * Admin login component
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import Navbar from '../shared/Navbar';
import { setAdminToken } from '../../utils/auth';
import { ROUTES } from '../../utils/constants';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/login', {
        email,
        password,
      });

      // Store token
      setAdminToken(response.data.access_token);
      
      // Redirect to dashboard
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4">
        <div className="card w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-white mb-2">Admin Login</h1>
          <p className="text-gray-400 text-sm">Sign in to manage interviews</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

