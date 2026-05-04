/**
 * User
 */
export enum UserRole {
  SUPER_ADMIN = "Super_Admin",
  ADMIN = "Admin",
  STAFF = "Staff",
  INDUSTRY = "Industry",
}

export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/**
 * Industry
 */
export enum IndustryType {
  IT = "it",
  Manufacturing = "manufacturing",
  Construction = "construction",
  Healthcare = "healthcare",
  Education = "education",
  Other = "other",
}

/**
 * Industry Request
 */
export enum IndustryRequestType {
  RND = "rnd",
  TECH_SUPPORT = "tech_support",
  CONSULTANCY = "consultancy",
  TESTING = "testing",
  TRAINING = "training",
  INTERNSHIP = "internship",
  RECRUITMENT = "recruitment",
  OTHER = "other",
}

export const INDUSTRY_REQUEST_FIELDS: Record<
  IndustryRequestType,
  readonly string[]
> = {
  [IndustryRequestType.RND]: ["request", "problem_statement", "research_area"],
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

export enum RequestingEntity {
  INDUSTRY = "industry",
  ACADEMIC_UNIT = "academic_unit",
}

export enum ActionType {
  CREATED = "created",
  ASSIGNED = "assigned",
  FORWARDED = "forwarded",
  ACCEPT_FORWARDED = "accept_forwarded",
  POSTED_AS_THEMATIC = "posted_as_thematic",
  REPLIED = "replied",
  REJECTED = "rejected",
  REASSIGNED = "reassigned",
  COMPLETED = "completed",
}

/**
 * Org Units
 */
export enum OrgUnitType {
  UNIVERSITY = "university",
  CAMPUS = "campus",
  COLLEGE = "college",
  INSTITUTE = "institute",
  FACULTY = "faculty",
  SCHOOL = "school",
  DEPARTMENT = "department",
  ACADEMY = "academy",
  RESEARCH_CENTER = "research_center",
  SUPPORT_UNIT = "support_unit",
  PROGRAM = "program",
  OFFICE = "office",
  OTHER = "other",
}

/**
 * Assignment Status
 */
export enum AssignmentStatus {
  // PENDING = "PENDING",
  // ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
