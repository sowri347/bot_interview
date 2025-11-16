/**
 * View candidate report component - shows detailed answers, scores, and feedback
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import Navbar from '../shared/Navbar';

const ViewReport = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [candidateId]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/admin/report/${candidateId}`);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container text-white">Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!report) {
    return <div className="container text-white">No report data available</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container">
      <div className="mb-5">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-white mb-2">Candidate Report</h1>
        <p className="text-gray-400 text-sm">Detailed performance analysis</p>
      </div>

      <div className="card mb-8">
        <h2 className="text-white text-xl font-semibold mb-4">{report.candidate_name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Email</p>
            <p className="text-white">{report.candidate_email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Interview</p>
            <p className="text-white">{report.interview_title}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dark-border">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Progress</p>
            <p className="text-white font-semibold">{report.completed_questions} / {report.total_questions} questions</p>
          </div>
          {report.average_score !== null && (
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Average Score</p>
              <p className="text-accent-green text-2xl font-bold">{report.average_score.toFixed(1)}/10</p>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-white text-xl font-semibold mb-4">Answers</h2>

      {report.answers.length === 0 ? (
        <div className="card">
          <p>No answers submitted yet.</p>
        </div>
      ) : (
        <div>
          {report.answers.map((answer, index) => (
            <div key={answer.answer_id} className="card mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-none bg-accent-green/20 border border-accent-green/30 flex items-center justify-center">
                  <span className="text-accent-green font-bold">{index + 1}</span>
                </div>
                <h3 className="text-white text-lg font-semibold">Question {index + 1}</h3>
              </div>
              <p className="mb-6 font-semibold text-white leading-relaxed">{answer.question_text}</p>
              
              {answer.transcript && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Answer</p>
                  <div className="p-4 bg-dark-input-focus rounded-none text-white border border-dark-border">
                    <p className="leading-relaxed">{answer.transcript}</p>
                  </div>
                </div>
              )}

              {answer.score !== null && (
                <div className="mb-6">
                  <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Score</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card rounded-none border border-dark-border">
                    <span className="text-accent-green text-xl font-bold">{answer.score}</span>
                    <span className="text-gray-500">/10</span>
                  </div>
                </div>
              )}

              {answer.feedback && (
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Feedback</p>
                  <div className="p-4 bg-accent-green-dark/30 rounded-none whitespace-pre-line text-white border border-accent-green/30">
                    <p className="leading-relaxed">{answer.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ViewReport;

