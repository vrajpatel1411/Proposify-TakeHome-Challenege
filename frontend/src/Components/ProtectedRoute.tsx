// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../Context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    console.log("Hello");
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Render the protected component if authenticated
};

export default ProtectedRoute;
