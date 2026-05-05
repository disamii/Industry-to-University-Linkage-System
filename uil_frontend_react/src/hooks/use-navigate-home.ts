import { getAdminHomepageLink } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export const useNavigateHome = () => {
  const { user } = useAuthStore();
  const to = user ? getAdminHomepageLink(user.roles) : "/";

  return to;
};
