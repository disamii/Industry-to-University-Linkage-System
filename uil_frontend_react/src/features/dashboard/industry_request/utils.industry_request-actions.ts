import { ActionType } from "@/lib/enums";
import {
  CheckCircle2,
  CheckSquare,
  FileText,
  Forward,
  LucideIcon,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldBan,
  UserCheck,
  XCircle,
} from "lucide-react";
import * as z from "zod";

export type ImplicitActionFormFields =
  | "id"
  | "type"
  | "from_entity"
  | "to_entity";

export type ExplicitActionFormFields =
  | "description"
  | "assigned_user"
  | "start_date"
  | "end_date"
  | "industry_mentor"
  | "target_unit"
  | "title"
  | "content"
  | "is_internal_only"
  | "expires_at"
  | "image";

export type ActionFormFields =
  | ImplicitActionFormFields
  | ExplicitActionFormFields;

export type FormFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "date"
    | "select"
    | "checkbox"
    | "file";
  validation?: (z: typeof import("zod")) => z.ZodTypeAny;
  isOptional?: boolean;
};

const fieldDefinitions: Record<
  ExplicitActionFormFields,
  Partial<FormFieldConfig>
> = {
  description: {
    label: "Description",
    type: "textarea",
    placeholder: "Provide additional details...",
    validation: (z) => z.string().min(5, "Description is too short"),
  },
  assigned_user: {
    label: "Assign To",
    type: "select",
    validation: (z) => z.coerce.number(),
  },
  start_date: {
    label: "Start Date",
    type: "date",
    validation: (z) => z.string().min(1, "Start date is required"),
  },
  end_date: {
    label: "End Date",
    type: "date",
    validation: (z) => z.string().min(1, "End date is required"),
  },
  industry_mentor: {
    label: "Industry Mentor",
    placeholder: "Enter Industry Mentor Full Name",
    validation: (z) => z.string().optional(),
    isOptional: true,
  },
  target_unit: {
    label: "Target Unit",
    type: "select",
    validation: (z) => z.coerce.number(),
  },
  title: {
    label: "Post Title",
    placeholder: "Enter a catchy title...",
    validation: (z) => z.string().min(3, "Title is required"),
  },
  content: {
    label: "Content",
    type: "textarea",
    placeholder: "Write the post content here...",
    validation: (z) => z.string().min(10, "Content is too short"),
  },
  is_internal_only: {
    label: "Internal Only",
    type: "checkbox",
    validation: (z) => z.coerce.boolean(),
  },
  expires_at: { label: "Expires At", type: "date" },
  image: {
    label: "Cover Image",
    type: "file",
    validation: (z) => z.any(),
  },
};

const FIELDS = Object.entries(fieldDefinitions).reduce(
  (acc, [key, config]) => {
    acc[key as ExplicitActionFormFields] = {
      name: key,
      label: config.label || key,
      placeholder: config.placeholder || "",
      type: config.type || "text",
      ...config,
    };
    return acc;
  },
  {} as Record<ExplicitActionFormFields, FormFieldConfig>,
);

const BASE_FIELDS = [FIELDS.description];

const ASSIGNMENT_FIELDS = [
  ...BASE_FIELDS,
  FIELDS.assigned_user,
  FIELDS.start_date,
  FIELDS.end_date,
  FIELDS.industry_mentor,
];

type ActionConfig = {
  label: string;
  Icon: LucideIcon;
  color: string;
  formFields: FormFieldConfig[];
};

export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  [ActionType.INITIATED]: {
    label: "Initiate Request",
    Icon: Plus,
    color: "bg-zinc-100 text-zinc-700", // Neutral starting point
    formFields: [...BASE_FIELDS],
  },
  [ActionType.ACCEPT_FORWARDED]: {
    label: "Accept Forward",
    Icon: CheckCircle2,
    color: "bg-teal-100 text-teal-700", // Distinct from green "Complete"
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REVOKED]: {
    label: "Revoke Assignment",
    Icon: ShieldBan,
    color: "bg-orange-100 text-orange-700", // Warning but not a "failure"
    formFields: [...BASE_FIELDS],
  },
  [ActionType.CANCELLED]: {
    label: "Cancel Request",
    Icon: XCircle,
    color: "bg-slate-200 text-slate-600", // Muted/Disabled look
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REJECTED]: {
    label: "Reject",
    Icon: XCircle,
    color: "bg-red-100 text-red-700", // Critical negative
    formFields: [...BASE_FIELDS],
  },
  [ActionType.COMPLETED]: {
    label: "Mark Complete",
    Icon: CheckSquare,
    color: "bg-emerald-100 text-emerald-700", // Success
    formFields: [...BASE_FIELDS],
  },
  [ActionType.ASSIGNED]: {
    label: "Assign User",
    Icon: UserCheck,
    color: "bg-blue-100 text-blue-700", // Primary action
    formFields: [...ASSIGNMENT_FIELDS],
  },
  [ActionType.REASSIGNED]: {
    label: "Reassign",
    Icon: RefreshCw,
    color: "bg-amber-100 text-amber-800", // Change/Attention
    formFields: [...ASSIGNMENT_FIELDS],
  },
  [ActionType.FORWARDED]: {
    label: "Forward",
    Icon: Forward,
    color: "bg-indigo-100 text-indigo-700", // Movement
    formFields: [...BASE_FIELDS, FIELDS.target_unit],
  },
  [ActionType.POSTED_AS_THEMATIC]: {
    label: "Post as Thematic",
    Icon: FileText,
    color: "bg-fuchsia-100 text-fuchsia-700", // Special highlight
    formFields: [
      ...BASE_FIELDS,
      FIELDS.title,
      FIELDS.content,
      FIELDS.is_internal_only,
      FIELDS.expires_at,
      FIELDS.image,
    ],
  },
  [ActionType.REPLIED]: {
    label: "Reply",
    Icon: MessageSquare,
    color: "bg-sky-100 text-sky-700",
    formFields: [...BASE_FIELDS],
  },
};
