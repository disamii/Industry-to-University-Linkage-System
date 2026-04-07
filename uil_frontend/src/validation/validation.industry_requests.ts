import { RequestPriority, RequestStatus, RequestType } from "@/lib/enums";
import { z } from "zod";

// --- Base Schema ---
export const industryRequestBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  type: z.nativeEnum(RequestType),
  status: z.nativeEnum(RequestStatus),
  priority: z.nativeEnum(RequestPriority),
  budget_required: z.coerce.number().optional(),
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

export const industryRequestDefaultValues = {
  title: "",
  description: "",
  type: RequestType.WORKSHOP,
  status: RequestStatus.PENDING,
  priority: RequestPriority.MEDIUM,
  budget_required: 0,
};
