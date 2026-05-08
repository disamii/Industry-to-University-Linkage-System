import { UserRole } from "@/lib/enums";
import { useLocation } from "react-router-dom";

const ROLE_PATH_MAP: Record<string, UserRole> = {
  "/dashboard/office": UserRole.ADMIN,
  "/dashboard/industry": UserRole.INDUSTRY,
  "/dashboard/staff": UserRole.STAFF,
};

export const useGetRoleByPath = (): UserRole | "" => {
  const { pathname } = useLocation();

  const match = Object.entries(ROLE_PATH_MAP).find(([path]) =>
    pathname.startsWith(path),
  );

  return match ? match[1] : "";
};
