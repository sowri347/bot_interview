/**
 * Create interview component with dynamic question adder
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import Navbar from '../shared/Navbar';
import { ROUTES } from '../../utils/constants';

const CreateInterview = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create interview
      const interviewResponse = await api.post('/admin/create-interview', {
        title,
        description: description || null,
      });

      const interviewId = interviewResponse.data.id;

      // Add questions
      const validQuestions = questions.filter(q => q.trim() !== '');
      for (const questionText of validQuestions) {
        await api.post('/admin/add-question', null, {
          params: {
            interview_id: interviewId,
            question_text: questionText,
          },
        });
      }

      setSuccess('Interview created successfully!');
      
      // Show shareable link and password
      if (interviewResponse.data.shareable_link) {
        alert(
          `Interview created!\n\n` +
          `Shareable Link: ${interviewResponse.data.shareable_link}\n` +
          `Candidate Password: ${interviewResponse.data.candidate_password}\n\n` +
          `Please share these with candidates.`
        );
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.ADMIN_DASHBOARD);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container">
      <div className="mb-8">
        <h1 className="text-white mb-2">Create New Interview</h1>
        <p className="text-gray-400 text-sm">Set up a new interview with questions for candidates</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Interview Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <div className="flex justify-between items-center mb-2.5">
            <label>Questions *</label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddQuestion}
              disabled={loading}
            >
              Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="flex gap-2.5 mb-2.5">
              <input
                type="text"
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                required={index === 0}
                disabled={loading}
                className="flex-1"
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleRemoveQuestion(index)}
                  disabled={loading}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="flex gap-2.5">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Interview'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateInterview;

