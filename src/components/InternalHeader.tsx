import { useLocation, Link, useNavigate } from "react-router-dom";

export default function InternalHeader() {
  const loc = useLocation();
  const navigate = useNavigate();
  const canGoBack = loc.pathname !== "/setup";

  const handleGoBack = () => {
    if (loc.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 h-16 z-50 glass-panel">
      <div className="h-full mx-auto max-w-7xl px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {canGoBack && (
            <button
              onClick={handleGoBack}
              className="text-[16px] cursor-pointer text-gray-700 hover:text-[#1daff7] transition-colors duration-300"
            >
              ← Назад
            </button>
          )}

          <Link
            to="/"
            className="text-[25px] font-medium text-black hover:text-[#1daff7] transition-colors duration-300"
          >
            Office Space
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
            to="/setup"
            className="text-[16px] underline-hover text-gray-600 cursor-pointer"
          >
            Управление
          </Link>
          <span className="text-gray-300 select-none">///</span>
          <Link
            to="/profile"
            className="text-[16px] underline-hover text-gray-600 cursor-pointer"
          >
            Профиль
          </Link>
        </nav>
      </div>
    </header>
  );
}
