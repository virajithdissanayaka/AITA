# main.py - Replit entry point
import os
import sys

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    from backend.app.main import app

    # Get port from Replit environment
    port = int(os.getenv("PORT", 8000))

    print(f"Starting AITA Backend on port {port}")
    print("🤖 AI Terminal Companion API")
    print(f"📡 Health check: http://0.0.0.0:{port}/health")
    print(f"📚 API docs: http://0.0.0.0:{port}/docs")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
        reload=False
    )