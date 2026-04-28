import { UserRole } from "@/lib/enums";
import { getAdminHomepageLink, getRoleByPath } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export const useNavigateHome = () => {
  const { pathname } = useLocation();
  const role = getRoleByPath(pathname);
  const to = role ? getAdminHomepageLink([role as UserRole]) : "/";

  return to;
};
