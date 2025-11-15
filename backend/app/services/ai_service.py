"""
AI service for Whisper (speech-to-text) and Gemini (text evaluation)
"""
import base64
import io
from typing import Tuple, Optional
from openai import OpenAI
import google.generativeai as genai
from app.config import settings

# Initialize OpenAI client for Whisper
openai_client = OpenAI(api_key=settings.WHISPER_API_KEY)

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


def transcribe_audio(audio_data: bytes) -> str:
    """
    Transcribe audio using Whisper API
    
    Args:
        audio_data: Audio file bytes (WAV, MP3, etc.)
    
    Returns:
        Transcribed text string
    
    Raises:
        Exception: If transcription fails
    """
    try:
        # Create a file-like object from bytes
        audio_file = io.BytesIO(audio_data)
        audio_file.name = "audio.wav"  # Whisper needs a filename
        
        # Call Whisper API
        transcript = openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )
        
        return transcript if isinstance(transcript, str) else str(transcript)
    except Exception as e:
        raise Exception(f"Whisper transcription failed: {str(e)}")


def evaluate_text(transcript: str) -> Tuple[int, str]:
    """
    Evaluate transcript using Gemini API and return score (1-10) and 2-line feedback
    
    Args:
        transcript: The transcribed text to evaluate
    
    Returns:
        Tuple of (score: int, feedback: str)
        - score: Integer from 1 to 10
        - feedback: Two-line feedback string
    
    Raises:
        Exception: If evaluation fails
    """
    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-pro')
        
        # Create evaluation prompt
        prompt = f"""Evaluate the following interview answer and provide:
1. A score from 1 to 10 (where 10 is excellent)
2. Two lines of constructive feedback

Answer to evaluate:
"{transcript}"

Please respond in this exact format:
SCORE: [number from 1-10]
FEEDBACK: [two lines of feedback, each on a new line]"""
        
        # Generate response
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Parse response
        score = 5  # Default score
        feedback = "No specific feedback available."
        
        # Extract score
        if "SCORE:" in response_text:
            score_line = [line for line in response_text.split("\n") if "SCORE:" in line.upper()][0]
            try:
                score = int(score_line.split(":")[-1].strip())
                # Ensure score is between 1 and 10
                score = max(1, min(10, score))
            except (ValueError, IndexError):
                pass
        
        # Extract feedback
        if "FEEDBACK:" in response_text:
            feedback_lines = response_text.split("FEEDBACK:")[-1].strip().split("\n")
            feedback = "\n".join(feedback_lines[:2])  # Take first 2 lines
            if not feedback.strip():
                feedback = "No specific feedback available."
        else:
            # Try to extract feedback from response
            lines = response_text.split("\n")
            feedback_lines = [line.strip() for line in lines if line.strip() and "SCORE:" not in line.upper()]
            if feedback_lines:
                feedback = "\n".join(feedback_lines[:2])
        
        return score, feedback
        
    except Exception as e:
        # Return default values on error
        return 5, f"Evaluation error: {str(e)}"

