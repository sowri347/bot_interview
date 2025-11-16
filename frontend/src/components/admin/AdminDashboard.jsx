/**
 * Admin dashboard component - lists all interviews
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import InterviewCard from './InterviewCard';
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
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={handleCreateInterview}>
          Create New Interview
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="mb-5 text-white">
        <strong>Total Interviews:</strong> {interviews.length}
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
  );
};

export default AdminDashboard;

