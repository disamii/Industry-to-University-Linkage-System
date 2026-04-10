import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { SigninResponse } from "@/types/interfaces.auth";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { authUrls } from "./urls";

export const signin = async (data: SigninInput) =>
  safeApiRequest(
    api.post<SigninResponse>(authUrls.signin(), signinSchema.parse(data)),
  );
