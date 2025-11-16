"""
Candidate-related Pydantic schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CandidateRegister(BaseModel):
    """Candidate registration request schema"""
    name: str
    email: EmailStr
    link_code: str  # Removed interview_password field


class CandidateStart(BaseModel):
    """Candidate start interview request schema"""
    pass  # No additional data needed, candidate is identified by token


class CandidateResponse(BaseModel):
    """Candidate response schema"""
    id: str
    interview_id: str
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class CandidateLoginResponse(BaseModel):
    """Candidate login response schema"""
    access_token: str
    token_type: str = "bearer"
    candidate_id: str
    interview_id: str
    name: str

