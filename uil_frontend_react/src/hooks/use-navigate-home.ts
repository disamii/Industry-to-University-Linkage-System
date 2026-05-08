import { getAdminHomepageLink } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";

export const useNavigateHome = () => {
  const { user } = useAuthStore();
  const to = user ? getAdminHomepageLink(user.roles) : "/";

  return to;
};
