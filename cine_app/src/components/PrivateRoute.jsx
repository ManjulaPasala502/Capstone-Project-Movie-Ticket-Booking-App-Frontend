// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Not logged in → redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If roles are passed, check if user has permission
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default PrivateRoute;
