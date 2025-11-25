from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "student"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    profile_picture: Optional[str] = None
    preferred_language: Optional[str] = None

class UserInDB(UserBase):
    id: str
    student_id: str
    role: str
    profile_picture: Optional[str] = None
    email_verified: bool
    profile_completion: int
    created_at: datetime
    updated_at: datetime
    
    @field_validator('id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UserResponse(UserInDB):
    pass
