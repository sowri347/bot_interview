"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import admin_routes, candidate_routes, ai_routes, interview_routes

# Create FastAPI app
app = FastAPI(
    title="AI Interview Bot API",
    description="AI-powered interview platform with Whisper and Gemini integration",
    version="1.0.0"
)

# Configure CORS
origins = settings.CORS_ORIGINS.split(",") if "," in settings.CORS_ORIGINS else [settings.CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin_routes.router)
app.include_router(candidate_routes.router)
app.include_router(ai_routes.router)
app.include_router(interview_routes.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "AI Interview Bot API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

