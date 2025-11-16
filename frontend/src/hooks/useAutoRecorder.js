/**
 * Custom hook for automatic audio recording (60 seconds)
 * Auto-starts microphone on mount and stops after 60 seconds
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const RECORDING_DURATION = 60; // 60 seconds

export const useAutoRecorder = (autoStart = true) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(RECORDING_DURATION);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const isRecordingRef = useRef(false); // Add ref to track recording state

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []); // Remove isRecording from dependencies

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
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
        isRecordingRef.current = false;
        setIsRecording(false);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      // Start recording
      mediaRecorder.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      setTimeRemaining(RECORDING_DURATION);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording(); // Now this will work correctly
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
      console.error('Recording error:', err);
    }
  }, [stopRecording]); // Add stopRecording as dependency

  // Auto-start on mount if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && isRecordingRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [autoStart, startRecording]); // Add startRecording as dependency

  return {
    isRecording,
    audioBlob,
    error,
    timeRemaining,
    startRecording,
    stopRecording,
  };
};

