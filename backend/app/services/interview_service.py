"""
Interview service for business logic related to interviews
"""
import uuid
import secrets
from sqlalchemy.orm import Session
from app.models.interview import Interview
from app.models.question import Question
from app.models.interview_link import InterviewLink
from app.services.email_service import send_interview_invitation


def generate_link_code() -> str:
    """Generate a unique URL-friendly link code"""
    # Generate a UUID and take first 12 characters, make it URL-friendly
    return secrets.token_urlsafe(12)


def generate_candidate_password() -> str:
    """Generate a random candidate password"""
    # Generate a 8-character alphanumeric password
    return secrets.token_urlsafe(8)[:8]


def create_interview_with_link(
    db: Session,
    title: str,
    description: str = None
) -> tuple[Interview, str, str]:
    """
    Create an interview and generate shareable link and candidate password
    
    Args:
        db: Database session
        title: Interview title
        description: Interview description
    
    Returns:
        Tuple of (Interview, link_code, candidate_password)
    """
    from app.services.auth_service import get_password_hash
    
    # Create interview
    interview = Interview(title=title, description=description)
    db.add(interview)
    db.flush()  # Flush to get the interview ID
    
    # Generate link code and candidate password
    link_code = generate_link_code()
    candidate_password = generate_candidate_password()
    
    # Hash the candidate password for storage
    password_hash = get_password_hash(candidate_password)
    
    # Create interview link with password hash
    interview_link = InterviewLink(
        interview_id=interview.id,
        link_code=link_code,
        candidate_password_hash=password_hash
    )
    db.add(interview_link)
    
    db.commit()
    db.refresh(interview)
    
    return interview, link_code, candidate_password


def get_interview_by_link_code(db: Session, link_code: str) -> Interview:
    """Get interview by link code"""
    interview_link = db.query(InterviewLink).filter(InterviewLink.link_code == link_code).first()
    if not interview_link:
        return None
    return interview_link.interview


def get_interview_by_id(db: Session, interview_id: str) -> Interview:
    """Get interview by ID"""
    return db.query(Interview).filter(Interview.id == interview_id).first()

