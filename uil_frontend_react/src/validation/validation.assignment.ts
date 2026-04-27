import { AssignmentStatus } from "@/lib/enums";
import { z } from "zod";

const assignmentBaseSchema = z.object({
  status: z.nativeEnum(AssignmentStatus),
  progress: z.string().default("0%"),
});

export const assignStaffSchema = z.object({
  request_id: z.string(),
  staff_id: z.string(),
  department_id: z.string().nullable().optional(),
});

export type AssignStaffInput = z.infer<typeof assignStaffSchema>;

export const assignmentUpdateSchema = assignmentBaseSchema.partial().extend({
  completed_at: z.string().datetime().nullable().optional(),
});

export type AssignmentUpdateInput = z.infer<typeof assignmentUpdateSchema>;
