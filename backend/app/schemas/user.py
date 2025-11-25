from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.STUDENT

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None

class UserInDB(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserResponse(UserInDB):
    pass
