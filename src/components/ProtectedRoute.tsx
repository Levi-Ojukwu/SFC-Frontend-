"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  console.log("ProtectedRoute: User:", user, "Loading:", loading); // NEW LOG

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // if (!user) {
  //   return <Navigate to="/login" />
  // }

  return <>{children}</>
}

export default ProtectedRoute
