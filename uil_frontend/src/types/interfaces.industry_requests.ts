import { industryRequestBaseSchema } from "@/validation/validation.industry_requests";
import { z } from "zod";
import { industrySchema } from "./interfaces.industry";

export const industryRequestSchema = industryRequestBaseSchema.extend({
  id: z.string(),
  industry_id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullish(),
});

export type IndustryRequestResponse = z.infer<typeof industryRequestSchema>;

export const industryRequestSchemaForAdmin = industryRequestSchema.extend({
  industry: z.optional(industrySchema),
});

export type IndustryRequestResponseForAdmin = z.infer<
  typeof industryRequestSchemaForAdmin
>;
