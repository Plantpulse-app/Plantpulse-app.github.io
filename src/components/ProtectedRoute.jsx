// src/pages/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ background: "#0b1a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading...
      </div>
    );
  }

  // Double check localStorage in case context state update hasn't completed yet
  const hasLocalSession = localStorage.getItem("loggedIn") === "true" && localStorage.getItem("userEmail");

  if (!user && !hasLocalSession) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
