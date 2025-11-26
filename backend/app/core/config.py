from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 1 week
    
    # AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # App
    PROJECT_NAME: str = "IQ Didactic LMS"
    VERSION: str = "1.0.0"
    
    # File Upload Configuration
    UPLOAD_STORAGE_TYPE: str = "local"  # Options: local, s3, cloudinary, etc.
    UPLOAD_DIR: str = "uploads"  # Local storage directory
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    
    # CDN Configuration (for future use)
    CDN_URL: str = ""
    S3_BUCKET: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_REGION: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create upload directory if using local storage
if settings.UPLOAD_STORAGE_TYPE == "local":
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    (upload_path / "profile_pictures").mkdir(exist_ok=True)
