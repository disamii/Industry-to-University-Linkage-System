import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { SigninResponse } from "@/types/interfaces.auth";
import { SigninInput, signinSchema } from "@/validation/validation.auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authUrls } from "./urls";

export const signin = async (data: SigninInput) =>
  safeApiRequest(
    api.post<SigninResponse>(authUrls.signin(), signinSchema.parse(data)),
  );

export const useSignin = () =>
  useMutation({
    mutationFn: signin,
    onError: (error) => toast.error(error.message || "Unable to signin"),
  });
