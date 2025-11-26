import apiClient from './client'

export interface RegisterData {
  email: string
  password: string
  full_name: string
  preferred_language?: string
  phone?: string
  country?: string
  occupation?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  student_id: string
  email: string
  full_name: string
  phone?: string
  country?: string
  occupation?: string
  role: string
  profile_picture?: string
  preferred_language: string
  email_verified: boolean
  profile_completion: number
  created_at: string
  updated_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<User>('/api/auth/register', data)
    return response.data
  },

  login: async (data: LoginData): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me')
    return response.data
  },
}
