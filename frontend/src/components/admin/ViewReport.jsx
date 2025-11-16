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
    return <div className="container text-white">Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!report) {
    return <div className="container text-white">No report data available</div>;
  }

  return (
    <div className="container">
      <div className="mb-5">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <h1 className="text-white text-2xl font-bold mb-4">Candidate Report</h1>

      <div className="card mb-5">
        <h2 className="text-white text-xl font-semibold mb-2">{report.candidate_name}</h2>
        <p className="text-white mb-1"><strong>Email:</strong> {report.candidate_email}</p>
        <p className="text-white mb-1"><strong>Interview:</strong> {report.interview_title}</p>
        <p className="text-white mb-1"><strong>Progress:</strong> {report.completed_questions} / {report.total_questions} questions completed</p>
        {report.average_score !== null && (
          <p className="text-white"><strong>Average Score:</strong> <span className="text-accent-green">{report.average_score.toFixed(1)}/10</span></p>
        )}
      </div>

      <h2 className="text-white text-xl font-semibold mb-4">Answers</h2>

      {report.answers.length === 0 ? (
        <div className="card">
          <p>No answers submitted yet.</p>
        </div>
      ) : (
        <div>
          {report.answers.map((answer, index) => (
            <div key={answer.answer_id} className="card mb-5">
              <h3 className="text-white text-lg font-semibold mb-2">Question {index + 1}</h3>
              <p className="mb-4 font-bold text-white">{answer.question_text}</p>
              
              {answer.transcript && (
                <div className="mb-4">
                  <strong className="text-white">Answer:</strong>
                  <p className="mt-1.5 p-2.5 bg-dark-input-focus rounded-lg text-white border border-dark-border">
                    {answer.transcript}
                  </p>
                </div>
              )}

              {answer.score !== null && (
                <div className="mb-4">
                  <strong className="text-white">Score:</strong> <span className="text-accent-green ml-1">{answer.score}/10</span>
                </div>
              )}

              {answer.feedback && (
                <div>
                  <strong className="text-white">Feedback:</strong>
                  <p className="mt-1.5 p-2.5 bg-accent-green-dark rounded-lg whitespace-pre-line text-white border border-dark-border">
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

