import { ROLES, type ROLE, type User } from "@/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { userStorage } from "@/services/storageUser";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  hasPermission: (requiredRole: ROLE, resourceId?: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При инициализации проверяем localStorage
  useEffect(() => {
    const storedUser = userStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authenticatedUser = userStorage.authenticateUser(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return authenticatedUser;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  const logout = () => {
    userStorage.clearStorage();
    setUser(null);
  };

  const hasPermission = (requiredRole: ROLE, resourceId?: string) => {
    if (!user) return false;

    // Workspace Admin имеет полный доступ
    if (user.role === ROLES.WORKSPACE_ADMIN) return true;

    // Определяем иерархию ролей
    type RoleHierarchy = {
      [K in ROLE]: ROLE[];
    };

    const roleHierarchy: RoleHierarchy = {
      [ROLES.USER]: [ROLES.USER],
      [ROLES.ADMIN]: [ROLES.USER, ROLES.ADMIN],
      [ROLES.PROJECT_ADMIN]: [ROLES.USER, ROLES.ADMIN, ROLES.PROJECT_ADMIN],
      [ROLES.WORKSPACE_ADMIN]: Object.values(ROLES),
    };

    // Проверяем, имеет ли текущая роль доступ к требуемой роли
    if (!roleHierarchy[user.role].includes(requiredRole)) {
      return false;
    }

    // Проверяем доступ к конкретному ресурсу для PROJECT_ADMIN
    if (requiredRole === ROLES.PROJECT_ADMIN && resourceId) {
      // Проверяем доступ к конкретному проекту
      return user.permissions?.projectIds?.includes(resourceId) ?? false;
    }

    return true;
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    isLoading,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Или ваш компонент загрузки
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
