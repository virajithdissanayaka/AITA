import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from .models import QuestionRequest, AIResponse, HealthResponse
from .services.groq_service import GroqService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AITA - AI Terminal Companion API",
    description="Backend API for AI Terminal Companion powered by Groq",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.vercel.app",
        "https://your-frontend-domain.vercel.app"  # Replace with actual domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize Groq service
try:
    groq_service = GroqService()
    groq_available = True
except Exception as e:
    print(f"Warning: Groq service initialization failed: {e}")
    groq_service = None
    groq_available = False

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AITA - AI Terminal Companion API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "ask": "/ask (POST)",
            "docs": "/docs"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    global groq_service, groq_available
    
    # Re-check Groq availability if it was previously unavailable
    if not groq_available and groq_service is None:
        try:
            groq_service = GroqService()
            groq_available = groq_service.check_connection()
        except Exception:
            groq_available = False
    
    return HealthResponse(
        status="ok" if groq_available else "degraded",
        message="API is running" if groq_available else "API running but AI service unavailable",
        groq_available=groq_available
    )

@app.post("/ask", response_model=AIResponse)
async def ask_question(request: QuestionRequest):
    """Process AI question and return response"""
    if not groq_service or not groq_available:
        raise HTTPException(
            status_code=503,
            detail="AI service is currently unavailable. Please try again later."
        )
    
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    if len(request.question) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Question is too long. Please limit to 2000 characters."
        )
    
    try:
        response, processing_time = await groq_service.ask_ai(request.question)
        
        return AIResponse(
            response=response,
            model=groq_service.model,
            processing_time=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process question: {str(e)}"
        )

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": "The requested endpoint does not exist",
            "available_endpoints": ["/", "/health", "/ask", "/docs"]
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )