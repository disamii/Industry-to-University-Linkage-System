import { MAX_FILE_SIZE_MB } from "@/lib/constants";
import { ActionType } from "@/lib/enums";
import {
  CheckCircle2,
  CheckSquare,
  CornerUpLeft,
  FileText,
  Forward,
  LucideIcon,
  MessageSquare,
  Plus,
  Rocket,
  UserCheck,
  XCircle,
} from "lucide-react";
import * as z from "zod";

export type ImplicitActionFormFields =
  | "id"
  | "type"
  | "from_entity"
  | "to_entity"
  | "actionToPerform"; // to alter/create action

export type ExplicitActionFormFields =
  | "description"
  | "assigned_users"
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
  assigned_users: {
    label: "Assign Experts",
    type: "select",
    validation: (z) =>
      z.array(z.coerce.number()).min(1, "Please select at least one item"),
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
  expires_at: { label: "Expires At", type: "date" },
  is_internal_only: {
    label: "Internal Only",
    type: "checkbox",
    validation: (z) => z.coerce.boolean(),
  },
  image: {
    label: "Cover Image",
    type: "file",
    validation: (z) =>
      z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          {
            message: "Only JPG, PNG, or WEBP images are allowed",
          },
        )
        .refine((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
          message: `Max size is ${MAX_FILE_SIZE_MB}MB`,
        })
        .optional()
        .nullable(),
    isOptional: true,
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
  FIELDS.assigned_users,
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

const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  [ActionType.INITIATED]: {
    label: "Initiate Request",
    Icon: Plus,
    color: "bg-zinc-100 text-zinc-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.ACCEPT_FORWARDED]: {
    label: "Accept Forward",
    Icon: CheckCircle2,
    color: "bg-teal-100 text-teal-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.CANCELLED]: {
    label: "Cancel Request",
    Icon: XCircle,
    color: "bg-slate-200 text-slate-600",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REJECTED]: {
    label: "Reject",
    Icon: XCircle,
    color: "bg-red-100 text-red-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.REVERTED]: {
    label: "Revert",
    Icon: CornerUpLeft,
    color: "bg-orange-100 text-orange-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.COMPLETED]: {
    label: "Mark Complete",
    Icon: CheckSquare,
    color: "bg-emerald-100 text-emerald-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.ASSIGNED]: {
    label: "Assign Expert",
    Icon: UserCheck,
    color: "bg-blue-100 text-blue-700",
    formFields: [...ASSIGNMENT_FIELDS],
  },
  [ActionType.FORWARDED]: {
    label: "Forward",
    Icon: Forward,
    color: "bg-indigo-100 text-indigo-700",
    formFields: [...BASE_FIELDS, FIELDS.target_unit],
  },
  [ActionType.POSTED_AS_THEMATIC]: {
    label: "Post as Thematic",
    color: "bg-fuchsia-100 text-fuchsia-700",
    Icon: FileText,
    formFields: [
      ...BASE_FIELDS,
      FIELDS.title,
      FIELDS.content,
      FIELDS.expires_at,
      // FIELDS.is_internal_only,
      FIELDS.image,
    ],
  },
  [ActionType.REPLIED]: {
    label: "Reply",
    Icon: MessageSquare,
    color: "bg-sky-100 text-sky-700",
    formFields: [...BASE_FIELDS],
  },
  [ActionType.PROMOTED_TO_PROJECT]: {
    label: "Promote to Project",
    Icon: Rocket,
    color: "bg-amber-100 text-amber-800",
    formFields: [...BASE_FIELDS],
  },
};

export const getActionTypeConfig = (val?: ActionType | null) => {
  if (!val || (val && !Object.values(ActionType).includes(val))) return null;

  return ACTION_CONFIG[val as ActionType];
};

export const formatRevertDescription = (description: string) => {
  const parts = description.split(" | ");

  // Extract parts and remove the "KEY: " prefix
  const actionName = parts[0] || "";
  const revertedFrom = (parts[1]?.replace("REVERTED FROM: ", "") ||
    "") as ActionType;
  const note = parts[2]?.replace("NOTE: ", "") || "";

  return {
    actionName,
    revertedFrom,
    note,
  };
};
