import { useLocation, Link, useNavigate } from "react-router-dom";
import { userStorage } from "@/services/storageUser";
import { ROLES } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function InternalHeader() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const canGoBack = loc.pathname !== "/setup";

  const isAdmin =
    userStorage.getUser()?.role === ROLES.ADMIN ||
    userStorage.getUser()?.role === ROLES.PROJECT_ADMIN ||
    userStorage.getUser()?.role === ROLES.WORKSPACE_ADMIN;

  const handleGoBack = () => {
    if (loc.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 glass-panel">
      <div className="h-full mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          {canGoBack && (
            <button
              onClick={handleGoBack}
              className="text-[16px] cursor-pointer text-gray-700 hover:text-[#1daff7] transition-colors duration-300"
            >
              ← Назад
            </button>
          )}
          <Link to="/" className="flex items-center gap-4">
            <svg
              width="82"
              height="32"
              viewBox="0 0 82 32"
              fill="none"
              className="bg-transparent transition-all duration-300 hover:scale-105"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M72.8093 6.35938H53.6667V10.5987H61.1186V25.5731H65.3573V10.5987H72.8093V6.35938Z"
                fill="black"
              />
              <path
                d="M81.2094 6.29425H76.8333V10.6019V25.5763H81.2094V6.29425Z"
                fill="black"
              />
              <path
                d="M19.2051 12.7863H31.9212V19.2821H19.2051V32H12.7786V19.2137H0.0625V12.7179H12.7786V0H19.2051V12.7863ZM38.3476 0V32H44.7741V0H38.3476Z"
                fill="#1DAFF7"
                className="transition-fill duration-300 hover:fill-[#0f8cd4]"
              />
            </svg>
            <span className="text-gray-300 select-none">|</span>
            <span className="text-[25px] font-medium text-black hover:text-[#1daff7] transition-colors duration-300">
              OFFICE SPACE
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-8">
          <Link
            to="/booking"
            className="text-[16px] underline-hover text-gray-600 cursor-pointer"
          >
            Забронировать
          </Link>
          <span className="text-gray-300 select-none">///</span>
          <Link
            to="/search/employees"
            className="text-[16px] underline-hover text-gray-600 cursor-pointer"
          >
            Поиск
          </Link>
          <span className="text-gray-300 select-none">///</span>
          {isAdmin && (
            <>
              <Link
                to="/setap"
                className="text-[16px] underline-hover text-gray-600 cursor-pointer"
              >
                Управление
              </Link>
              <span className="text-gray-300 select-none">///</span>
            </>
          )}
          <Link
            to="/user/profile"
            className="text-[16px] underline-hover text-gray-600 cursor-pointer"
          >
            Профиль
          </Link>
          <span className="text-gray-300 select-none">///</span>
          <button
            onClick={() => logout()}
            className="text-[16px] underline-hover text-gray-600 cursor-pointer flex items-center gap-2"
          >
            <span className="text-[#1daff7] text-[24px]">←</span>Выйти
          </button>
        </nav>
      </div>
    </header>
  );
}
