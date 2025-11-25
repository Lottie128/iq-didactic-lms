from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.services.upload_service import upload_service
from pydantic import BaseModel

router = APIRouter()

class UploadResponse(BaseModel):
    url: str
    message: str

@router.post("/profile-picture", response_model=UploadResponse)
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upload profile picture for current user
    
    - **file**: Image file (JPG, PNG, WEBP, GIF)
    - Maximum size: 5MB
    """
    try:
        # Delete old profile picture if exists
        if current_user.profile_picture:
            upload_service.delete_file(current_user.profile_picture)
        
        # Upload new picture
        file_url = await upload_service.upload_profile_picture(file, str(current_user.id))
        
        # Update user profile
        current_user.profile_picture = file_url
        current_user.profile_completion = current_user.calculate_profile_completion()
        db.commit()
        db.refresh(current_user)
        
        return UploadResponse(
            url=file_url,
            message="Profile picture uploaded successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.delete("/profile-picture")
async def delete_profile_picture(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete current user's profile picture
    """
    if not current_user.profile_picture:
        raise HTTPException(status_code=404, detail="No profile picture found")
    
    try:
        # Delete file
        upload_service.delete_file(current_user.profile_picture)
        
        # Update user profile
        current_user.profile_picture = None
        current_user.profile_completion = current_user.calculate_profile_completion()
        db.commit()
        
        return {"message": "Profile picture deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")
