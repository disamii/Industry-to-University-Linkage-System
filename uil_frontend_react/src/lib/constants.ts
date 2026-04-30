import { IndustryRequestType } from "./enums";

/**
 * Industry Requests
 */
export const INDUSTRY_REQUEST_FIELDS: Record<
  IndustryRequestType,
  readonly string[]
> = {
  [IndustryRequestType.RND]: ["technology_required", "required_duration"],
  [IndustryRequestType.TECH_SUPPORT]: [
    "technology_required",
    "required_duration",
  ],
  [IndustryRequestType.CONSULTANCY]: ["consultancy_type"],
  [IndustryRequestType.TESTING]: ["item_to_test", "test_type"],
  [IndustryRequestType.TRAINING]: [
    "training_type",
    "number_of_trainees",
    "trainee_level",
  ],
  [IndustryRequestType.INTERNSHIP]: [
    "field_of_study",
    "number_of_students",
    "timeframe",
    "activities",
  ],
  [IndustryRequestType.RECRUITMENT]: [
    "field_of_study",
    "graduate_year",
    "requirements",
    "number_to_recruit",
  ],
  [IndustryRequestType.OTHER]: [],
};

/**
 * Contact Info
 */
export const UIL_CONTACT_INFO = {
  email: {
    value: "linkage@university.edu",
    href: "mailto:linkage@university.edu",
  },
  phone: { value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  location: { value: "Building A, Room 101", href: "#" },
};

/**
 * Public Links
 */
export const LINKS = {
  privacy: "/privacy",
  terms: "/terms",
  signup: "/signup",
  signin: "/signin",
  forgot_password: "/forgot-password",
  unauthorized: "/unauthorized",
  not_found: "/not-found",
  rpms: "http://10.161.65.18",
};

/**
 * Others
 */
export const PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
