"""
Database initialization script
Creates all database tables based on SQLAlchemy models
"""
from app.database import engine, Base
from app.models import (
    Admin,
    Interview,
    Question,
    Candidate,
    Answer,
    CandidateAuth,
    InterviewLink
)

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()

