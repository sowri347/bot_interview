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


def create_interview_with_link(
    db: Session,
    title: str,
    description: str = None
) -> tuple[Interview, str]:  # Changed return type - no password
    """
    Create an interview and generate shareable link
    
    Args:
        db: Database session
        title: Interview title
        description: Interview description
    
    Returns:
        Tuple of (Interview, link_code)
    """
    # Create interview
    interview = Interview(title=title, description=description)
    db.add(interview)
    db.flush()  # Flush to get the interview ID
    
    # Generate link code only (no password)
    link_code = generate_link_code()
    
    # Create interview link without password
    interview_link = InterviewLink(
        interview_id=interview.id,
        link_code=link_code
    )
    db.add(interview_link)
    
    db.commit()
    db.refresh(interview)
    
    return interview, link_code  # Return only interview and link_code


def get_interview_by_link_code(db: Session, link_code: str) -> Interview:
    """Get interview by link code"""
    interview_link = db.query(InterviewLink).filter(InterviewLink.link_code == link_code).first()
    if not interview_link:
        return None
    return interview_link.interview


def get_interview_by_id(db: Session, interview_id: str) -> Interview:
    """Get interview by ID"""
    return db.query(Interview).filter(Interview.id == interview_id).first()

