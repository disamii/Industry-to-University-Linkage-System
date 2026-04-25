import { z } from "zod";

export const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SigninInput = z.infer<typeof signinSchema>;

export const checkStaffEmailSchema = z.object({
  email: z.string().email(),
});

export type CheckStaffEmailInput = z.infer<typeof checkStaffEmailSchema>;

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
