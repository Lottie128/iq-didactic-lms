import React, { useState, useRef } from 'react';
import axios from 'axios';

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onUploadSuccess: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onUploadSuccess
}) => {
  const [preview, setPreview] = useState<string | null>(currentPicture || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, WEBP, GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/profile-picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onUploadSuccess(response.data.url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
      setPreview(currentPicture || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/profile-picture`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setPreview(null);
      onUploadSuccess('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Delete failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="picture-container">
        {preview ? (
          <img 
            src={preview.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${preview}` : preview} 
            alt="Profile" 
            className="profile-image" 
          />
        ) : (
          <div className="no-picture">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="upload-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <button
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : (preview ? 'Change Picture' : 'Upload Picture')}
        </button>

        {preview && (
          <button
            className="btn btn-secondary"
            onClick={handleDelete}
            disabled={uploading}
          >
            Remove
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <style>{`
        .profile-picture-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }

        .picture-container {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--border-color, rgba(100, 116, 139, 0.2));
          background: var(--bg-secondary, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .picture-container:hover {
          transform: scale(1.05);
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-picture {
          color: var(--text-secondary, #64748b);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: var(--color-secondary, rgba(100, 116, 139, 0.12));
          color: var(--text-primary, #1e293b);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-secondary-hover, rgba(100, 116, 139, 0.2));
        }
      `}</style>
    </div>
  );
};

export default ProfilePictureUpload;
