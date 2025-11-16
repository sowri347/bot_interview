/**
 * Interview screen component - manages question sequence and auto-progress
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import QuestionScreen from './QuestionScreen';
import { getCandidateToken } from '../../utils/auth'; // Add import

const InterviewScreen = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterview();
  }, [linkId]);

  const fetchInterview = async () => {
    // Debug: Check if token exists
    const token = getCandidateToken();
    console.log('Token in InterviewScreen:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
    
    try {
      const response = await api.post('/candidate/start');
      setInterview(response.data);
    } catch (err) {
      console.error('Error fetching interview:', err);
      console.error('Error response:', err.response?.data);
      if (err.response?.status === 401) {
        // Token expired or invalid - redirect back to registration
        setError('Session expired. Please register again.');
        // Redirect to registration page after a short delay
        setTimeout(() => {
          navigate(`/interview/${linkId}`);
        }, 2000);
      } else {
        setError(err.response?.data?.detail || 'Failed to load interview');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = () => {
    alert('Interview completed! Thank you for your participation.');
    navigate('/');
  };

  if (loading) {
    return <div className="container">Loading interview...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!interview || interview.questions.length === 0) {
    return (
      <div className="container">
        <div className="error">No questions available for this interview.</div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div>
      <QuestionScreen
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={interview.questions.length}
        onNext={handleNext}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default InterviewScreen;

