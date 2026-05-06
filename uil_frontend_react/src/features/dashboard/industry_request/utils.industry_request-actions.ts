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
  ShieldMinus,
  UserCheck,
  XCircle,
  XIcon,
} from "lucide-react";
import * as z from "zod";

export type ActionFormFields =
  | "id"
  | "type"
  | "description"
  | "assigned_user"
  | "start_date"
  | "end_date"
  | "industry_mentor"
  | "from_unit"
  | "to_unit"
  | "from_industry"
  | "to_industry"
  | "title"
  | "content"
  | "is_internal_only"
  | "expires_at"
  | "image";

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
  hidden?: boolean;
  isOptional?: boolean;
};

const fieldDefinitions: Record<ActionFormFields, Partial<FormFieldConfig>> = {
  id: {
    validation: (z) => z.number(),
    hidden: true,
  },
  type: {
    validation: (z) =>
      z.enum(
        ActionType,
        `Action should be one of ${Object.values(ActionType).join(",")}`,
      ),
    hidden: true,
  },
  description: {
    label: "Description",
    type: "textarea",
    placeholder: "Provide additional details...",
    validation: (z) => z.string().min(5, "Description is too short"),
  },
  assigned_user: {
    label: "Assign To",
    type: "select",
    validation: (z) => z.string().min(1, "Please select a user"),
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
  from_unit: { label: "From Unit", type: "select" },
  to_unit: { label: "To Unit", type: "select" },
  from_industry: {
    label: "From Industry",
    type: "select",
  },
  to_industry: {
    label: "To Industry",
    type: "select",
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
    validation: (z) => z.boolean(),
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
    acc[key as ActionFormFields] = {
      name: key,
      label: config.label || key,
      placeholder: config.placeholder || "",
      type: config.type || "text",
      ...config,
    };
    return acc;
  },
  {} as Record<ActionFormFields, FormFieldConfig>,
);

const BASE_FIELDS = [FIELDS.id, FIELDS.type, FIELDS.description];

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
    color: "bg-zinc-100 text-zinc-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.ACCEPT_FORWARDED]: {
    label: "Accept Forward",
    Icon: CheckCircle2,
    color: "bg-cyan-100 text-cyan-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REVOKED]: {
    label: "Revoke Assignment",
    Icon: ShieldMinus,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.CANCELLED]: {
    label: "Cancel Request",
    Icon: XIcon,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REJECTED]: {
    label: "Reject",
    Icon: XCircle,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.COMPLETED]: {
    label: "Mark Complete",
    Icon: CheckSquare,
    color: "bg-emerald-100 text-emerald-700",
    formFields: [...BASE_FIELDS],
  },

  [ActionType.ASSIGNED]: {
    label: "Assign User",
    Icon: UserCheck,
    color: "bg-blue-100 text-blue-700",
    formFields: [...ASSIGNMENT_FIELDS],
  },
  [ActionType.REASSIGNED]: {
    label: "Reassign",
    Icon: RefreshCw,
    color: "bg-amber-100 text-amber-800",
    formFields: [...ASSIGNMENT_FIELDS],
  },

  [ActionType.FORWARDED]: {
    label: "Forward",
    Icon: Forward,
    color: "bg-indigo-100 text-indigo-700",
    formFields: [...BASE_FIELDS, FIELDS.to_unit],
  },
  [ActionType.POSTED_AS_THEMATIC]: {
    label: "Post as Thematic",
    Icon: FileText,
    color: "bg-fuchsia-100 text-fuchsia-700",
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
    color: "bg-lime-100 text-lime-700",
    formFields: [
      ...BASE_FIELDS,
      FIELDS.from_unit,
      FIELDS.to_unit,
      FIELDS.from_industry,
      FIELDS.to_industry,
    ],
  },
};
