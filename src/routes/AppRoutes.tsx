import {
  AnnotateRoute,
  BookingRoute,
  EditorRoute,
  MapPlacementRoute,
  ReviewRoute,
  SearchEmployeesRoute,
  SetupRoute,
  UserProfileRoute,
  ManagementRoute,
  BookingConfirmRoute,
} from "@/routes";
import { ROLES } from "@/types";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

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

      {/* Management Routes */}
      <Route
        path="/management"
        element={
          <ProtectedRoute requiredRole={ROLES.PROJECT_ADMIN}>
            <ManagementRoute />
          </ProtectedRoute>
        }
      />

      {/* User Routes (доступны всем ролям) */}
      <Route
        path="/booking/:officeNameId?"
        element={
          <ProtectedRoute requiredRole={ROLES.USER}>
            <BookingRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/profile"
        element={
          <ProtectedRoute requiredRole={ROLES.USER}>
            <UserProfileRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search/employees"
        element={
          <ProtectedRoute requiredRole={ROLES.USER}>
            <SearchEmployeesRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/confirm/:bookingId"
        element={<BookingConfirmRoute />}
      />

      {/* Default redirect */}
      <Route path="/*" element={<Navigate to="/booking" />} />
    </Routes>
  );
}
