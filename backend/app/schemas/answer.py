"""
Answer-related Pydantic schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AnswerSave(BaseModel):
    """Save answer request schema"""
    question_id: str
    audio_data: Optional[str] = None  # Base64 encoded audio or blob URL
    transcript: Optional[str] = None  # If transcript is provided directly


class AnswerResponse(BaseModel):
    """Answer response schema"""
    id: str
    candidate_id: str
    question_id: str
    transcript: Optional[str]
    score: Optional[int]
    feedback: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class CandidateAnswerDetail(BaseModel):
    """Detailed candidate answer for reports"""
    answer_id: str
    question_text: str
    transcript: Optional[str]
    score: Optional[int]
    feedback: Optional[str]
    created_at: datetime


class CandidateDetail(BaseModel):
    """Candidate detail for dashboard"""
    candidate_id: str
    name: str
    email: str
    created_at: datetime
    total_answers: int
    average_score: Optional[float]


class DashboardResponse(BaseModel):
    """Interview dashboard response schema"""
    interview_id: str
    interview_title: str
    total_candidates: int
    total_questions: int
    candidates: List[CandidateDetail]


class ReportResponse(BaseModel):
    """Candidate report response schema"""
    candidate_id: str
    candidate_name: str
    candidate_email: str
    interview_id: str
    interview_title: str
    answers: List[CandidateAnswerDetail]
    average_score: Optional[float]
    total_questions: int
    completed_questions: int

