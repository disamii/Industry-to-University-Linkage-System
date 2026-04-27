import { LINKS } from "@/lib/constants";
import { UserRole } from "@/lib/enums";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();
  const pathname = location.pathname;

  // If the store hasn't loaded or credentials don't exist
  if (!accessToken || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  let roles = user.roles;

  if (roles.length === 0) {
    roles = [UserRole.STAFF];
  }

  const rolePaths: Record<string, UserRole> = {
    "/dashboard/office": UserRole.ADMIN,
    "/dashboard/industry": UserRole.INDUSTRY,
    "/dashboard/staff": UserRole.STAFF,
  };

  for (const [path, requiredRole] of Object.entries(rolePaths)) {
    if (pathname.startsWith(path) && !roles.includes(requiredRole)) {
      return (
        <Navigate to={LINKS.unauthorized} state={{ from: location }} replace />
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
