import { industryRequestBaseSchema } from "@/validation/validation.industry_requests";
import { z } from "zod";

export const industryRequestSchema = industryRequestBaseSchema.extend({
  id: z.string(),
  industry_id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullish(),
});

export type IndustryRequestResponse = z.infer<typeof industryRequestSchema>;
