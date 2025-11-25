from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserResponse
from app.services.auth_service import auth_service
from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - **email**: User's email address (must be unique)
    - **password**: User's password (will be hashed)
    - **full_name**: User's full name
    - **preferred_language**: Preferred language (en or fr, default: en)
    """
    user = auth_service.register_user(db, user_data)
    return user

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password
    
    Returns JWT access token
    """
    user = auth_service.authenticate_user(db, user_data.email, user_data.password)
    access_token = auth_service.create_token(user)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Get current authenticated user information
    
    Requires valid JWT token in Authorization header
    """
    return current_user
