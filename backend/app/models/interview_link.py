"""
InterviewLink model for SQLAlchemy
"""
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


class InterviewLink(Base):
    """Interview link model for shareable links"""
    __tablename__ = "interview_links"
    
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id", ondelete="CASCADE"), primary_key=True)
    link_code = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interview = relationship("Interview", back_populates="interview_link")
    
    def __repr__(self):
        return f"<InterviewLink(interview_id={self.interview_id}, link_code={self.link_code})>"

