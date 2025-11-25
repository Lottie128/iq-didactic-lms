import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, User } from '../api/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    fullName: string,
    language?: string,
    phone?: string,
    country?: string,
    occupation?: string
  ) => Promise<void>
  logout: () => void
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const currentUser = await authApi.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        localStorage.removeItem('access_token')
        setUser(null)
      }
    }
  }

  useEffect(() => {
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

  const register = async (
    email: string,
    password: string,
    fullName: string,
    language = 'en',
    phone?: string,
    country?: string,
    occupation?: string
  ) => {
    await authApi.register({
      email,
      password,
      full_name: fullName,
      preferred_language: language,
      phone,
      country,
      occupation,
    })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    window.location.href = '/login'
  }

  const refetch = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch }}>
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
