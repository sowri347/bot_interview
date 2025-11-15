"""
Admin-related Pydantic schemas
"""
from pydantic import BaseModel, EmailStr


class AdminLoginRequest(BaseModel):
    """Admin login request schema"""
    email: EmailStr
    password: str


class AdminLoginResponse(BaseModel):
    """Admin login response schema"""
    access_token: str
    token_type: str = "bearer"
    admin_id: str
    email: str
    
    class Config:
        from_attributes = True

