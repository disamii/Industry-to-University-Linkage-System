import { z } from "zod";

// --- Base Schema ---
export const industryBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contact_person: z.string().nullish(),
  phone: z.string().nullish(),
  industry_type: z.string().nullish(),
  efficiency_level: z.string().nullish(),
  address: z.string().nullish(),
  website: z.string().url("Invalid website URL").or(z.literal("")).nullish(),
});

// --- Create Schema ---
export const industryCreateSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type IndustryCreateInput = z.infer<typeof industryCreateSchema>;

// --- Update Schema ---
export const industryUpdateSchema = industryBaseSchema
  .omit({ email: true })
  .partial();

export type IndustryUpdateInput = z.infer<typeof industryUpdateSchema>;

// --- Default Values ---
export const industryDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  contact_person: "",
  phone: "",
  industry_type: "",
  efficiency_level: "",
  address: "",
  website: "",
};
