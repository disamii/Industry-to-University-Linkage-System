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
import {
  Entity,
  IndustryRequestType,
  OfficeRequestType,
  UserRole,
} from "./enums";

export interface RequestHint {
  placeholder: string;
  helpText: string;
}

export const INDUSTRY_REQUEST_HINTS: Record<IndustryRequestType, RequestHint> =
  {
    [IndustryRequestType.RND]: {
      placeholder: "Detail the problem statement and required research area...",
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

export const OFFICE_REQUEST_HINTS: Record<OfficeRequestType, RequestHint> = {
  [OfficeRequestType.CURRICULUM_REVIEW]: {
    placeholder:
      "Enter course name, current syllabus details, and required industry expertise...",
    helpText:
      "Provide the course title and specify the industry role or expertise needed to validate the curriculum.",
  },

  [OfficeRequestType.INDUSTRIAL_VISIT]: {
    placeholder:
      "Specify number of visitors, preferred date/time, and target department...",
    helpText:
      "Include visitor count (students/staff), department of interest, and specific learning objectives for the visit.",
  },

  [OfficeRequestType.JOINT_RESEARCH]: {
    placeholder:
      "Describe the research topic, problem statement, and requested industry contribution...",
    helpText:
      "Define the research scope and clarify if you need data access, equipment usage, or funding.",
  },

  [OfficeRequestType.GUEST_LECTURE]: {
    placeholder:
      "Specify topic/module, student level, duration, and delivery mode...",
    helpText:
      "Detail the target audience (Undergrad/Postgrad), preferred date, and whether it is online or in-person.",
  },

  [OfficeRequestType.LAB_ACCESS]: {
    placeholder:
      "Specify equipment needed, purpose of use, and duration of access...",
    helpText:
      "State whether access is for research or teaching and if technical assistance is required.",
  },

  [OfficeRequestType.TECH_TRANSFER]: {
    placeholder:
      "Describe the patent/innovation, its TRL level, and proposed licensing model...",
    helpText:
      "Include the Technology Readiness Level and the intended commercial or academic licensing approach.",
  },

  [OfficeRequestType.WORKSHOP_CALL]: {
    placeholder:
      "Specify workshop theme, timeframe, and expected number of participants...",
    helpText:
      "Detail the workshop objectives, participation type, and planned schedule.",
  },

  [OfficeRequestType.CONFERENCE_CALL]: {
    placeholder:
      "Specify conference theme, timeframe, and participation details...",
    helpText:
      "Include key topics, target participant count, and the nature of the engagement.",
  },

  [OfficeRequestType.EXHIBITION_CALL]: {
    placeholder:
      "Specify exhibition theme, timeframe, and participation requirements...",
    helpText:
      "Outline the exhibition scope, required space or facilities, and expected audience.",
  },

  [OfficeRequestType.JOINT_COMMUNITY_ENGAGEMENT]: {
    placeholder:
      "Describe the proposed area, engagement type, and timeframe...",
    helpText:
      "Specify the target community, expected social impact, and duration of the project.",
  },

  [OfficeRequestType.OTHER]: {
    placeholder: "Provide detailed information about your office request...",
    helpText:
      "Include any specific requirements or context not covered by the standard categories.",
  },
};

export const mapEntity: Partial<
  Record<UserRole, { from: Entity; to: Entity }>
> = {
  [UserRole.INDUSTRY]: { from: Entity.INDUSTRY, to: Entity.ACADEMIC_UNIT },
  [UserRole.ADMIN]: { from: Entity.ACADEMIC_UNIT, to: Entity.INDUSTRY },
  [UserRole.STAFF]: { from: Entity.STAFF, to: Entity.INDUSTRY },
};
