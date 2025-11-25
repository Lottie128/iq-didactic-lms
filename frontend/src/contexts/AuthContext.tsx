import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, User } from '../api/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, language?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token')
    if (token) {
      authApi.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('access_token', response.access_token)
    const currentUser = await authApi.getCurrentUser()
    setUser(currentUser)
  }

  const register = async (email: string, password: string, fullName: string, language = 'en') => {
    await authApi.register({
      email,
      password,
      full_name: fullName,
      preferred_language: language,
    })
    // Auto-login after registration
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
