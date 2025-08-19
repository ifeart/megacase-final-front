import { ROLES, type User } from '@/types';

const STORAGE_KEYS = {
  USER: 'user_data',
  AUTH_TOKEN: 'auth_token',
} as const;

// Mock users for testing
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John User',
    email: 'user@example.com',
    role: ROLES.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Admin Smith',
    email: 'admin@example.com',
    role: ROLES.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
  {
    id: '3',
    name: 'Project Manager',
    email: 'pm@example.com',
    role: ROLES.PROJECT_ADMIN,
    permissions: {
      projectIds: ['project1', 'project2'],
      workspaceIds: ['workspace1'],
    },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Project',
  },
  {
    id: '4',
    name: 'Workspace Admin',
    email: 'ws@example.com',
    role: ROLES.WORKSPACE_ADMIN,
    permissions: {
      projectIds: ['*'],
      workspaceIds: ['*'],
    },
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Workspace',
  },
];

class UserStorageService {
  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Mock authentication function
  authenticateUser(email: string, password: string): User | null {
    // В реальном приложении здесь был бы API запрос
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      this.setUser(user);
      return user;
    }
    return null;
  }

  clearStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}

export const userStorage = new UserStorageService();