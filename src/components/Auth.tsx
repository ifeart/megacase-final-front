import React, { useState } from "react";
import { ROLES, type User } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface AuthProps {
  isVisible: boolean;
  onClose?: () => void;
  onAuthComplete?: () => void;
}

type AuthMode = "login" | "register" | "role-select";
type UserRole = keyof typeof ROLES;

interface FormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const Auth: React.FC<AuthProps> = ({ isVisible, onClose, onAuthComplete }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Очищаем ошибку при изменении данных
  };

  const handleLoginSubmit = async () => {
    try {
      const result = await login(formData.email, formData.password);
      if (result) {
        onAuthComplete?.();
      } else {
        setError("Неверный email или пароль");
      }
    } catch (error) {
      setError("Ошибка при входе");
    }
  };

  const handleRegisterComplete = () => {
    // Создаем нового пользователя
    const newUser: User = {
      id: Date.now().toString(), // В реальном приложении ID будет генерироваться на бэкенде
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      role: selectedRole as UserRole,
      permissions: {
        projectIds: [],
        workspaceIds: [],
      },
    };

    // Сохраняем пользователя в localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem("registered_users") || "[]"
    );
    localStorage.setItem(
      "registered_users",
      JSON.stringify([...existingUsers, newUser])
    );

    // Автоматически логиним нового пользователя
    login(formData.email, formData.password).then(() => {
      onAuthComplete?.();
    });
  };

  const roles = [
    {
      id: ROLES.USER,
      title: "User",
      subtitle: "Обычный пользователь",
      description: "Может просматривать и бронировать пространства",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      id: ROLES.ADMIN,
      title: "Admin",
      subtitle: "Администратор",
      description:
        "Может управлять чужими пространствами, отменять и создавать брони",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      id: ROLES.PROJECT_ADMIN,
      title: "Project Admin",
      subtitle: "Администратор проекта",
      description: "Может редактировать карты конкретных офисов",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      id: ROLES.WORKSPACE_ADMIN,
      title: "Workspace Admin",
      subtitle: "Администратор пространства",
      description:
        "Может управлять любым офисом, имеет полный контроль над пространством",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
    },
  ];

  const renderLogin = () => (
    <div className="w-full max-w-[400px] space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-['PPRader'] text-[36px] text-black tracking-tight">
          Приветствуем снова
        </h2>
        <p className="font-['PPRader'] text-[14px] text-gray-500">
          Авторизуйтесь, используя корпоративный аккаунт
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginSubmit();
        }}
      >
        <div className="space-y-2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
          />
        </div>
        <div className="space-y-2">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Пароль"
            className="w-full px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div className="space-y-4">
        <button
          onClick={handleLoginSubmit}
          className="w-full py-4 bg-black text-white font-['PPRader'] text-[16px] hover:bg-[#1daff7] transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          Войти
        </button>

        {/* <p className="text-center font-['PPRader'] text-[14px] text-gray-500">
          Нет аккаунта?{" "}
          <button
            onClick={() => setAuthMode("register")}
            className="text-[#1daff7] hover:underline"
          >
            Создать новый
          </button> */}
        {/* </p> */}
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="w-full max-w-[400px] space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-['PPRader'] text-[36px] text-black tracking-tight">
          Присоединяйтесь
        </h2>
        <p className="font-['PPRader'] text-[16px] text-gray-500">
          Создайте новый аккаунт
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setAuthMode("role-select");
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Имя"
            className="px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Фамилия"
            className="px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
          />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Пароль"
          className="w-full px-0 py-4 font-['PPRader'] text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div className="space-y-4">
        <button
          onClick={() => setAuthMode("role-select")}
          disabled={
            !formData.email || !formData.password || !formData.firstName
          }
          className="w-full py-4 bg-black text-white font-['PPRader'] text-[16px] hover:bg-[#1daff7] transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Продолжить
        </button>

        <p className="text-center font-['PPRader'] text-[14px] text-gray-500">
          Уже есть аккаунт?{" "}
          <button
            onClick={() => setAuthMode("login")}
            className="text-[#1daff7] hover:underline"
          >
            Войти
          </button>
        </p>
      </div>
    </div>
  );

  const renderRoleSelect = () => (
    <div className="w-full max-w-[600px] space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-['PPRader'] text-[36px] text-black tracking-tight">
          Выберите вашу роль
        </h2>
        <p className="font-['PPRader'] text-[16px] text-gray-500">
          Выберите уровень доступа, который подходит вам лучше всего
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`p-6 border-2 cursor-pointer transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg ${
              selectedRole === role.id
                ? `${role.color} border-[#1daff7] shadow-md`
                : `${role.color} hover:shadow-md`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-['PPRader'] text-[20px] text-black">
                    {role.title}
                  </h3>
                  <span className="font-['PPRader'] text-[14px] text-gray-500">
                    {role.subtitle}
                  </span>
                </div>
                <p className="font-['PPRader'] text-[14px] text-gray-600 max-w-[400px]">
                  {role.description}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                  selectedRole === role.id
                    ? "bg-[#1daff7] border-[#1daff7]"
                    : "border-gray-300"
                }`}
              >
                {selectedRole === role.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setAuthMode("register")}
          className="flex-1 py-4 border border-gray-300 text-gray-700 font-['PPRader'] text-[16px] hover:border-gray-400 transition-all duration-300"
        >
          Назад
        </button>
        <button
          onClick={handleRegisterComplete}
          disabled={!selectedRole}
          className="flex-1 py-4 bg-black text-white font-['PPRader'] text-[16px] hover:bg-[#1daff7] transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Создать аккаунт
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white z-[100] transition-all duration-300 ease-in-out ${
        isVisible ? "w-full" : "w-0"
      } overflow-hidden`}
    >
      <button
        onClick={onClose}
        className="absolute top-10 right-26 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors duration-300 z-10"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="w-full h-full flex items-center justify-center p-8">
        {authMode === "login" && renderLogin()}
        {authMode === "register" && renderRegister()}
        {authMode === "role-select" && renderRoleSelect()}
      </div>
    </div>
  );
};

export default Auth;
