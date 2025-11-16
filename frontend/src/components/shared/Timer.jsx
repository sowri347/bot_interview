/**
 * Reusable countdown timer component
 */
import React from 'react';

const Timer = ({ timeRemaining, label = 'Time remaining' }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-2xl font-bold text-center p-5 rounded-lg my-5 text-white ${
      timeRemaining <= 10 
        ? 'bg-error-red-dark border border-error-red' 
        : 'bg-accent-green-dark border border-accent-green'
    }`}>
      <div className="text-white">{label}</div>
      <div className="text-5xl mt-2.5 text-white">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default Timer;

