"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { useTheme } from "./contexts/ThemeContext"
import { useEffect } from "react"

// Pages
import WelcomePage from "./pages/WelcomePage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import UserDashboard from "./pages/dashboard/UserDashboard"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import MatchesPage from "./pages/MatchesPage"
import FixturesPage from "./pages/FixturesPage"
// import StatisticsPage from "./pages/StatisticsPage"
// import TablePage from "./pages/TablePage"
import PlayersPage from "./pages/PlayersPage"
import PaymentPage from "./pages/PaymentPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

function App() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.className = theme
    console.log("App.tsx: Current user state:", user); // NEW LOG
    console.log("App.tsx: Loading state:", loading); // NEW LOG
  }, [theme, user, loading]) // Depend on user and loading

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Special FC...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 ai-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute>{user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}</ProtectedRoute>}
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fixtures"
          element={
            <ProtectedRoute>
              <FixturesPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/table"
          element={
            <ProtectedRoute>
              <TablePage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <PlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute />} />

        {/* Default Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />} />
      </Routes>
    </div>
  )
}

export default App
