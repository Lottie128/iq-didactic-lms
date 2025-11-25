import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import '../styles/Dashboard.css'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🎓 IQ Didactic</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={toggleLanguage} className="btn-secondary">
            {i18n.language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
          <button onClick={logout} className="btn-danger">
            {t('nav.logout')}
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>{t('dashboard.welcome', { name: user?.full_name })}</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Language:</strong> {user?.preferred_language === 'en' ? 'English' : 'Français'}</p>
          </div>
        </div>

        <div className="courses-section">
          <h3>{t('dashboard.myCourses')}</h3>
          <div className="empty-state">
            <p>📚 {t('dashboard.noCourses')}</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
              Courses will be available in the next feature branch: <code>feat/courses</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
