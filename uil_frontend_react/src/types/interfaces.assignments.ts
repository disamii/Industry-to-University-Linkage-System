import { assignmentCreateSchema } from "@/validation/validation.assignment";
import { z } from "zod";
import { industryRequestSchemaForAdmin } from "./interfaces.industry_requests";

export const assignmentSchema = assignmentCreateSchema.extend({
  id: z.string(),
  progress: z.string().optional(),
  request: industryRequestSchemaForAdmin,
  assigned_at: z.coerce.date().nullish(),
  completed_at: z.coerce.date().nullish(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullish(),
});

export type AssignmentResponse = z.infer<typeof assignmentSchema>;
