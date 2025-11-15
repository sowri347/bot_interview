"""
AI API routes for transcription and evaluation
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes.dependencies import get_current_candidate
from app.models.candidate import Candidate
from app.controllers.ai_controller import (
    transcribe_audio_file,
    evaluate_answer,
    save_answer
)

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/transcribe")
def transcribe(
    audio_file: UploadFile = File(...),
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Transcribe audio using Whisper API
    Requires candidate authentication
    """
    # Read audio file bytes
    audio_data = audio_file.file.read()
    return transcribe_audio_file(db, str(current_candidate.id), audio_data)


@router.post("/evaluate")
def evaluate(
    transcript: str = Form(...),
    current_candidate: Candidate = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """
    Evaluate transcript using Gemini API
    Returns score (1-10) and 2-line feedback
    Requires candidate authentication
    Accepts transcript as form data or query parameter
    """
    return evaluate_answer(db, str(current_candidate.id), transcript)



