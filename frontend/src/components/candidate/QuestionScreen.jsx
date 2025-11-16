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
      <div className="text-center mb-8">
        <h2 className="text-white text-xl font-semibold">Question {questionNumber} of {totalQuestions}</h2>
      </div>

      <div className="card mb-5">
        <h3 className="mb-5 text-white text-lg font-medium">{question.question_text}</h3>
      </div>

      {stage === 'reading' && (
        <div>
          <Timer timeRemaining={readingTimer.timeRemaining} label="Reading Time" />
          <p className="text-center text-gray-300">
            Please read the question. Recording will start automatically.
          </p>
        </div>
      )}

      {stage === 'recording' && (
        <div>
          <Timer timeRemaining={recordingTime} label="Recording Time" />
          {isRecording && (
            <div className="text-center mt-5">
              <div className="w-12 h-12 rounded-full bg-white mx-auto animate-pulse"></div>
              <p className="mt-2.5 text-white">Recording in progress...</p>
            </div>
          )}
        </div>
      )}

      {stage === 'transcribing' && (
        <div className="text-center py-10">
          <p className="text-white">Transcribing your answer...</p>
        </div>
      )}

      {stage === 'evaluating' && (
        <div className="text-center py-10">
          <p className="text-white">Evaluating your answer...</p>
        </div>
      )}

      {stage === 'results' && (
        <div className="card">
          <h3 className="text-white text-lg font-semibold">Your Answer</h3>
          <p className="mt-2.5 p-2.5 bg-dark-input-focus rounded-lg text-white border border-dark-border">
            {transcript}
          </p>

          {score !== null && (
            <div className="mt-5">
              <h4 className="text-white font-semibold">Score: {score}/10</h4>
            </div>
          )}

          {feedback && (
            <div className="mt-5">
              <h4 className="text-white font-semibold">Feedback:</h4>
              <p className="p-2.5 bg-accent-green-dark rounded-lg whitespace-pre-line text-white border border-dark-border">
                {feedback}
              </p>
            </div>
          )}

          <p className="mt-5 text-center text-gray-300">
            Moving to next question...
          </p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default QuestionScreen;

