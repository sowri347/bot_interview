"""
Admin API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.routes.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.admin import AdminSignupRequest, AdminLoginRequest, AdminLoginResponse
from app.schemas.interview import InterviewCreate, InterviewResponse, InterviewListResponse
from app.schemas.answer import DashboardResponse, ReportResponse
from app.controllers.admin_controller import (
    signup_admin,
    login_admin,
    create_interview,
    add_question_to_interview,
    get_all_interviews,
    get_interview_dashboard,
    get_interview_candidates,
    get_candidate_report,
    generate_interview_excel
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/signup", response_model=AdminLoginResponse)
def admin_signup(
    signup_data: AdminSignupRequest,
    db: Session = Depends(get_db)
):
    """
    Admin signup endpoint
    Creates a new admin account and returns JWT token
    """
    return signup_admin(db, signup_data)


@router.post("/login", response_model=AdminLoginResponse)
def admin_login(
    login_data: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Admin login endpoint
    Returns JWT token for authenticated admin
    """
    return login_admin(db, login_data)


@router.post("/create-interview", response_model=InterviewResponse)
def create_interview_endpoint(
    interview_data: InterviewCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new interview with shareable link and candidate password
    Requires admin authentication
    """
    return create_interview(db, interview_data)


@router.post("/add-question")
def add_question(
    interview_id: str,
    question_text: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Add a question to an interview
    Requires admin authentication
    Accepts interview_id and question_text as query parameters or form data
    """
    return add_question_to_interview(db, interview_id, question_text)


@router.get("/interviews", response_model=InterviewListResponse)
def get_interviews(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all interviews
    Requires admin authentication
    """
    return get_all_interviews(db)


@router.get("/interview/{interview_id}/download-excel")
def download_interview_excel(
    interview_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Download interview report as Excel file
    Requires admin authentication
    """
    excel_buffer = generate_interview_excel(db, interview_id)
    
    return StreamingResponse(
        excel_buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename=interview_report_{interview_id}.xlsx"
        }
    )


@router.get("/interview/{interview_id}/dashboard", response_model=DashboardResponse)
def get_dashboard(
    interview_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get dashboard data for a specific interview
    Requires admin authentication
    """
    return get_interview_dashboard(db, interview_id)


@router.get("/interview/{interview_id}/candidates")
def get_candidates(
    interview_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get all candidates for an interview
    Requires admin authentication
    """
    return get_interview_candidates(db, interview_id)


@router.get("/report/{candidate_id}", response_model=ReportResponse)
def get_report(
    candidate_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get detailed report for a candidate
    Requires admin authentication
    """
    return get_candidate_report(db, candidate_id)

