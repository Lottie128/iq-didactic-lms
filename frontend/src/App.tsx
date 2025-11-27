import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useState, useEffect } from 'react'
import Preloader from './components/Preloader'
import DarkModeToggle from './components/DarkModeToggle';
import AnimatedBackground from './components/AnimatedBackground'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Route based on user role
  const role = user.role?.toLowerCase()
  
  if (role === 'admin' || role === 'administrator') {
    return <Navigate to="/admin" replace />
  } else if (role === 'teacher' || role === 'instructor') {
    return <DashboardPage /> // Teacher gets standard dashboard
  } else if (role === 'student') {
    return <DashboardPage /> // Student gets standard dashboard
  } else {
    // Default to dashboard for unknown roles
    return <DashboardPage />
  }
}

function App() {
  const [showPreloader, setShowPreloader] = useState(true)

  return (
    <ThemeProvider>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      {!showPreloader && (
        <>
          <AnimatedBackground />
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Dashboard route with role-based routing */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRouter />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Admin route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Root redirect to dashboard (which will handle role routing) */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </AuthProvider>
          </QueryClientProvider>
          <DarkModeToggle />
        </>
      )}
    </ThemeProvider>
  )
}

export default App