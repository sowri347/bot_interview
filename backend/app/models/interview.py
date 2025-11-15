"""
Interview model for SQLAlchemy
"""
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base


class Interview(Base):
    """Interview model"""
    __tablename__ = "interviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="interview", cascade="all, delete-orphan")
    interview_link = relationship("InterviewLink", back_populates="interview", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Interview(id={self.id}, title={self.title})>"

