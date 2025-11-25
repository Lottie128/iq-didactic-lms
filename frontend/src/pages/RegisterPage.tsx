import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import '../styles/EnhancedAuth.css'
import { countries } from '../utils/countries'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    country: '',
    occupation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength
  }

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password })
    setPasswordStrength(calculatePasswordStrength(password))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Use a stronger password.')
      return
    }

    setLoading(true)

    try {
      await register(
        formData.email,
        formData.password,
        formData.fullName,
        i18n.language,
        formData.phone || undefined,
        formData.country || undefined,
        formData.occupation || undefined
      )
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || t('errors.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e']
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="auth-container enhanced">
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-card glass">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">🎓</span>
            </div>
            <h1 className="brand-name">IQ Didactic</h1>
          </div>
          <h2>{t('auth.createAccount')}</h2>
          <p className="subtitle">Start your learning journey today</p>
        </div>

        <button onClick={toggleLanguage} className="language-toggle floating">
          {i18n.language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
        </button>

        {error && (
          <div className="error-message slide-in">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form enhanced">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">
                <span className="label-icon">👤</span>
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
                className="input-enhanced"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">✉️</span>
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="input-enhanced"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">
                <span className="label-icon">📞</span>
                Phone (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
                className="input-enhanced"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">
                <span className="label-icon">🌍</span>
                Country (Optional)
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={loading}
                className="input-enhanced"
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="occupation">
              <span className="label-icon">💼</span>
              Occupation (Optional)
            </label>
            <input
              id="occupation"
              type="text"
              placeholder="e.g., Student, Developer, Teacher"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              disabled={loading}
              className="input-enhanced"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              minLength={8}
              disabled={loading}
              className="input-enhanced"
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`strength-segment ${i < passwordStrength ? 'active' : ''}`}
                      style={{
                        backgroundColor: i < passwordStrength ? strengthColors[passwordStrength - 1] : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColors[passwordStrength - 1] }}>
                  {strengthLabels[passwordStrength - 1]}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span className="label-icon">🔓</span>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              className="input-enhanced"
            />
          </div>

          <button type="submit" className="btn-primary enhanced" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span>🚀</span>
                {t('auth.registerButton')}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t('auth.haveAccount')} <Link to="/login" className="link-enhanced">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
