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
    first_name: z.string().min(1, "First name is required"),
    father_name: z.string().min(1, "Father name is required"),
    grand_father_name: z.string().min(1, "Grand father name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email({ message: "Invalid email address" }),
    academic_unit: z.number().min(1, "Academic unit is required"),
  })
  .partial();

export type UserAccountUpdateInput = z.infer<typeof userAccountUpdateSchema>;

// --- Update User Password ---
export const userUpdatePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    contact_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.contact_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type UserUpdatePasswordInput = z.infer<typeof userUpdatePasswordSchema>;
