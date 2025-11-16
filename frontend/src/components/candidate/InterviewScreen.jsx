/**
 * Interview screen component - manages question sequence and auto-progress
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import QuestionScreen from './QuestionScreen';
import { getCandidateToken, clearTokens } from '../../utils/auth';

const InterviewScreen = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

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
    if (interview && currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (interview && currentQuestionIndex === interview.questions.length - 1) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Clear candidate token to prevent further access
    clearTokens();
    setIsCompleted(true);
  };

  if (loading) {
    return <div className="container text-white">Loading interview...</div>;
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

  // Show thank you message when interview is completed
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4" style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div className="card max-w-2xl text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-accent-green rounded-none flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-white text-4xl font-bold mb-4">Thank You!</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-2">
              Your interview has been completed successfully.
            </p>
            <p className="text-gray-400 text-base">
              We appreciate your time and participation. Your responses have been recorded and will be reviewed.
            </p>
          </div>
          <div className="pt-6 border-t border-dark-border">
            <p className="text-gray-500 text-sm">
              You can now close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div>
      <QuestionScreen
        key={currentQuestion.id} // Force remount when question changes
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

