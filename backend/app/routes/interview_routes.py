"""
Public interview routes (no authentication required)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.candidate_controller import get_interview_by_link

router = APIRouter(tags=["interview"])


@router.get("/interview/{link_code}")
def get_interview_by_link_code(
    link_code: str,
    db: Session = Depends(get_db)
):
    """
    Get interview details by link code (public endpoint)
    No authentication required
    """
    return get_interview_by_link(db, link_code)

