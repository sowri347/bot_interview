/**
 * Interview card component for displaying interview in list
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const InterviewCard = ({ interview }) => {
  const navigate = useNavigate();

  const handleViewDashboard = () => {
    navigate(`/admin/interview/${interview.id}`);
  };

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={handleViewDashboard}>
      <h3 style={{ marginBottom: '10px' }}>{interview.title}</h3>
      {interview.description && (
        <p style={{ color: '#666', marginBottom: '10px' }}>{interview.description}</p>
      )}
      {interview.shareable_link && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Link:</strong>{' '}
          <a 
            href={interview.shareable_link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {interview.shareable_link}
          </a>
        </div>
      )}
      <button 
        className="btn btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          handleViewDashboard();
        }}
      >
        View Dashboard
      </button>
    </div>
  );
};

export default InterviewCard;

