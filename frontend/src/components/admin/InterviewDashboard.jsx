/**
 * Interview dashboard component - shows candidates and scores for a specific interview
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import Navbar from '../shared/Navbar';
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

  const handleDownloadExcel = async () => {
    try {
      const response = await api.get(`/admin/interview/${id}/download-excel`, {
        responseType: 'blob',
      });
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview_report_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to download Excel file');
    }
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
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container">
      <div className="mb-5">
        <button className="btn btn-secondary" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-white mb-2">{dashboard.interview_title}</h1>
            <p className="text-gray-400 text-sm">View candidate performance and statistics</p>
          </div>
          <button
            onClick={handleDownloadExcel}
            className="btn btn-primary"
          >
            Download Report (Excel)
          </button>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="text-white text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-dark-input rounded-none border border-dark-border">
            <p className="text-gray-400 text-sm font-medium mb-1">Total Candidates</p>
            <p className="text-white text-2xl font-bold">{dashboard.total_candidates}</p>
          </div>
          <div className="p-4 bg-dark-input rounded-none border border-dark-border">
            <p className="text-gray-400 text-sm font-medium mb-1">Total Questions</p>
            <p className="text-white text-2xl font-bold">{dashboard.total_questions}</p>
          </div>
        </div>
      </div>

      <h2 className="text-white text-xl font-semibold mb-4">Candidates</h2>

      {dashboard.candidates.length === 0 ? (
        <div className="card">
          <p>No candidates have taken this interview yet.</p>
        </div>
      ) : (
        <div>
          {[...dashboard.candidates]
            .sort((a, b) => {
              // Sort by average score (highest first)
              const scoreA = a.average_score ?? 0;
              const scoreB = b.average_score ?? 0;
              return scoreB - scoreA;
            })
            .map((candidate) => (
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
    </div>
  );
};

export default InterviewDashboard;

