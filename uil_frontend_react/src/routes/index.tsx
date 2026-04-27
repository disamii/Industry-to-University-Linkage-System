import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts & Guards
import AuthLayout from "@/layouts/auth-layout";
import MainLayout from "@/layouts/main-layout";
import ProtectedRoute from "./protected-route";

// Route Modules
import { publicRoutes } from "./public-routes";
import { authRoutes } from "./auth-routes";
import { officeRoutes } from "./office-routes";
import { industryRoutes } from "./industry-routes";
import { staffRoutes } from "./staff-routes";
import { LINKS } from "@/lib/constants";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // 1. Public Routes
      ...publicRoutes,

      // 2. Auth Routes
      {
        element: <AuthLayout />,
        children: authRoutes,
      },

      // 3. Private Routes (Guarded)
      {
        element: <ProtectedRoute />,
        children: [...staffRoutes, ...officeRoutes, ...industryRoutes],
      },

      // 4. Catch-all 404
      { path: "*", element: <Navigate to={LINKS.not_found} replace /> },
    ],
  },
]);
