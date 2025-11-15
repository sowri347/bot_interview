"""
CandidateAuth model for SQLAlchemy
"""
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


class CandidateAuth(Base):
    """Candidate authentication model"""
    __tablename__ = "candidate_auth"
    
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id", ondelete="CASCADE"), primary_key=True)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="candidate_auth")
    
    def __repr__(self):
        return f"<CandidateAuth(candidate_id={self.candidate_id}, interview_id={self.interview_id})>"

