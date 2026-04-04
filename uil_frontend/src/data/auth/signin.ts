import apiServer from "@/lib/axios.server";
import { SigninResponse } from "@/types/interfaces.auth";
import { SigninInput } from "@/validation/validation.auth";

export const signin = async (data: SigninInput) => {
  const response = await apiServer.post<SigninResponse>("/auth/login", data);

  return response;
};
