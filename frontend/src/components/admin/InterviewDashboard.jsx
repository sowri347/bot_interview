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
    return <div className="container text-white">Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!dashboard) {
    return <div className="container text-white">No data available</div>;
  }

  return (
    <div className="container">
      <div className="mb-5">
        <button className="btn btn-secondary" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-white text-2xl font-bold">{dashboard.interview_title}</h1>

      <div className="card mb-5">
        <h3 className="text-white text-lg font-semibold mb-2">Statistics</h3>
        <p className="text-white mb-1"><strong>Total Candidates:</strong> {dashboard.total_candidates}</p>
        <p className="text-white"><strong>Total Questions:</strong> {dashboard.total_questions}</p>
      </div>

      <h2 className="text-white text-xl font-semibold mb-4">Candidates</h2>

      {dashboard.candidates.length === 0 ? (
        <div className="card">
          <p>No candidates have taken this interview yet.</p>
        </div>
      ) : (
        <div>
          {dashboard.candidates.map((candidate) => (
            <div key={candidate.candidate_id} className="card">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white text-lg font-semibold mb-1">{candidate.name}</h3>
                  <p className="text-white mb-1"><strong>Email:</strong> {candidate.email}</p>
                  <p className="text-white mb-1"><strong>Answers Submitted:</strong> {candidate.total_answers}</p>
                  {candidate.average_score !== null && (
                    <p className="text-white"><strong>Average Score:</strong> <span className="text-accent-green">{candidate.average_score.toFixed(1)}/10</span></p>
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

