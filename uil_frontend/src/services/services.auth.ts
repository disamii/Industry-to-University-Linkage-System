import apiServer from "@/lib/axios";
import { SigninResponse } from "@/types/interfaces.auth";
import { SigninInput } from "@/validation/validation.auth";

export const signin = async (data: SigninInput) => {
  try {
    const response = await apiServer.post<SigninResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });

    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    console.error("Signin failed:", error.message);
    return null;
  }
};

export const signupStaff = async () => {};

export const forgotPassword = async () => {};
