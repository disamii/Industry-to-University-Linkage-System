/**
 * Utility
 */
import { ComponentVariant, StatCardKeys } from "@/types/interfaces";

export const variantContainers: Record<ComponentVariant, string> = {
  small: "p-2 text-sm",
  inline: "p-4 text-base",
  section: "p-12 border rounded-xl my-4",
  page: "min-h-[70vh] flex flex-col justify-center p-6",
};

export const colorVariants: Record<StatCardKeys, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  danger: "bg-rose-100 text-rose-700",
  primary: "bg-violet-100 text-violet-700",
  secondary: "bg-slate-100 text-slate-700",
  tertiary: "bg-yellow-100 text-yellow-700",
};

/**
 * Industry Request
 */
import { Entity, IndustryRequestType, UserRole } from "./enums";

export interface RequestHint {
  placeholder: string;
  helpText: string;
}

export const INDUSTRY_REQUEST_HINTS: Record<
  IndustryRequestType,
  RequestHint
> = {
  [IndustryRequestType.RND]: {
    placeholder:
      "Detail the problem statement and required research area...",
    helpText:
      "Specify the research objectives, expected outcomes, and collaboration scope.",
  },

  [IndustryRequestType.TECH_SUPPORT]: {
    placeholder:
      "Specify the type of technology required and the duration needed...",
    helpText:
      "Include technical requirements, expected usage period, and support expectations.",
  },

  [IndustryRequestType.CONSULTANCY]: {
    placeholder:
      "Describe the consultancy or technical advisory service required...",
    helpText:
      "Specify the expertise needed, scope of work, and expected deliverables.",
  },

  [IndustryRequestType.TESTING]: {
    placeholder:
      "Specify the item, product, or service to be tested and the required test type...",
    helpText:
      "Include testing standards, certification requirements, or quality expectations if applicable.",
  },

  [IndustryRequestType.TRAINING]: {
    placeholder:
      "Specify the training type, number of trainees, and trainee level...",
    helpText:
      "Define the training objectives, target participants, and expected skills development.",
  },

  [IndustryRequestType.INTERNSHIP]: {
    placeholder:
      "Specify the field of study, number of students, internship duration, and assigned activities...",
    helpText:
      "Include required student qualifications, internship timeframe, and department or section assignment.",
  },

  [IndustryRequestType.EXTERNSHIP]: {
    placeholder:
      "Specify the field of study, number of lecturer or researcher, externship duration, and assigned activities...",
    helpText:
      "Include required lecturer qualifications, internship timeframe, and department or section assignment.",
  },
  [IndustryRequestType.RECRUITMENT]: {
    placeholder:
      "Specify the field of study, graduate year, general requirements, and number of recruits...",
    helpText:
      "Include recruitment criteria, preferred qualifications, and expected hiring timeline.",
  },

  [IndustryRequestType.OTHER]: {
    placeholder: "Provide detailed information about your request...",
    helpText:
      "Include any additional requirements or relevant information related to the request.",
  },
};

export const mapEntity: Partial<
  Record<UserRole, { from: Entity; to: Entity }>
> = {
  [UserRole.INDUSTRY]: { from: Entity.INDUSTRY, to: Entity.ACADEMIC_UNIT },
  [UserRole.ADMIN]: { from: Entity.ACADEMIC_UNIT, to: Entity.INDUSTRY },
  [UserRole.STAFF]: { from: Entity.STAFF, to: Entity.INDUSTRY },
};
