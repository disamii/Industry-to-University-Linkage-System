import { z } from "zod";

export const signinSchema = z.object({
  username: z.string().min(1, "Username is Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SigninInput = z.infer<typeof signinSchema>;

export const checkStaffEmailSchema = z.object({
  email: z.email({ message: "Invalid email adress" }),
});

export type CheckStaffEmailInput = z.infer<typeof checkStaffEmailSchema>;

// --- Update User Account ---
export const userAccountUpdateSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email({ message: "Invalid email address" }),
    first_name: z.string().nullish(),
    father_name: z.string().nullish(),
    grand_father_name: z.string().nullish(),
    academic_unit: z.number().nullish(),
  })
  .partial();

export type UserAccountUpdateInput = z.infer<typeof userAccountUpdateSchema>;

// --- Update User Password ---
export const userUpdatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type UserUpdatePasswordInput = z.infer<typeof userUpdatePasswordSchema>;
