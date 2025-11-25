import { useEffect, useState } from 'react'
import '../styles/Preloader.css'

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const interval = 20
    const steps = duration / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(onComplete, 500)
          }, 200)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="logo-animation">
          <div className="logo-ring"></div>
          <div className="logo-ring ring-2"></div>
          <div className="logo-center">
            <span className="logo-icon">🎓</span>
          </div>
        </div>
        <h1 className="brand-text">
          <span className="letter" style={{ animationDelay: '0s' }}>I</span>
          <span className="letter" style={{ animationDelay: '0.1s' }}>Q</span>
          <span className="space"></span>
          <span className="letter" style={{ animationDelay: '0.2s' }}>D</span>
          <span className="letter" style={{ animationDelay: '0.3s' }}>i</span>
          <span className="letter" style={{ animationDelay: '0.4s' }}>d</span>
          <span className="letter" style={{ animationDelay: '0.5s' }}>a</span>
          <span className="letter" style={{ animationDelay: '0.6s' }}>c</span>
          <span className="letter" style={{ animationDelay: '0.7s' }}>t</span>
          <span className="letter" style={{ animationDelay: '0.8s' }}>i</span>
          <span className="letter" style={{ animationDelay: '0.9s' }}>c</span>
        </h1>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">Loading your learning experience...</p>
      </div>
    </div>
  )
}

export default Preloader
