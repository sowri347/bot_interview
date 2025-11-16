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
    <div className="card cursor-pointer hover:border-accent-green/50 transition-all duration-200 group" onClick={handleViewDashboard}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-accent-green transition-colors">{interview.title}</h3>
          {interview.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{interview.description}</p>
          )}
        </div>
      </div>
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

