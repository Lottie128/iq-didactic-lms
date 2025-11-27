from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.core.security import get_password_hash
from pydantic import BaseModel, field_serializer
from datetime import datetime
import secrets
import string
from uuid import UUID

router = APIRouter()

# ============ SCHEMAS ============
class UserResponse(BaseModel):
    id: str
    student_id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    country: Optional[str] = None
    email_verified: bool
    profile_completion: int
    created_at: datetime
    
    @field_serializer('id')
    def serialize_id(self, id: UUID, _info):
        return str(id)
    
    class Config:
        from_attributes = True

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
@router.get("/users", response_model=List[UserResponse])
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
    return users

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
