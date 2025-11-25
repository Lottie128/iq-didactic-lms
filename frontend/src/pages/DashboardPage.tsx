import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import ProfilePictureUpload from '../components/ProfilePictureUpload'
import '../styles/EnhancedDashboard.css'

const DashboardPage = () => {
  const { user, logout, refetch } = useAuth()
  const { t, i18n } = useTranslation()

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
    // Refresh user data after upload
    if (refetch) {
      refetch()
    } else {
      // Fallback: reload page if refetch not available
      window.location.reload()
    }
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
        {/* Profile Completion Banner */}
        {showProfileBanner && (
          <div className="profile-banner">
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
            <button className="btn-complete">Complete Now →</button>
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
          </div>
        </div>

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

        {/* Profile Picture Upload Section */}
        <div className="info-card profile-picture-section">
          <h3>📸 Profile Picture</h3>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Upload a profile picture to personalize your account. Supported formats: JPG, PNG, WEBP, GIF (Max 5MB)
          </p>
          <ProfilePictureUpload
            currentPicture={user?.profile_picture}
            onUploadSuccess={handleUploadSuccess}
          />
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
      </div>
    </div>
  )
}

export default DashboardPage
