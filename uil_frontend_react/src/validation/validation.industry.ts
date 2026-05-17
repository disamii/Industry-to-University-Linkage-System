import { IndustryType } from "@/lib/enums";
import { z } from "zod";

// --- Reusable Fields ---
const industryFields = {
  name: z.string().min(1, "Name is required"),
  industry_email: z
    .email({ message: "Invalid industry email address" })
    .or(z.literal(""))
    .nullish(),
  industry_type: z.nativeEnum(IndustryType),
  location: z.string().min(1, "Location is required"),
  address: z.string().nullish(),
  phone_number: z.string().nullish(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .nullish(),
  number_of_employees: z.number().int().nonnegative().nullish(),
  website: z.string().url("Invalid website URL").or(z.literal("")).nullish(),
};

const contactPersonFields = {
  contact_person_phone_number: z.string().nullish(),
  contact_full_name: z.string().min(1, "Contact person name is required"),
  contact_email: z.string().email("Invalid contact email"),
};

const passwordFields = {
  contact_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(1, "Please confirm your password"),
};

// --- Base Schema ---
const industryBaseSchema = z.object({
  ...industryFields,
  ...contactPersonFields,
});

export type IndustryBase = z.infer<typeof industryBaseSchema>;

// --- Create Schema ---
export const industryCreateSchema = industryBaseSchema
  .extend(passwordFields)
  .refine((data) => data.contact_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type IndustryCreateInput = z.infer<typeof industryCreateSchema>;

// --- Update Schema ---
export const industryUpdateSchema = z.object(industryFields).partial();

export type IndustryUpdateInput = z.infer<typeof industryUpdateSchema>;

// --- Contact Person Update Schema ---
export const contactPersonUpdateSchema = z
  .object(contactPersonFields)
  .partial();

export type ContactPersonUpdateInput = z.infer<
  typeof contactPersonUpdateSchema
>;

// --- Contact Password Update Schema ---
export const contactPersonUpdatePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    ...passwordFields,
  })
  .refine((data) => data.contact_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ContactPersonUpdatePasswordInput = z.infer<
  typeof contactPersonUpdatePasswordSchema
>;

// --- Default Values ---
export const industryDefaultValues: IndustryCreateInput = {
  name: "",
  industry_type: IndustryType.IT,
  location: "",
  address: "",
  phone_number: "",
  description: "",
  number_of_employees: 0,
  website: "",

  industry_email: "",

  contact_person_phone_number: "",
  contact_full_name: "",
  contact_email: "",

  contact_password: "",
  confirm_password: "",
};
