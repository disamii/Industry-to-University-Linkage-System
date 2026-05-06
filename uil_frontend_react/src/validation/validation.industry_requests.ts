import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { IndustryRequestType } from "@/lib/enums";
import { z } from "zod";

// --- Base Schema ---
export const industryRequestBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  academic_unit: z.number().int().positive("Invalid organizational unit ID"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(IndustryRequestType, {
    error_Map: () => ({ message: "Please select a request type" }),
  }),
  attachment: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
      message: `Max size is ${MAX_FILE_SIZE_MB}MB`,
    })
    .optional()
    .nullable(),
});

export type IndustryRequestBase = z.infer<typeof industryRequestBaseSchema>;

// --- Create Schema ---
export const industryRequestCreateSchema = industryRequestBaseSchema.extend({});

export type IndustryRequestCreateInput = z.infer<
  typeof industryRequestCreateSchema
>;

// --- Update Schema ---
export const industryRequestUpdateSchema = industryRequestCreateSchema
  .partial()
  .extend({
    attachment: z
      .union([
        z.string(),
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
            message: "Max size exceeded",
          }),
      ])
      .optional()
      .nullable(),
  });

export type IndustryRequestUpdateInput = z.infer<
  typeof industryRequestUpdateSchema
>;

export const industryRequestDefaultValues = {
  title: "",
  description: "",
  type: undefined, // Ensure type is undefined initially to trigger the disabled state
};
