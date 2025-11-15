"""
Question-related Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QuestionCreate(BaseModel):
    """Create question request schema"""
    interview_id: str
    question_text: str


class QuestionResponse(BaseModel):
    """Question response schema"""
    id: str
    interview_id: str
    question_text: str
    created_at: datetime
    
    class Config:
        from_attributes = True

