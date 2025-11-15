/**
 * Interview dashboard component - shows candidates and scores for a specific interview
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import { ROUTES } from '../../utils/constants';

const InterviewDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const response = await api.get(`/admin/interview/${id}/dashboard`);
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (candidateId) => {
    navigate(`/admin/report/${candidateId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!dashboard) {
    return <div className="container">No data available</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
          ← Back to Dashboard
        </button>
      </div>

      <h1>{dashboard.interview_title}</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Statistics</h3>
        <p><strong>Total Candidates:</strong> {dashboard.total_candidates}</p>
        <p><strong>Total Questions:</strong> {dashboard.total_questions}</p>
      </div>

      <h2>Candidates</h2>

      {dashboard.candidates.length === 0 ? (
        <div className="card">
          <p>No candidates have taken this interview yet.</p>
        </div>
      ) : (
        <div>
          {dashboard.candidates.map((candidate) => (
            <div key={candidate.candidate_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{candidate.name}</h3>
                  <p><strong>Email:</strong> {candidate.email}</p>
                  <p><strong>Answers Submitted:</strong> {candidate.total_answers}</p>
                  {candidate.average_score !== null && (
                    <p><strong>Average Score:</strong> {candidate.average_score.toFixed(1)}/10</p>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewReport(candidate.candidate_id)}
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;

