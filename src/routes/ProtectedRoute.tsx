import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { type ROLE } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: ROLE;
  resourceId?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  resourceId,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    // return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!hasPermission(requiredRole, resourceId)) {
    return <Navigate to="/booking" replace />;
  }

  return <>{children}</>;
}
