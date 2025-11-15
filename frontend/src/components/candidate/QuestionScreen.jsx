/**
 * Question screen component - displays question, handles reading timer, recording, and auto-progress
 */
import React, { useState, useEffect } from 'react';
import Timer from '../shared/Timer';
import { useReadingTimer } from '../../hooks/useReadingTimer';
import { useAutoRecorder } from '../../hooks/useAutoRecorder';
import api from '../../hooks/useApi';

const QuestionScreen = ({ question, questionNumber, totalQuestions, onNext, onComplete }) => {
  const [stage, setStage] = useState('reading'); // reading, recording, transcribing, evaluating, results
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Reading timer (30 seconds)
  const readingTimer = useReadingTimer(() => {
    // Auto-start recording when reading timer completes
    setStage('recording');
  });

  // Auto recorder (60 seconds) - starts when stage is 'recording'
  const { isRecording, audioBlob, timeRemaining: recordingTime, error: recordingError } = useAutoRecorder(stage === 'recording');

  // Start reading timer when component mounts
  useEffect(() => {
    readingTimer.start();
  }, []);

  // Handle recording completion
  useEffect(() => {
    if (audioBlob && stage === 'recording') {
      handleRecordingComplete();
    }
  }, [audioBlob]);

  // Handle recording errors
  useEffect(() => {
    if (recordingError) {
      setError(recordingError);
    }
  }, [recordingError]);

  const handleRecordingComplete = async () => {
    if (!audioBlob) return;

    setStage('transcribing');
    setError('');

    try {
      // Create FormData for audio file
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.wav');

      // Transcribe audio
      const transcriptResponse = await api.post('/ai/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const transcribedText = transcriptResponse.data.transcript;
      setTranscript(transcribedText);

      // Evaluate transcript
      setStage('evaluating');
      const evaluateFormData = new FormData();
      evaluateFormData.append('transcript', transcribedText);
      const evaluateResponse = await api.post('/ai/evaluate', evaluateFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const evaluationScore = evaluateResponse.data.score;
      const evaluationFeedback = evaluateResponse.data.feedback;
      setScore(evaluationScore);
      setFeedback(evaluationFeedback);

      // Save answer
      const saveFormData = new FormData();
      saveFormData.append('question_id', question.id);
      saveFormData.append('transcript', transcribedText);
      saveFormData.append('score', evaluationScore.toString());
      saveFormData.append('feedback', evaluationFeedback);
      await api.post('/candidate/save-answer', saveFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStage('results');

      // Auto-advance to next question after 3 seconds
      setTimeout(() => {
        if (questionNumber < totalQuestions) {
          onNext();
        } else {
          onComplete();
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process answer');
      setStage('recording');
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Question {questionNumber} of {totalQuestions}</h2>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>{question.question_text}</h3>
      </div>

      {stage === 'reading' && (
        <div>
          <Timer timeRemaining={readingTimer.timeRemaining} label="Reading Time" />
          <p style={{ textAlign: 'center', color: '#666' }}>
            Please read the question. Recording will start automatically.
          </p>
        </div>
      )}

      {stage === 'recording' && (
        <div>
          <Timer timeRemaining={recordingTime} label="Recording Time" />
          {isRecording && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#dc3545',
                margin: '0 auto',
                animation: 'pulse 1s infinite'
              }}></div>
              <p style={{ marginTop: '10px' }}>Recording in progress...</p>
            </div>
          )}
        </div>
      )}

      {stage === 'transcribing' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Transcribing your answer...</p>
        </div>
      )}

      {stage === 'evaluating' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Evaluating your answer...</p>
        </div>
      )}

      {stage === 'results' && (
        <div className="card">
          <h3>Your Answer</h3>
          <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            {transcript}
          </p>

          {score !== null && (
            <div style={{ marginTop: '20px' }}>
              <h4>Score: {score}/10</h4>
            </div>
          )}

          {feedback && (
            <div style={{ marginTop: '20px' }}>
              <h4>Feedback:</h4>
              <p style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px', whiteSpace: 'pre-line' }}>
                {feedback}
              </p>
            </div>
          )}

          <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
            Moving to next question...
          </p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default QuestionScreen;

