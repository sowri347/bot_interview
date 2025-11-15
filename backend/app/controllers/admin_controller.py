"""
Admin controller for handling admin-related requests
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.admin import Admin
from app.models.interview import Interview
from app.models.candidate import Candidate
from app.models.answer import Answer
from app.models.question import Question
from app.schemas.admin import AdminLoginRequest, AdminLoginResponse
from app.schemas.interview import InterviewCreate, InterviewResponse, InterviewListResponse
from app.schemas.answer import DashboardResponse, ReportResponse, CandidateDetail, CandidateAnswerDetail
from app.services.auth_service import (
    verify_password,
    create_access_token,
    get_admin_by_email
)
from app.services.interview_service import create_interview_with_link
from app.services.email_service import send_interview_invitation
from typing import List
from datetime import datetime


def login_admin(db: Session, login_data: AdminLoginRequest) -> AdminLoginResponse:
    """
    Authenticate admin and return JWT token
    
    Args:
        db: Database session
        login_data: Login credentials
    
    Returns:
        AdminLoginResponse with JWT token
    
    Raises:
        HTTPException: If credentials are invalid
    """
    admin = get_admin_by_email(db, login_data.email)
    
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    token_data = {
        "sub": str(admin.id),
        "email": admin.email,
        "type": "admin"
    }
    access_token = create_access_token(data=token_data)
    
    return AdminLoginResponse(
        access_token=access_token,
        admin_id=str(admin.id),
        email=admin.email
    )


def create_interview(
    db: Session,
    interview_data: InterviewCreate,
    base_url: str = "http://localhost:5173"
) -> InterviewResponse:
    """
    Create a new interview with shareable link and candidate password
    
    Args:
        db: Database session
        interview_data: Interview creation data
        base_url: Base URL for generating shareable links
    
    Returns:
        InterviewResponse with shareable link and password
    """
    interview, link_code, candidate_password = create_interview_with_link(
        db=db,
        title=interview_data.title,
        description=interview_data.description
    )
    
    # Generate shareable link URL
    shareable_link = f"{base_url}/interview/{link_code}"
    
    # Simulate sending email (logs to console)
    # In production, this would send actual emails to candidates
    print(f"\n[EMAIL SIMULATION] Interview created:")
    print(f"  Link: {shareable_link}")
    print(f"  Password: {candidate_password}\n")
    
    return InterviewResponse(
        id=str(interview.id),
        title=interview.title,
        description=interview.description,
        created_at=interview.created_at,
        shareable_link=shareable_link,
        candidate_password=candidate_password
    )


def add_question_to_interview(
    db: Session,
    interview_id: str,
    question_text: str
) -> dict:
    """
    Add a question to an interview
    
    Args:
        db: Database session
        interview_id: Interview ID
        question_text: Question text
    
    Returns:
        Dictionary with question details
    
    Raises:
        HTTPException: If interview not found
    """
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    question = Question(
        interview_id=interview_id,
        question_text=question_text
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    
    return {
        "id": str(question.id),
        "interview_id": str(question.interview_id),
        "question_text": question.question_text,
        "created_at": question.created_at
    }


def get_all_interviews(db: Session) -> InterviewListResponse:
    """
    Get all interviews
    
    Args:
        db: Database session
    
    Returns:
        InterviewListResponse with list of interviews
    """
    interviews = db.query(Interview).all()
    
    interview_responses = []
    for interview in interviews:
        # Get shareable link if exists
        shareable_link = None
        if interview.interview_link:
            shareable_link = f"http://localhost:5173/interview/{interview.interview_link.link_code}"
        
        interview_responses.append(InterviewResponse(
            id=str(interview.id),
            title=interview.title,
            description=interview.description,
            created_at=interview.created_at,
            shareable_link=shareable_link
        ))
    
    return InterviewListResponse(
        interviews=interview_responses,
        total=len(interview_responses)
    )


def get_interview_dashboard(db: Session, interview_id: str) -> DashboardResponse:
    """
    Get dashboard data for a specific interview
    
    Args:
        db: Database session
        interview_id: Interview ID
    
    Returns:
        DashboardResponse with interview stats and candidate list
    
    Raises:
        HTTPException: If interview not found
    """
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    # Get all candidates for this interview
    candidates = db.query(Candidate).filter(Candidate.interview_id == interview_id).all()
    
    candidate_details = []
    for candidate in candidates:
        # Get answers for this candidate
        answers = db.query(Answer).filter(Answer.candidate_id == candidate.id).all()
        
        # Calculate average score
        scores = [a.score for a in answers if a.score is not None]
        average_score = sum(scores) / len(scores) if scores else None
        
        candidate_details.append(CandidateDetail(
            candidate_id=str(candidate.id),
            name=candidate.name,
            email=candidate.email,
            created_at=candidate.created_at,
            total_answers=len(answers),
            average_score=average_score
        ))
    
    # Get total questions
    total_questions = db.query(Question).filter(Question.interview_id == interview_id).count()
    
    return DashboardResponse(
        interview_id=str(interview.id),
        interview_title=interview.title,
        total_candidates=len(candidates),
        total_questions=total_questions,
        candidates=candidate_details
    )


def get_interview_candidates(db: Session, interview_id: str) -> List[dict]:
    """
    Get all candidates for an interview
    
    Args:
        db: Database session
        interview_id: Interview ID
    
    Returns:
        List of candidate dictionaries
    
    Raises:
        HTTPException: If interview not found
    """
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    candidates = db.query(Candidate).filter(Candidate.interview_id == interview_id).all()
    
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "email": c.email,
            "created_at": c.created_at
        }
        for c in candidates
    ]


def get_candidate_report(db: Session, candidate_id: str) -> ReportResponse:
    """
    Get detailed report for a candidate
    
    Args:
        db: Database session
        candidate_id: Candidate ID
    
    Returns:
        ReportResponse with candidate answers and scores
    
    Raises:
        HTTPException: If candidate not found
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    # Get interview
    interview = candidate.interview
    
    # Get all answers for this candidate
    answers = db.query(Answer).filter(Answer.candidate_id == candidate_id).all()
    
    answer_details = []
    for answer in answers:
        question = db.query(Question).filter(Question.id == answer.question_id).first()
        answer_details.append(CandidateAnswerDetail(
            answer_id=str(answer.id),
            question_text=question.question_text if question else "Unknown question",
            transcript=answer.transcript,
            score=answer.score,
            feedback=answer.feedback,
            created_at=answer.created_at
        ))
    
    # Calculate average score
    scores = [a.score for a in answers if a.score is not None]
    average_score = sum(scores) / len(scores) if scores else None
    
    # Get total questions in interview
    total_questions = db.query(Question).filter(Question.interview_id == candidate.interview_id).count()
    
    return ReportResponse(
        candidate_id=str(candidate.id),
        candidate_name=candidate.name,
        candidate_email=candidate.email,
        interview_id=str(candidate.interview_id),
        interview_title=interview.title,
        answers=answer_details,
        average_score=average_score,
        total_questions=total_questions,
        completed_questions=len(answers)
    )

