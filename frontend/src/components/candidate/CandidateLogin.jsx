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
        interview_password: password,
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
        {error ? <div className="error">{error}</div> : <div>Loading...</div>}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div className="card" style={{ width: '500px' }}>
        <h1 style={{ marginBottom: '10px' }}>{interview.title}</h1>
        {interview.description && (
          <p style={{ marginBottom: '20px', color: '#666' }}>{interview.description}</p>
        )}

        <h2 style={{ marginBottom: '20px' }}>Register for Interview</h2>
        
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

          <div className="form-group">
            <label>Interview Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter the password provided by the interviewer"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
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

