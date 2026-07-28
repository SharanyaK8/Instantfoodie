import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getLoginPathForRoles(allowedRoles) {
  if (allowedRoles?.includes("restaurant")) return "/restaurant-login";
  if (allowedRoles?.includes("admin")) return "/admin-login";
  return "/login";
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={getLoginPathForRoles(allowedRoles)} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}