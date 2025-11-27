from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional, Any
from app.db.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.security import get_password_hash
from pydantic import BaseModel, EmailStr
from datetime import datetime
import secrets
import string
import uuid

router = APIRouter()

# ============ SCHEMAS ============
class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    phone: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    preferred_language: str = "en"

# ============ MIDDLEWARE ============
def require_admin(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ============ STATS ============
@router.get("/stats/overview")
async def get_overview_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    
    return {
        "users": {
            "total": total_users,
            "students": total_students,
            "teachers": total_teachers,
            "admins": db.query(User).filter(User.role == "admin").count()
        },
        "courses": {
            "total": 0,
            "published": 0,
            "draft": 0,
            "enrollments": 0
        }
    }

# ============ USER MANAGEMENT ============
@router.get("/users")
async def get_users(
    skip: int = 0,
    limit: int = 50,
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    if search:
        query = query.filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.student_id.ilike(f"%{search}%")
            )
        )
    
    users = query.offset(skip).limit(limit).all()
    
    # Manually convert to dict to handle UUID
    return [
        {
            "id": str(user.id),
            "student_id": user.student_id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "country": user.country,
            "email_verified": user.email_verified,
            "profile_completion": user.profile_completion,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]

@router.post("/users")
async def create_user(
    user_data: CreateUserRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """Create a new user (admin only)"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate role
    if user_data.role not in ["student", "teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Create user
    new_user = User(
        id=uuid.uuid4(),
        student_id=User.generate_student_id(),
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        phone=user_data.phone,
        country=user_data.country,
        occupation=user_data.occupation,
        preferred_language=user_data.preferred_language,
        email_verified=True,  # Auto-verify admin-created users
        profile_completion=0
    )
    
    # Calculate profile completion
    new_user.profile_completion = new_user.calculate_profile_completion()
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": str(new_user.id),
        "student_id": new_user.student_id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role,
        "message": "User created successfully"
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot delete admin users")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}

# ============ PASSWORD RESET ============
@router.post("/users/{user_id}/reset-password")
async def reset_user_password(
    user_id: str,
    new_password: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot reset admin password")
    
    user.password_hash = get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password reset successfully", "user_id": user_id, "email": user.email}

@router.post("/users/{user_id}/generate-password")
async def generate_and_reset_password(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot reset admin password")
    
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    new_password = ''.join(secrets.choice(alphabet) for i in range(12))
    
    user.password_hash = get_password_hash(new_password)
    db.commit()
    
    return {
        "message": "Password generated and reset successfully",
        "user_id": user_id,
        "email": user.email,
        "temporary_password": new_password,
        "note": "Share this password securely with the user"
    }
