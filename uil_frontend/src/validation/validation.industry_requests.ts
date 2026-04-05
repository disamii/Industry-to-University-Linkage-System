import { RequestPriority, RequestStatus, RequestType } from "@/lib/enums";
import { z } from "zod";

// --- Base Schema ---
export const industryRequestBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullish(),
  type: z.nativeEnum(RequestType).default(RequestType.WORKSHOP),
  status: z.nativeEnum(RequestStatus).default(RequestStatus.PENDING),
  priority: z.nativeEnum(RequestPriority).default(RequestPriority.MEDIUM),
  budget_required: z.coerce.number().nullish(),
});

// --- Create Schema ---
export const industryRequestCreateSchema = industryRequestBaseSchema.extend({
  // industry_id: z.string().uuid("Invalid industry ID format"),
});

export type IndustryRequestCreateInput = z.infer<
  typeof industryRequestCreateSchema
>;

// --- Update Schema ---
export const industryRequestUpdateSchema = industryRequestBaseSchema.partial();

export type IndustryRequestUpdateInput = z.infer<
  typeof industryRequestUpdateSchema
>;
