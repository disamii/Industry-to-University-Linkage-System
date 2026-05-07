/**
 * Utility
 */
import { ComponentVariant } from "@/types/interfaces";

export const variantContainers: Record<ComponentVariant, string> = {
  small: "p-2 text-sm",
  inline: "p-4 text-base",
  section: "p-12 border rounded-xl my-4",
  page: "min-h-[70vh] flex flex-col justify-center p-6",
};

/**
 * Industry Request
 */
import { Entity, IndustryRequestType, UserRole } from "./enums";

export interface RequestHint {
  placeholder: string;
  helpText: string;
}

export const INDUSTRY_REQUEST_HINTS: Record<IndustryRequestType, RequestHint> =
  {
    [IndustryRequestType.RND]: {
      placeholder:
        "Specify the research request, problem statement, and research area...",
      helpText: "Include specific goals and expected outcomes.",
    },
    [IndustryRequestType.TECH_SUPPORT]: {
      placeholder:
        "Specify the technology required and the duration of support needed...",
      helpText: "Detail the technical stack and project timeline.",
    },
    [IndustryRequestType.CONSULTANCY]: {
      placeholder: "Describe the consultancy type and expertise required...",
      helpText: "Specify the scope of the advisory services needed.",
    },
    [IndustryRequestType.TESTING]: {
      placeholder:
        "Detail the item to test and the specific test type required...",
      helpText: "Include any compliance or safety standards if applicable.",
    },
    [IndustryRequestType.TRAINING]: {
      placeholder:
        "Specify training type, number of trainees, and their level...",
      helpText: "Define the learning objectives and desired skills.",
    },
    [IndustryRequestType.INTERNSHIP]: {
      placeholder:
        "Detail the field of study, number of students, and planned activities...",
      helpText: "Mention any specific skills or prerequisites.",
    },
    [IndustryRequestType.RECRUITMENT]: {
      placeholder:
        "Describe the requirements, graduate year, and number of recruits...",
      helpText: "List essential qualifications and hiring timeline.",
    },
    [IndustryRequestType.OTHER]: {
      placeholder: "Provide more details about the request...",
      helpText: "Include any relevant information not covered elsewhere.",
    },
  };

export const mapEntity: Partial<
  Record<UserRole, { from: Entity; to: Entity }>
> = {
  [UserRole.INDUSTRY]: { from: Entity.INDUSTRY, to: Entity.ACADEMIC_UNIT },
  [UserRole.ADMIN]: { from: Entity.ACADEMIC_UNIT, to: Entity.INDUSTRY },
  [UserRole.STAFF]: { from: Entity.STAFF, to: Entity.INDUSTRY },
};
