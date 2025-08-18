import { Routes, Route, Navigate } from "react-router-dom";
import SetupRoute from "../pages/SetupRoute";
import EditorRoute from "../pages/EditorRoute.tsx";
import AnnotateRoute from "../pages/AnnotateRoute";
import ReviewRoute from "../pages/ReviewRoute";
import MapPlacementRoute from "../pages/MapPlacementRoute";
import BookingRoute from "../pages/BookingRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupRoute />} />
      <Route path="/editor/:spaceId" element={<EditorRoute />} />
      <Route path="/annotate/:spaceId" element={<AnnotateRoute />} />
      <Route path="/review/:spaceId" element={<ReviewRoute />} />
      <Route path="/map-placement/:spaceId" element={<MapPlacementRoute />} />
      <Route path="/booking/:spaceId?" element={<BookingRoute />} />
      <Route path="/*" element={<Navigate to="/booking" />} />
    </Routes>
  );
}
