import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AppRoutes />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
