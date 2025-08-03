"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />
  }

  // Return admin dashboard or admin routes
  return <Navigate to="/dashboard" />
}

export default AdminRoute
