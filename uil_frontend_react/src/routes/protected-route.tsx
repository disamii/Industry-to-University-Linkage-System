import { SidebarProvider } from "@/contexts/sidebar-context";
import AdminLayout from "@/layouts/admin-layout";
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

  const rolePaths: Record<string, UserRole[]> = {
    "/dashboard/office": [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    "/dashboard/industry": [UserRole.INDUSTRY],
    "/dashboard/staff": [UserRole.STAFF],
  };

  for (const [path, requiredRoles] of Object.entries(rolePaths)) {
    if (pathname.startsWith(path)) {
      const hasPermission = roles.some((role) => requiredRoles.includes(role));

      if (!hasPermission) {
        return (
          <Navigate
            to={LINKS.unauthorized}
            state={{ from: location }}
            replace
          />
        );
      }
    }
  }

  return (
    <SidebarProvider>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
