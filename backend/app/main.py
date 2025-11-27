from fastapi import UploadFile, HTTPException
from pathlib import Path
from typing import Optional
import uuid
import shutil
import os
from app.core.config import settings

class UploadService:
    """
    Dynamic upload service that supports multiple storage backends.
    Currently supports: local storage
    Future: S3, Cloudinary, etc.
    """
    
    def __init__(self):
        self.storage_type = settings.UPLOAD_STORAGE_TYPE
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.max_size = settings.MAX_UPLOAD_SIZE
        self.allowed_extensions = settings.ALLOWED_EXTENSIONS
        
        # Ensure upload directory exists
        if self.storage_type == "local":
            self.upload_dir.mkdir(parents=True, exist_ok=True)
            (self.upload_dir / "profile_pictures").mkdir(exist_ok=True)
    
    def validate_file(self, file: UploadFile) -> None:
        """Validate file extension and size"""
        # Check extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in self.allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(self.allowed_extensions)}"
            )
        
        # Check size (read first chunk to estimate)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to start
        
        if file_size > self.max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {self.max_size / (1024*1024):.1f}MB"
            )
    
    async def upload_profile_picture(self, file: UploadFile, user_id: str) -> str:
        """
        Upload profile picture and return URL/path
        
        Args:
            file: Uploaded file
            user_id: User UUID
        
        Returns:
            URL or path to uploaded file
        """
        self.validate_file(file)
        
        if self.storage_type == "local":
            return await self._upload_local(file, user_id, "profile_pictures")
        elif self.storage_type == "s3":
            return await self._upload_s3(file, user_id, "profile_pictures")
        elif self.storage_type == "cloudinary":
            return await self._upload_cloudinary(file, user_id)
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Storage type '{self.storage_type}' not supported"
            )
    
    async def _upload_local(self, file: UploadFile, user_id: str, subfolder: str) -> str:
        """Upload to local storage"""
        try:
            # Generate unique filename
            file_ext = Path(file.filename).suffix.lower()
            filename = f"{user_id}_{uuid.uuid4().hex}{file_ext}"
            
            # Create user directory
            user_dir = self.upload_dir / subfolder / str(user_id)
            user_dir.mkdir(parents=True, exist_ok=True)
            
            # Save file
            file_path = user_dir / filename
            
            # Write file with proper error handling
            with file_path.open("wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Verify file was written
            if not file_path.exists() or file_path.stat().st_size == 0:
                raise HTTPException(
                    status_code=500,
                    detail="File upload failed: file not saved properly"
                )
            
            # Return relative path (for URL construction)
            relative_path = f"/{settings.UPLOAD_DIR}/{subfolder}/{user_id}/{filename}"
            print(f"✓ File uploaded successfully: {file_path.absolute()}")
            print(f"✓ URL path: {relative_path}")
            return relative_path
            
        except Exception as e:
            print(f"✗ Upload error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"File upload failed: {str(e)}"
            )
    
    async def _upload_s3(self, file: UploadFile, user_id: str, subfolder: str) -> str:
        """
        Upload to AWS S3 (future implementation)
        
        TODO: Implement S3 upload using boto3
        - Configure S3 client with settings.S3_*
        - Upload file to bucket
        - Return public URL
        """
        raise NotImplementedError("S3 upload not yet implemented")
    
    async def _upload_cloudinary(self, file: UploadFile, user_id: str) -> str:
        """
        Upload to Cloudinary (future implementation)
        
        TODO: Implement Cloudinary upload
        - Configure Cloudinary with settings.CLOUDINARY_*
        - Upload file
        - Return public URL
        """
        raise NotImplementedError("Cloudinary upload not yet implemented")
    
    def delete_file(self, file_path: str) -> None:
        """Delete file from storage"""
        if self.storage_type == "local":
            full_path = Path(file_path.lstrip('/'))
            if full_path.exists():
                full_path.unlink()
                print(f"✓ File deleted: {full_path}")
            else:
                print(f"⚠ File not found for deletion: {full_path}")
        elif self.storage_type == "s3":
            # TODO: Implement S3 deletion
            pass
        elif self.storage_type == "cloudinary":
            # TODO: Implement Cloudinary deletion
            pass

upload_service = UploadService()
