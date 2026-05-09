import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { IndustryRequestType, OfficeRequestType } from "@/lib/enums";
import { z } from "zod";

// --- Reusable validations ---
const validations = {
  attachment: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
      message: `Max size is ${MAX_FILE_SIZE_MB}MB`,
    })
    .optional()
    .nullable(),
};

// --- Base Schema ---
const RequestBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  attachment: validations.attachment,
  academic_unit: z.coerce.number().int().positive("Invalid academic unit ID"),
});

export type RequestBase = z.infer<typeof RequestBaseSchema>;

// --- Create Schema ---
export const industryRequestCreateSchema = RequestBaseSchema.extend({
  type: z.enum(IndustryRequestType, {
    message: "Please select a request type",
  }),
});
export type IndustryRequestCreateInput = z.infer<
  typeof industryRequestCreateSchema
>;

export const officeRequestCreateSchema = RequestBaseSchema.extend({
  industry: z.coerce.number().int().positive("Invalid industry Id"),
  type: z.enum(OfficeRequestType, {
    message: "Please select a request type",
  }),
});

export type OfficeRequestCreateInput = z.infer<
  typeof officeRequestCreateSchema
>;

// --- Update Schema ---
export const industryRequestUpdateSchema = industryRequestCreateSchema
  .partial()
  .extend({
    attachment: validations.attachment,
  });
export type IndustryRequestUpdateInput = z.infer<
  typeof industryRequestUpdateSchema
>;

export const officeRequestUpdateSchema = officeRequestCreateSchema
  .partial()
  .extend({
    attachment: validations.attachment,
  });
export type OfficeRequestUpdateInput = z.infer<
  typeof officeRequestUpdateSchema
>;

export const requestDefaultValues = {
  title: "",
  description: "",
  type: undefined,
};
