"""
Interview-related Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class InterviewCreate(BaseModel):
    """Create interview request schema"""
    title: str
    description: Optional[str] = None


class QuestionCreate(BaseModel):
    """Question creation schema (used in interview creation)"""
    question_text: str


class InterviewResponse(BaseModel):
    """Interview response schema"""
    id: str
    title: str
    description: Optional[str]
    created_at: datetime
    shareable_link: Optional[str] = None
    candidate_password: Optional[str] = None
    
    class Config:
        from_attributes = True


class InterviewListResponse(BaseModel):
    """List of interviews response schema"""
    interviews: List[InterviewResponse]
    total: int

