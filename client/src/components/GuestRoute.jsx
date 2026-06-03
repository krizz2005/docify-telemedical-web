import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, token } = useAuth();

  // 🚨 Only allow guests (no token + no user)
  if (token && user) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === "patient") return <Navigate to="/patient/dashboard" replace />;
  }

  return children;
}