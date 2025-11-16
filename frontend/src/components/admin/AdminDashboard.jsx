/**
 * Admin dashboard component - lists all interviews
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import InterviewCard from './InterviewCard';
import Navbar from '../shared/Navbar';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/admin/interviews');
      setInterviews(response.data.interviews || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInterview = () => {
    navigate('/admin/create-interview');
  };

  if (loading) {
    return <div className="container text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage your interviews and candidates</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateInterview}>
          + Create New Interview
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card rounded-none border border-dark-border">
          <span className="text-gray-400 text-sm font-medium">Total Interviews:</span>
          <span className="text-white font-bold text-lg">{interviews.length}</span>
        </div>
      </div>

      {interviews.length === 0 ? (
        <div className="card">
          <p>No interviews yet. Create your first interview to get started.</p>
        </div>
      ) : (
        <div>
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;

