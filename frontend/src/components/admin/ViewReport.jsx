/**
 * View candidate report component - shows detailed answers, scores, and feedback
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';

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
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!report) {
    return <div className="container">No report data available</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <h1>Candidate Report</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>{report.candidate_name}</h2>
        <p><strong>Email:</strong> {report.candidate_email}</p>
        <p><strong>Interview:</strong> {report.interview_title}</p>
        <p><strong>Progress:</strong> {report.completed_questions} / {report.total_questions} questions completed</p>
        {report.average_score !== null && (
          <p><strong>Average Score:</strong> {report.average_score.toFixed(1)}/10</p>
        )}
      </div>

      <h2>Answers</h2>

      {report.answers.length === 0 ? (
        <div className="card">
          <p>No answers submitted yet.</p>
        </div>
      ) : (
        <div>
          {report.answers.map((answer, index) => (
            <div key={answer.answer_id} className="card" style={{ marginBottom: '20px' }}>
              <h3>Question {index + 1}</h3>
              <p style={{ marginBottom: '15px', fontWeight: 'bold' }}>{answer.question_text}</p>
              
              {answer.transcript && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Answer:</strong>
                  <p style={{ marginTop: '5px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                    {answer.transcript}
                  </p>
                </div>
              )}

              {answer.score !== null && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Score:</strong> {answer.score}/10
                </div>
              )}

              {answer.feedback && (
                <div>
                  <strong>Feedback:</strong>
                  <p style={{ marginTop: '5px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px', whiteSpace: 'pre-line' }}>
                    {answer.feedback}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReport;

