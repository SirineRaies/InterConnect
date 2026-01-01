// src/components/ProtectedRoute.js
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />; // pas connecté
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />; // rôle non autorisé

  return children;
};

export default ProtectedRoute;
