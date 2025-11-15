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
    <div style={{ 
      fontSize: '24px', 
      fontWeight: 'bold', 
      textAlign: 'center',
      padding: '20px',
      backgroundColor: timeRemaining <= 10 ? '#ffcccc' : '#e8f5e9',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <div>{label}</div>
      <div style={{ fontSize: '48px', marginTop: '10px' }}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default Timer;

