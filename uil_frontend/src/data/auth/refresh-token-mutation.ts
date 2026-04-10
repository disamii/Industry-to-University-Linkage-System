import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { SigninResponse } from "@/types/interfaces.auth";
import {
  RefreshTokenInput,
  refreshTokenSchema,
} from "@/validation/validation.auth";
import { authUrls } from "./urls";

export const getRefreshToken = async (data: RefreshTokenInput) =>
  safeApiRequest(
    api.post<SigninResponse>(
      authUrls.refreshToken(),
      refreshTokenSchema.parse(data),
    ),
  );
