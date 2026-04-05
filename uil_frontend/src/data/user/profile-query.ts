import { getMe } from "@/services/services.user";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () =>
  useQuery({ queryKey: ["user-profile"], queryFn: getMe });
