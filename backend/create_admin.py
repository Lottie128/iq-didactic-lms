#!/usr/bin/env python3
import sys
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import uuid

def create_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@iqdidactic.com"
        admin_password = "Admin@123"
        
        existing = db.query(User).filter(User.email == admin_email).first()
        if existing:
            if existing.role != "admin":
                existing.role = "admin"
                db.commit()
                print(f"✅ Changed {admin_email} to admin role")
            else:
                print(f"ℹ️  Admin already exists: {admin_email}")
            return
        
        admin = User(
            id=uuid.uuid4(),
            student_id=User.generate_student_id(),
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            full_name="System Administrator",
            role="admin",
            email_verified=True,
            profile_completion=100,
            phone="+1234567890",
            country="USA",
            occupation="Administrator"
        )
        
        db.add(admin)
        db.commit()
        
        print("\n" + "="*50)
        print("✅ ADMIN CREATED!")
        print("="*50)
        print(f"📧 Email:    {admin_email}")
        print(f"🔐 Password: {admin_password}")
        print(f"🌐 URL:      http://localhost:5173/admin")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
