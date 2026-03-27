import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/api";

type ProtectedRouteProps = {
  children: ReactElement;
  requiredRole?: UserRole;
};

const canAccessRole = (role: UserRole | undefined, requiredRole?: UserRole) => {
  if (!requiredRole) return true;
  if (!role) return false;
  if (requiredRole === "ADMIN") {
    return role === "ADMIN" || role === "SUPER_ADMIN";
  }
  return role === requiredRole;
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRole(user.role, requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
