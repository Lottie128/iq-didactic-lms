from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    preferred_language: Optional[str] = "en"
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if v and not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Invalid phone number format')
        return v
    
    @field_validator('full_name')
    @classmethod
    def validate_name(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if not re.match(r'^[a-zA-Z\s]+$', v):
            raise ValueError('Name can only contain letters and spaces')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
