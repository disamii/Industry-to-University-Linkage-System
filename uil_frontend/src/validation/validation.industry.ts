import { IndustryType } from "@/lib/enums";
import { z } from "zod";

/*
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
export const industryCreateSchema = industryBaseSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type IndustryCreateInput = z.infer<typeof industryCreateSchema>;

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
*/

// Updated Base Schema
export const industryBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  industry_email: z.string().email("Invalid industry email address"), // Renamed to match Django model
  industry_type: z.nativeEnum(IndustryType),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().nullish(),
  contact_person_phone_number: z.string().nullish(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .nullish(),
  number_of_employees: z.number().int().nonnegative().nullish(),
  website: z.string().url("Invalid website URL").or(z.literal("")).nullish(),
});

// Updated Create Schema
export const industryCreateSchema = industryBaseSchema
  .extend({
    contact_full_name: z.string().min(1, "Contact person name is required"),
    contact_email: z.string().email("Invalid contact email"),
    contact_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.contact_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type IndustryCreateInput = z.infer<typeof industryCreateSchema>;

// --- Update Schema ---
export const industryUpdateSchema = industryBaseSchema
  // .omit({ email: true })
  .partial();

export type IndustryUpdateInput = z.infer<typeof industryUpdateSchema>;

// --- Default Values ---
export const industryDefaultValues: IndustryCreateInput = {
  name: "",
  industry_email: "",
  industry_type: IndustryType.IT,
  location: "",
  address: "",
  phone_number: "",
  description: "",
  number_of_employees: 0,
  website: "",

  contact_person_phone_number: "",
  contact_full_name: "",
  contact_email: "",
  contact_password: "",
  confirm_password: "",
};
