/**
 * Admin signup component
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../hooks/useApi';
import { setAdminToken } from '../../utils/auth';
import { ROUTES } from '../../utils/constants';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/admin/signup', {
        email,
        password,
        confirm_password: confirmPassword,
      });

      // Store token
      setAdminToken(response.data.access_token);
      
      // Redirect to dashboard
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg relative">
      <div className="card w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black text-2xl font-bold">
              A
            </div>
            <h1 className="m-0 text-3xl text-white font-bold">AI INTERVIEW BOT</h1>
          </div>
          <p className="text-gray-300 text-sm uppercase tracking-wider">
            Create Admin Account
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
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
              placeholder="Enter your password (min 6 characters)"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-2" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-6 pt-6 border-t border-dark-border">
            <p className="text-gray-300 text-sm m-0">
              Already have an account?{' '}
              <Link 
                to={ROUTES.ADMIN_LOGIN}
                className="text-white underline font-semibold hover:text-gray-200 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;

