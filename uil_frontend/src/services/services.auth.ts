import api, { safeApiRequest } from "@/lib/axios";
import { SigninResponse } from "@/types/interfaces.auth";
import { Industry } from "@/types/interfaces.industry";
import { CreateIndustryInput, SigninInput } from "@/validation/validation.auth";

export const signin = async (data: SigninInput) =>
  safeApiRequest(
    api.post<SigninResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    }),
  );

export const createIndustry = async (
  data: CreateIndustryInput,
): Promise<Industry> =>
  safeApiRequest(
    api.post<Industry>("/industry/register/", {
      email: data.email,
      password: data.password,
      name: data.name,
    }),
  );

export const signupStaff = async () => {};

export const forgotPassword = async () => {};
