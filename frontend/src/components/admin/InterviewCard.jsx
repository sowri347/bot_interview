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
    <div className="card cursor-pointer hover:border-accent-green transition-colors" onClick={handleViewDashboard}>
      <h3 className="mb-2.5 text-white text-lg font-semibold">{interview.title}</h3>
      {interview.description && (
        <p className="text-gray-300 mb-2.5">{interview.description}</p>
      )}
      {interview.shareable_link && (
        <div className="mb-2.5">
          <strong className="text-white">Link:</strong>{' '}
          <a 
            href={interview.shareable_link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-accent-green hover:text-accent-green/80 underline"
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

