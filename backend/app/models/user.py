from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base
import random

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    country = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    role = Column(String, default="student", nullable=False)
    preferred_language = Column(String, default="en", nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    profile_completion = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<User {self.email}>"
    
    @staticmethod
    def generate_student_id():
        """Generate unique student ID: IQD-YYYY-XXXXX"""
        year = datetime.now().year
        random_num = random.randint(10000, 99999)
        return f"IQD-{year}-{random_num}"
    
    def calculate_profile_completion(self):
        """Calculate profile completion percentage"""
        fields = [
            self.full_name,
            self.email,
            self.phone,
            self.country,
            self.occupation,
            self.profile_picture,
        ]
        completed = sum(1 for field in fields if field)
        return int((completed / len(fields)) * 100)
