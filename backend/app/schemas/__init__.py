"""
Pydantic schemas package
"""
from app.schemas.admin import AdminLoginRequest, AdminLoginResponse
from app.schemas.interview import InterviewCreate, InterviewResponse, InterviewListResponse
from app.schemas.question import QuestionCreate, QuestionResponse
from app.schemas.candidate import CandidateRegister, CandidateStart, CandidateResponse
from app.schemas.answer import AnswerSave, AnswerResponse, DashboardResponse, ReportResponse

__all__ = [
    "AdminLoginRequest",
    "AdminLoginResponse",
    "InterviewCreate",
    "InterviewResponse",
    "InterviewListResponse",
    "QuestionCreate",
    "QuestionResponse",
    "CandidateRegister",
    "CandidateStart",
    "CandidateResponse",
    "AnswerSave",
    "AnswerResponse",
    "DashboardResponse",
    "ReportResponse"
]

