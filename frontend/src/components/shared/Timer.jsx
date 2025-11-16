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
    <div className={`text-center p-8 rounded-none my-6 text-white transition-all duration-300 border-2 ${
      timeRemaining <= 10 
        ? 'bg-error-red-dark/50 border-error-red/50 shadow-lg shadow-error-red/20' 
        : 'bg-accent-green-dark/50 border-accent-green/50 shadow-lg shadow-accent-green/20'
    }`}>
      <div className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-3">{label}</div>
      <div className="text-6xl md:text-7xl font-bold mt-2 text-white tabular-nums">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default Timer;

