"use client";

import type React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Only show spinner while AuthProvider is verifying/restoring
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  // After loading completes, if there's no user -> go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Auth ok -> render children
  return <>{children}</>;
};

export default ProtectedRoute;
