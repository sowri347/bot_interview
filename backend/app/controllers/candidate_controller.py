"""
Candidate controller for handling candidate-related requests
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.candidate import Candidate
from app.models.interview import Interview
from app.models.question import Question
from app.models.interview_link import InterviewLink
from app.schemas.candidate import CandidateRegister, CandidateLoginResponse
from app.services.candidate_service import (
    register_candidate,
    verify_candidate_password,
    get_candidate_by_id
)
from app.services.auth_service import create_access_token


def get_interview_by_link(db: Session, link_code: str) -> dict:
    """
    Get interview details by link code (public endpoint)
    
    Args:
        db: Database session
        link_code: Shareable link code
    
    Returns:
        Dictionary with interview and questions
    
    Raises:
        HTTPException: If link code is invalid
    """
    interview_link = db.query(InterviewLink).filter(InterviewLink.link_code == link_code).first()
    
    if not interview_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid interview link"
        )
    
    interview = interview_link.interview
    questions = db.query(Question).filter(Question.interview_id == interview.id).order_by(Question.created_at).all()
    
    return {
        "interview_id": str(interview.id),
        "title": interview.title,
        "description": interview.description,
        "questions": [
            {
                "id": str(q.id),
                "question_text": q.question_text
            }
            for q in questions
        ]
    }


def register_candidate_for_interview(
    db: Session,
    registration_data: CandidateRegister
) -> CandidateLoginResponse:
    """
    Register a candidate for an interview
    
    Args:
        db: Database session
        registration_data: Candidate registration data
    
    Returns:
        CandidateLoginResponse with JWT token
    
    Raises:
        HTTPException: If registration fails
    """
    try:
        candidate, interview = register_candidate(
            db=db,
            name=registration_data.name,
            email=registration_data.email,
            link_code=registration_data.link_code
        )
        
        # Create JWT token for candidate
        token_data = {
            "sub": str(candidate.id),
            "email": candidate.email,
            "type": "candidate",
            "interview_id": str(candidate.interview_id)
        }
        access_token = create_access_token(data=token_data)
        
        return CandidateLoginResponse(
            access_token=access_token,
            candidate_id=str(candidate.id),
            interview_id=str(candidate.interview_id),
            name=candidate.name
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


def start_interview(db: Session, candidate_id: str) -> dict:
    """
    Get interview questions for candidate to start interview
    
    Args:
        db: Database session
        candidate_id: Candidate ID (from token)
    
    Returns:
        Dictionary with interview and questions
    
    Raises:
        HTTPException: If candidate not found
    """
    candidate = get_candidate_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    interview = candidate.interview
    questions = db.query(Question).filter(Question.interview_id == interview.id).order_by(Question.created_at).all()
    
    return {
        "interview_id": str(interview.id),
        "title": interview.title,
        "description": interview.description,
        "questions": [
            {
                "id": str(q.id),
                "question_text": q.question_text
            }
            for q in questions
        ]
    }

