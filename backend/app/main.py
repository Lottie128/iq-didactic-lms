from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.core.config import settings
from app.api import auth, upload

app = FastAPI(
    title="IQ Didactic LMS API",
    description="Bilingual LMS with AI Teacher Integration",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads (if using local storage)
if settings.UPLOAD_STORAGE_TYPE == "local":
    upload_path = Path(settings.UPLOAD_DIR)
    if upload_path.exists():
        app.mount(f"/{settings.UPLOAD_DIR}", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.get("/")
async def root():
    return {
        "message": "IQ Didactic LMS API",
        "status": "online",
        "version": "1.0.0",
        "storage_type": settings.UPLOAD_STORAGE_TYPE
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
