"""
AI service for Whisper (speech-to-text) and Gemini (text evaluation)
"""
import base64
import io
import tempfile
import os
from typing import Tuple, Optional
from faster_whisper import WhisperModel
import google.generativeai as genai
from app.config import settings

# Initialize Whisper model (runs locally, no API key needed)
# Using "base" model - you can change to "tiny", "small", "medium", "large" for better accuracy
# "base" is a good balance between speed and accuracy
# Note: First run will download the model (~150MB), subsequent runs use cached model
whisper_model = WhisperModel("base", device="cpu", compute_type="int8")

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


def transcribe_audio(audio_data: bytes) -> str:
    """
    Transcribe audio using local Whisper model (free, no API needed)
    
    Args:
        audio_data: Audio file bytes (WAV, MP3, M4A, FLAC, etc.)
                   faster-whisper supports many formats via ffmpeg
    
    Returns:
        Transcribed text string
    
    Raises:
        Exception: If transcription fails
    """
    try:
        # Create a temporary file to store audio data
        # faster-whisper uses ffmpeg internally, so it can handle various formats
        # We'll use a generic temp file and let faster-whisper detect the format
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as temp_file:
            temp_file.write(audio_data)
            temp_file_path = temp_file.name
        
        try:
            # Transcribe using faster-whisper
            # faster-whisper automatically handles audio format conversion via ffmpeg
            segments, info = whisper_model.transcribe(
                temp_file_path,
                beam_size=5,
                language="en",  # Set to None for auto-detection of language
                vad_filter=True,  # Voice Activity Detection - filters out silence
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            
            # Combine all segments into a single transcript
            transcript_parts = []
            for segment in segments:
                transcript_parts.append(segment.text.strip())
            
            transcript = " ".join(transcript_parts).strip()
            
            # Return empty string if no transcription
            return transcript if transcript else ""
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except OSError:
                    pass  # Ignore errors during cleanup
                
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
        # Using gemini-1.5-flash (faster and free) or gemini-1.5-pro (better quality)
        # gemini-pro is deprecated, use gemini-1.5-flash or gemini-1.5-pro instead
        model = genai.GenerativeModel('gemini-1.5-flash')
        
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

