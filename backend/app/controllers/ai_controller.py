"""
AI controller for handling AI-related requests (transcription and evaluation)
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.answer import Answer
from app.models.candidate import Candidate
from app.models.question import Question
from app.services.ai_service import transcribe_audio, evaluate_text
import base64


def transcribe_audio_file(
    db: Session,
    candidate_id: str,
    audio_data: bytes
) -> dict:
    """
    Transcribe audio using Whisper API
    
    Args:
        db: Database session
        candidate_id: Candidate ID (from token)
        audio_data: Audio file bytes
    
    Returns:
        Dictionary with transcript
    
    Raises:
        HTTPException: If transcription fails
    """
    try:
        transcript = transcribe_audio(audio_data)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )


def evaluate_answer(
    db: Session,
    candidate_id: str,
    transcript: str,
    question_text: str = None
) -> dict:
    """
    Evaluate transcript using Gemini API
    
    Args:
        db: Database session
        candidate_id: Candidate ID (from token)
        transcript: Transcribed text
        question_text: The question text for context (optional)
    
    Returns:
        Dictionary with score and feedback
    
    Raises:
        HTTPException: If evaluation fails
    """
    try:
        score, feedback = evaluate_text(transcript, question_text)
        return {
            "score": score,
            "feedback": feedback
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evaluation failed: {str(e)}"
        )


def save_answer(
    db: Session,
    candidate_id: str,
    question_id: str,
    transcript: str,
    score: int,
    feedback: str
) -> dict:
    """
    Save candidate answer with transcript, score, and feedback
    
    Args:
        db: Database session
        candidate_id: Candidate ID
        question_id: Question ID
        transcript: Transcribed answer
        score: AI evaluation score (1-10)
        feedback: AI feedback
    
    Returns:
        Dictionary with saved answer details
    
    Raises:
        HTTPException: If save fails
    """
    # Verify candidate exists
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )
    
    # Verify question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if answer already exists (update) or create new
    existing_answer = db.query(Answer).filter(
        Answer.candidate_id == candidate_id,
        Answer.question_id == question_id
    ).first()
    
    if existing_answer:
        # Update existing answer
        existing_answer.transcript = transcript
        existing_answer.score = score
        existing_answer.feedback = feedback
        db.commit()
        db.refresh(existing_answer)
        answer = existing_answer
    else:
        # Create new answer
        answer = Answer(
            candidate_id=candidate_id,
            question_id=question_id,
            transcript=transcript,
            score=score,
            feedback=feedback
        )
        db.add(answer)
        db.commit()
        db.refresh(answer)
    
    return {
        "id": str(answer.id),
        "candidate_id": str(answer.candidate_id),
        "question_id": str(answer.question_id),
        "transcript": answer.transcript,
        "score": answer.score,
        "feedback": answer.feedback,
        "created_at": answer.created_at
    }

