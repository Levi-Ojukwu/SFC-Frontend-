"use client"

import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AdminPlayersPage from "../pages/admin/AdminPlayersPage"
import AdminMatchesPage from "../pages/admin/AdminMatchesPage"
import AdminStatisticsPage from "../pages/admin/AdminStatisticsPage"

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth()

  console.log("AdminRoute: User:", user, "Loading:", loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log("AdminRoute: No user, redirecting to login")
    return <Navigate to="/login" replace />
  }

  if (user.role !== "admin") {
    console.log("AdminRoute: User is not admin, redirecting to dashboard")
    return <Navigate to="/dashboard" replace />
  }

  // if (!user || user.role !== "admin") {
  //   return <Navigate to="/dashboard" />
  // }

  // Return admin dashboard or admin routes
  return (
    <Routes>
      <Route path="/players" element={<AdminPlayersPage />} />
      <Route path="/matches" element={<AdminMatchesPage />} />
      <Route path="/statistics" element={<AdminStatisticsPage />} />
      <Route path="/reports" element={<div>Admin Reports Page - Coming Soon</div>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AdminRoute
