"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom" // <--- IMPORTANT: This import is crucial
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
  const [loading, setLoading] = useState(true) // Keep loading true initially
  const navigate = useNavigate(); // <--- IMPORTANT: Initialize useNavigate here

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          console.log("AuthContext: Token found in localStorage, attempting to verify...")
          const response = await authAPI.me()
          setUser(response.data.user)
          setToken(storedToken)
          console.log("AuthContext: User data fetched successfully, user is logged in.")
        } catch (error: any) {
          // Log the specific error response from the backend
          console.error("AuthContext: Token verification failed:", error.response?.data || error.message)
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
          // Do not show a toast here, as it might be a silent re-authentication attempt on every refresh
        }
      } else {
        console.log("AuthContext: No token found in localStorage.")
      }
      setLoading(false) // Always set loading to false after attempt
    }

    initAuth()
  }, []) // Empty dependency array ensures this runs only once on mount

  const login = async (username: string, password: string) => {
    setLoading(true); // Set loading to true at the start of login
    try {
      console.log("Login attempt started for:", username); // New log
      const response = await authAPI.login({ username, password })
      console.log("Login API response:", response.data.status); // Log the full response data
      const { access_token, user: userData } = response.data

      localStorage.setItem("token", access_token)
      setToken(access_token)
      setUser(userData)

      // Safely access first_name, providing a fallback
      if(response.data.status === "success") {
        navigate("/dashboard"); // <--- IMPORTANT: Navigate to dashboard after successful login and state update
        toast.success(`Welcome back, ${userData?.first_name || 'User'}!`)
      console.log("AuthContext: User state updated, attempting navigation to /dashboard..."); // New log
      console.log("AuthContext: Navigation call executed."); // New log
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message)
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      throw error
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
      console.log("Login process finished."); // New log
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data)
      toast.success(response.data.message)
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message)
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
    navigate('/login'); // <--- IMPORTANT: Navigate to login page after logout
    console.log("AuthContext: Logout navigation call executed."); // New log
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
