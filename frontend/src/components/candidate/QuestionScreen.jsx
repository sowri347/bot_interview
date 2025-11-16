/**
 * Question screen component - displays question, handles reading timer, recording, and manual controls
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Timer from '../shared/Timer';
import { useReadingTimer } from '../../hooks/useReadingTimer';
import api from '../../hooks/useApi';

const QuestionScreen = ({ question, questionNumber, totalQuestions, onNext, onComplete }) => {
  const [stage, setStage] = useState('reading'); // reading, recording, transcribing, evaluating, results
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(60);
  const [recordingError, setRecordingError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const hasPronouncedRef = useRef(false);
  const currentQuestionIdRef = useRef(null);

  // Reading timer (30 seconds) - but don't auto-start recording
  const readingTimer = useReadingTimer(() => {
    // Reading timer completes, but don't auto-start recording
    // User must click "Start Record" button
  });

  // Pronounce question using Web Speech API
  const pronounceQuestion = useCallback((text, force = false) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Function to set voice and speak
      const speakWithVoice = () => {
        // Remove the event listener to prevent multiple calls
        window.speechSynthesis.onvoiceschanged = null;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Try to use a good voice
          const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Samantha'))
          ) || voices.find(voice => voice.lang.includes('en'));
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
        
        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };
      
      // If voices are already loaded, speak immediately
      if (window.speechSynthesis.getVoices().length > 0) {
        speakWithVoice();
      } else {
        // Wait for voices to load (only set once)
        if (!window.speechSynthesis._voiceHandlerSet) {
          window.speechSynthesis.onvoiceschanged = speakWithVoice;
          window.speechSynthesis._voiceHandlerSet = true;
        }
      }
    }
  }, []);

  // Start reading timer and pronounce question when component mounts or question changes
  useEffect(() => {
    // Reset pronunciation flag when question changes
    if (currentQuestionIdRef.current !== question.id) {
      hasPronouncedRef.current = false;
      currentQuestionIdRef.current = question.id;
    }
    
    // Always reset and start timer when question is displayed
    readingTimer.reset();
    readingTimer.start();
    
    // Only pronounce if not already pronounced for this question
    if (!hasPronouncedRef.current) {
      // Small delay to ensure voices are loaded
      const timer = setTimeout(() => {
        pronounceQuestion(question.question_text);
        hasPronouncedRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setRecordingError(null);
      setError('');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setIsRecording(false);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setStage('recording');
      setRecordingTime(60);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setRecordingError(`Failed to start recording: ${err.message}`);
      setError(`Failed to start recording: ${err.message}`);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError('No recording available. Please record your answer first.');
      return;
    }

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

      if (!transcribedText || transcribedText.trim() === '') {
        setError('No speech detected in recording. Please try again.');
        setStage('recording');
        setAudioBlob(null);
        return;
      }

      // Evaluate transcript with question text
      setStage('evaluating');
      const evaluateFormData = new FormData();
      evaluateFormData.append('transcript', transcribedText);
      evaluateFormData.append('question_text', question.question_text);
      
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

      // Immediately move to next question
      if (questionNumber < totalQuestions) {
        onNext();
      } else {
        onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process answer');
      setStage('recording');
      setAudioBlob(null);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card rounded-none border border-dark-border mb-3">
          <span className="text-gray-400 text-sm font-medium">Question</span>
          <span className="text-white font-bold">{questionNumber}</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{totalQuestions}</span>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-white text-xl font-semibold leading-relaxed flex-1">{question.question_text}</h3>
          <button
            onClick={() => pronounceQuestion(question.question_text, true)}
            className="btn btn-secondary flex-shrink-0"
            title="Replay question"
          >
            🔊 Play
          </button>
        </div>
      </div>

      {stage === 'reading' && (
        <div>
          <Timer timeRemaining={readingTimer.timeRemaining} label="Reading Time" />
          <div className="text-center mt-8">
            <p className="text-gray-300 mb-6">
              The question is being read aloud. Click "Start Record" when you're ready to answer.
            </p>
            <button
              onClick={startRecording}
              className="btn btn-primary"
            >
              Start Record
            </button>
          </div>
        </div>
      )}

      {stage === 'recording' && (
        <div>
          <Timer timeRemaining={recordingTime} label="Recording Time" />
          {isRecording && (
            <div className="text-center mt-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-error-red/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-error-red animate-pulse"></div>
              </div>
              <p className="text-white font-medium">Recording in progress...</p>
              <p className="text-gray-400 text-sm mt-1">Speak clearly into your microphone</p>
              <div className="mt-6">
                <button
                  onClick={stopRecording}
                  className="btn btn-secondary"
                >
                  Stop Recording
                </button>
              </div>
            </div>
          )}
          {!isRecording && audioBlob && (
            <div className="text-center mt-8">
              <p className="text-white font-medium mb-4">Recording completed</p>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Submit and Move to Next Question
              </button>
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
          <p className="text-white">Evaluating your answer with AI...</p>
        </div>
      )}

      {stage === 'results' && (
        <div className="text-center py-10">
          <p className="text-white">Processing your answer...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {recordingError && <div className="error">{recordingError}</div>}
    </div>
  );
};

export default QuestionScreen;
