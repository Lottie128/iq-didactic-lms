import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useState } from 'react'
import Preloader from './components/Preloader'
import DarkModeToggle from './components/DarkModeToggle';
import AnimatedBackground from './components/AnimatedBackground'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

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
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
