from pydantic import BaseModel
from typing import Optional

class QuestionRequest(BaseModel):
    question: str

class AIResponse(BaseModel):
    response: str
    model: str = "llama-3.3-70b-versatile"  # Updated to current supported model
    processing_time: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    groq_available: bool