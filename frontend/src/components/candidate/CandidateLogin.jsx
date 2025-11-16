/**
 * Candidate login/registration component
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import { setCandidateToken } from '../../utils/auth';
import { ROUTES } from '../../utils/constants';

const CandidateLogin = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    fetchInterview();
  }, [linkId]);

  const fetchInterview = async () => {
    try {
      const response = await api.get(`/interview/${linkId}`);
      setInterview(response.data);
    } catch (err) {
      setError('Invalid interview link');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/candidate/register', {
        name,
        email,
        link_code: linkId,
      });

      // Store token
      setCandidateToken(response.data.access_token);
      
      // Redirect to interview
      navigate(`/candidate/interview/${linkId}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  if (!interview) {
    return (
      <div className="container">
        {error ? <div className="error">{error}</div> : <div className="text-white">Loading...</div>}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg px-4">
      <div className="card w-full max-w-lg animate-fade-in">
        <div className="mb-8">
          <h1 className="text-white mb-3">{interview.title}</h1>
          {interview.description && (
            <p className="text-gray-400 leading-relaxed">{interview.description}</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-white text-xl font-semibold mb-1">Register for Interview</h2>
          <p className="text-gray-400 text-sm">Fill in your details to get started</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          
          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateLogin;

