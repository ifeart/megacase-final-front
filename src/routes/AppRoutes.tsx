import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ROLES } from "@/types";
import ProtectedRoute from "./ProtectedRoute";
import {
  AnnotateRoute,
  BookingRoute,
  EditorRoute,
  MapPlacementRoute,
  ReviewRoute,
  SetupRoute,
} from "@/routes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Workspace Admin Only */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute requiredRole={ROLES.WORKSPACE_ADMIN}>
            <SetupRoute />
          </ProtectedRoute>
        }
      />

      {/* Project Admin Routes */}
      <Route
        path="/editor/:spaceId"
        element={
          <ProtectedRoute
            requiredRole={ROLES.PROJECT_ADMIN}
            resourceId={useParams().spaceId}
          >
            <EditorRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/annotate/:spaceId"
        element={
          <ProtectedRoute
            requiredRole={ROLES.PROJECT_ADMIN}
            resourceId={useParams().spaceId}
          >
            <AnnotateRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/review/:spaceId"
        element={
          <ProtectedRoute
            requiredRole={ROLES.PROJECT_ADMIN}
            resourceId={useParams().spaceId}
          >
            <ReviewRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map-placement/:spaceId"
        element={
          <ProtectedRoute
            requiredRole={ROLES.PROJECT_ADMIN}
            resourceId={useParams().spaceId}
          >
            <MapPlacementRoute />
          </ProtectedRoute>
        }
      />

      {/* User Routes (доступны всем ролям) */}
      <Route
        path="/booking/:spaceId?"
        element={
          <ProtectedRoute requiredRole={ROLES.USER}>
            <BookingRoute />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/*" element={<Navigate to="/booking" />} />
    </Routes>
  );
}
