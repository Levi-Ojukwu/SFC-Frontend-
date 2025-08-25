"use client";

import type React from "react";
// import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute: User:", user, "Loading:", loading, "AdminOnly:", adminOnly)

  // Only show spinner while AuthProvider is verifying/restoring
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // After loading completes, if there's no user -> go to login
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login")
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== "admin") {
    console.log("ProtectedRoute: Admin required but user is not admin, redirecting to dashboard")
    return <Navigate to="/dashboard" replace />
  } 

  console.log("ProtectedRoute: Access granted")
  
  // Auth ok -> render children
  return <>{children}</>;
};

export default ProtectedRoute;
