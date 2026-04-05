import api from "@/lib/axios.server";
import { safeApiRequest } from "@/lib/axios.utils";
import { User } from "@/types/interfaces.user";

export const getMe = async () => safeApiRequest(api.get<User>("/users/me"));
