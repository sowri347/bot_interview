"""
Email service for simulating email sending (logs to console)
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def send_interview_invitation(
    candidate_email: str,
    candidate_name: str,
    interview_title: str,
    shareable_link: str,
    candidate_password: str
) -> None:
    """
    Simulate sending interview invitation email.
    In production, this would send an actual email.
    Currently logs to console.
    
    Args:
        candidate_email: Candidate's email address
        candidate_name: Candidate's name
        interview_title: Title of the interview
        shareable_link: Shareable link to access the interview
        candidate_password: Password for candidate to access interview
    """
    email_content = f"""
    ============================================
    INTERVIEW INVITATION EMAIL (SIMULATED)
    ============================================
    To: {candidate_email}
    Subject: Interview Invitation - {interview_title}
    
    Dear {candidate_name},
    
    You have been invited to participate in an interview: {interview_title}
    
    Please use the following link to access your interview:
    {shareable_link}
    
    Your interview password is: {candidate_password}
    
    Please keep this password secure and use it when registering for the interview.
    
    Best regards,
    AI Interview Bot
    ============================================
    """
    
    logger.info(email_content)
    print(email_content)

