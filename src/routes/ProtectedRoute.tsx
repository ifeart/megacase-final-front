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
    return <div>Loading...</div>; // Или ваш компонент загрузки
  }

  if (!user) {
    // Сохраняем URL для редиректа после логина
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!hasPermission(requiredRole, resourceId)) {
    // Если нет прав - редирект на страницу бронирования
    return <Navigate to="/booking" replace />;
  }

  return <>{children}</>;
}
