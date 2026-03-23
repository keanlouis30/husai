# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env file before anything else
load_dotenv()

# Import all our routers (we'll create these next)
from app.routers import students, teachers, admin, ai

# Create the FastAPI app
# title and description appear in the auto-generated docs at /docs
app = FastAPI(
    title="Husai API",
    description="AI-Powered School Intelligence Platform — Mabini Elementary",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# CORS (Cross-Origin Resource Sharing) allows your React frontend
# to talk to this backend. Without this, browsers will block the requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",    # Vite dev server
        "http://localhost:3000",    # Create React App dev server
        "https://your-husai-app.vercel.app",  # Your Vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],   # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],   # Allow all headers including Authorization
)

# ── ROUTERS ───────────────────────────────────────────────────────────────────
# prefix="/api" means all routes in these routers start with /api
# So students.py's route "/students" becomes "/api/students"
app.include_router(students.router, prefix="/api", tags=["Students"])
app.include_router(teachers.router, prefix="/api", tags=["Teachers"])
app.include_router(admin.router,    prefix="/api", tags=["Admin"])
app.include_router(ai.router,       prefix="/api", tags=["AI"])

# ── ROOT ENDPOINT ─────────────────────────────────────────────────────────────
@app.get("/")
def root():
    """Health check — lets you verify the API is running."""
    return {
        "status": "running",
        "app": "Husai API",
        "version": "1.0.0",
        "docs": "/docs"     # FastAPI auto-generates docs here
    }