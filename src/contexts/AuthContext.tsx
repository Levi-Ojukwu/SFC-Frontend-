"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "../lib/api"
import toast from "react-hot-toast"

interface User {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
  role: "player" | "admin"
  is_verified: boolean
  team_id?: number
  team?: {
    id: number
    name: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          const response = await authAPI.me()
          setUser(response.data.user)
          setToken(storedToken)
        } catch (error) {
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password })
      const { access_token, user: userData } = response.data

      localStorage.setItem("token", access_token)
      setToken(access_token)
      setUser(userData)

      toast.success(`Welcome back, ${userData.first_name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data)
      toast.success(response.data.message)
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    toast.success("Logged out successfully")
  }

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
