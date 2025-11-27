import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ProfilePictureUpload from '../components/ProfilePictureUpload'
import AITeacher from '../components/AITeacher'
import '../styles/EnhancedDashboard.css'

const DashboardPage = () => {
  const { user, logout, refetch } = useAuth()
  const { t, i18n } = useTranslation()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-teacher'>('overview')

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const profileCompletion = user?.profile_completion || 0
  const showProfileBanner = profileCompletion < 100

  const getMissingFields = () => {
    const missing = []
    if (!user?.phone) missing.push('Phone')
    if (!user?.country) missing.push('Country')
    if (!user?.occupation) missing.push('Occupation')
    if (!user?.profile_picture) missing.push('Profile Picture')
    return missing
  }

  const handleUploadSuccess = () => {
    // Check if profile is now complete
    const wasIncomplete = profileCompletion < 100
    
    // Refresh user data
    if (refetch) {
      refetch().then(() => {
        // Show achievement if profile just became complete
        if (wasIncomplete && user?.profile_completion === 100) {
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 5000)
        }
      })
    } else {
      window.location.reload()
    }
  }

  const handleCompleteNowClick = () => {
    setShowProfileModal(true)
  }

  return (
    <div className="dashboard enhanced">
      <nav className="navbar enhanced">
        <div className="navbar-brand">
          <div className="logo-badge">🎓</div>
          <h1>IQ Didactic</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={toggleLanguage} className="btn-icon">
            {i18n.language === 'en' ? '🇫🇷' : '🇬🇧'}
          </button>
          <button onClick={logout} className="btn-logout">
            <span>🚪</span>
            {t('nav.logout')}
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Achievement Notification */}
        {showAchievement && (
          <div className="achievement-notification">
            <div className="achievement-content">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-text">
                <h3>Profile Complete!</h3>
                <p>You've completed your profile. Great job!</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Completion Banner */}
        {showProfileBanner && (
          <div className="profile-banner" onClick={handleCompleteNowClick} style={{ cursor: 'pointer' }}>
            <div className="banner-icon">⚠️</div>
            <div className="banner-content">
              <h3>Complete Your Profile</h3>
              <p>
                Your profile is {profileCompletion}% complete. Add missing information to enhance your learning
                experience.
              </p>
              <div className="missing-fields">
                <span className="missing-label">Missing:</span>
                {getMissingFields().map((field, i) => (
                  <span key={i} className="field-tag">
                    {field}
                  </span>
                ))}
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${profileCompletion}%` }}>
                  <span className="progress-text">{profileCompletion}%</span>
                </div>
              </div>
            </div>
            <button className="btn-complete" onClick={handleCompleteNowClick}>Complete Now →</button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="welcome-card">
          <div className="card-header">
            <div>
              <h2>{t('dashboard.welcome', { name: user?.full_name })}</h2>
              <p className="student-id">
                <span className="id-badge">🎫</span>
                Student ID: <strong>{user?.student_id}</strong>
              </p>
            </div>
            <div className="profile-avatar-container" onClick={() => setShowProfileModal(true)} style={{ cursor: 'pointer' }}>
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL}${user.profile_picture}` : user.profile_picture} 
                  alt="Profile" 
                  className="profile-avatar" 
                />
              ) : (
                <div className="profile-avatar placeholder">
                  <span>{user?.full_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="avatar-overlay">
                <span>📸 Change</span>
              </div>
            </div>
          </div>

          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <span className="stat-value">0</span>
                <span className="stat-label">Enrolled Courses</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value">0</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-value">0</span>
                <span className="stat-label">Achievements</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <span className="stat-value">0</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
            <div 
              className="stat-card ai-quick-access" 
              onClick={() => setActiveTab('ai-teacher')}
            >
              <div className="stat-icon">🤖</div>
              <div className="stat-info">
                <span className="stat-value">AI</span>
                <span className="stat-label">Ask Teacher</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'ai-teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-teacher')}
          >
            🤖 AI Teacher
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <>
            {/* User Info Card */}
            <div className="info-grid">
              <div className="info-card">
                <h3>👤 Personal Information</h3>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                  {user?.email_verified ? (
                    <span className="badge verified">✔️ Verified</span>
                  ) : (
                    <span className="badge unverified">⚠️ Unverified</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{user?.country || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Occupation:</span>
                  <span className="info-value">{user?.occupation || 'Not provided'}</span>
                </div>
              </div>

              <div className="info-card">
                <h3>⚙️ Preferences</h3>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="badge role">{user?.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Language:</span>
                  <span className="info-value">
                    {user?.preferred_language === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {new Date(user?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="courses-section">
              <h3>📚 {t('dashboard.myCourses')}</h3>
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>{t('dashboard.noCourses')}</p>
                <p className="empty-hint">
                  Courses will be available in the next feature: <code>feat/courses</code>
                </p>
                <button className="btn-primary">Browse Courses</button>
              </div>
            </div>
          </>
        ) : (
          <AITeacher />
        )}
      </div>

      {/* Profile Picture Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📸 Update Profile Picture</h3>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <ProfilePictureUpload
                currentPicture={user?.profile_picture}
                onUploadSuccess={() => {
                  handleUploadSuccess()
                  setShowProfileModal(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-avatar-container {
          position: relative;
        }

        .avatar-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .profile-avatar-container:hover .avatar-overlay {
          opacity: 1;
        }

        .achievement-notification {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 1000;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
          animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4.5s;
        }

        .achievement-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .achievement-icon {
          font-size: 3rem;
          animation: bounce 1s ease infinite;
        }

        .achievement-text h3 {
          margin: 0;
          font-size: 1.2rem;
        }

        .achievement-text p {
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: var(--bg-secondary);
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        .modal-body {
          padding: 2rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          margin: 1.5rem 0;
          padding: 0.5rem;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
        }

        .tab-btn {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-secondary, #64748b);
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: var(--text-primary, #1e293b);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .ai-quick-access {
          background: linear-gradient(135deg, #667eea, #764ba2) !important;
          color: white !important;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .ai-quick-access .stat-icon {
          filter: brightness(0) invert(1);
        }

        .ai-quick-access .stat-value,
        .ai-quick-access .stat-label {
          color: white !important;
        }

        .ai-quick-access:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
        }

        .ai-quick-access::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .ai-quick-access:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  )
}

export default DashboardPage
