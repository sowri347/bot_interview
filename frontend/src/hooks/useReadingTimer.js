/**
 * Custom hook for 30-second reading timer
 */
import { useState, useEffect, useCallback } from 'react';

const READING_DURATION = 30; // 30 seconds

export const useReadingTimer = (onComplete) => {
  const [timeRemaining, setTimeRemaining] = useState(READING_DURATION);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && timeRemaining === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onComplete]);

  const start = useCallback(() => {
    setIsActive(true);
    setTimeRemaining(READING_DURATION);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(READING_DURATION);
  }, []);

  return {
    timeRemaining,
    isActive,
    start,
    stop,
    reset,
    isComplete: timeRemaining === 0 && !isActive,
  };
};

