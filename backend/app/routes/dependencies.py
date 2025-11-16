"""
Dependency injection functions for FastAPI routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.models.candidate import Candidate
from app.services.auth_service import decode_token, get_admin_by_email, get_candidate_by_id

# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Admin:
    """
    Dependency to get current authenticated admin from JWT token
    
    Args:
        credentials: HTTP Bearer token credentials
        db: Database session
    
    Returns:
        Admin model instance
    
    Raises:
        HTTPException: If token is invalid or admin not found
    """
    token = credentials.credentials
    
    try:
        payload = decode_token(token)
        admin_id = payload.get("sub")
        token_type = payload.get("type")
        
        if not admin_id or token_type != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin not found"
            )
        
        return admin
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


def get_current_candidate(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Candidate:
    """
    Dependency to get current authenticated candidate from JWT token
    """
    token = credentials.credentials
    
   
    
    try:
        payload = decode_token(token)
       
        
        candidate_id_str = payload.get("sub")
        token_type = payload.get("type")
        
     
        
        if not candidate_id_str or token_type != "candidate":
         
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )
        
        # Convert string UUID to UUID object for querying
        import uuid
        try:
            candidate_id = uuid.UUID(candidate_id_str)
           
        except (ValueError, TypeError) as e:
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid candidate ID format"
            )
        
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
        
        if not candidate:
         
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Candidate not found"
            )
        
        
        return candidate
    except HTTPException:
        raise
    except Exception as e:
       
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

