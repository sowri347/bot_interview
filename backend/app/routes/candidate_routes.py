"""
Candidate API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes.dependencies import get_current_candidate
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateRegister, CandidateLoginResponse
from app.controllers.candidate_controller import (
    get_interview_by_link,
    register_candidate_for_interview,
    start_interview
)

router = APIRouter(prefix="/candidate", tags=["candidate"])


@router.post("/save-answer")
def save_answer_endpoint(
    question_id: str = Form(...),
    transcript: str = Form(...),
    score: int = Form(...),
    feedback: str = Form(...),
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Save candidate answer with transcript, score, and feedback
    Requires candidate authentication
    """
    from app.controllers.ai_controller import save_answer
    return save_answer(
        db,
        str(current_candidate.id),
        question_id,
        transcript,
        score,
        feedback
    )


@router.post("/register", response_model=CandidateLoginResponse)
def register(
    registration_data: CandidateRegister,
    db: Session = Depends(get_db)
):
    """
    Register a candidate for an interview
    Validates interview password and returns JWT token
    No authentication required (public registration)
    """
    return register_candidate_for_interview(db, registration_data)


@router.post("/start")
def start(
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Start interview - get questions for candidate
    Requires candidate authentication
    """
    return start_interview(db, str(current_candidate.id))

