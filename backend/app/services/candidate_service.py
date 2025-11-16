"""
Candidate service for business logic related to candidates
"""
from sqlalchemy.orm import Session
from app.models.candidate import Candidate
from app.models.candidate_auth import CandidateAuth
from app.models.interview_link import InterviewLink
from app.models.interview import Interview
from app.services.auth_service import get_password_hash, verify_password
from app.services.interview_service import get_interview_by_link_code


def register_candidate(
    db: Session,
    name: str,
    email: str,
    link_code: str  # Removed interview_password parameter
) -> tuple[Candidate, Interview]:
    """
    Register a candidate for an interview
    
    Args:
        db: Database session
        name: Candidate name
        email: Candidate email
        link_code: Shareable link code
    
    Returns:
        Tuple of (Candidate, Interview)
    
    Raises:
        ValueError: If link code is invalid
    """
    # Get interview by link code
    interview = get_interview_by_link_code(db, link_code)
    if not interview:
        raise ValueError("Invalid interview link")
    
    # No password validation needed - just check if link exists
    from app.models.interview_link import InterviewLink
    interview_link = db.query(InterviewLink).filter(InterviewLink.link_code == link_code).first()
    if not interview_link:
        raise ValueError("Invalid interview link")
    
    # Create candidate
    candidate = Candidate(
        interview_id=interview.id,
        name=name,
        email=email
    )
    db.add(candidate)
    db.flush()
    
    # No candidate_auth needed if you're removing passwords entirely
    # Or keep it if candidates still need to login later with their own password
    
    db.commit()
    db.refresh(candidate)
    
    return candidate, interview


def verify_candidate_password(
    db: Session,
    candidate_id: str,
    password: str
) -> bool:
    """
    Verify candidate password
    
    Args:
        db: Database session
        candidate_id: Candidate ID
        password: Plain text password
    
    Returns:
        True if password is correct, False otherwise
    """
    candidate_auth = db.query(CandidateAuth).filter(
        CandidateAuth.candidate_id == candidate_id
    ).first()
    
    if not candidate_auth:
        return False
    
    return verify_password(password, candidate_auth.password_hash)


def get_candidate_by_id(db: Session, candidate_id: str) -> Candidate:
    """Get candidate by ID"""
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

