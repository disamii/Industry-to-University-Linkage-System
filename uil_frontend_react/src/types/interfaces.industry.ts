import { z } from "zod";
import { industryBaseSchema } from "@/validation/validation.industry";

export const industrySchema = industryBaseSchema.extend({
  id: z.string(),
  status: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullish(),
});

export type IndustryResponse = z.infer<typeof industrySchema>;
