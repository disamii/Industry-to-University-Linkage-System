/**
 * User
 */
export enum UserRole {
  SUPER_ADMIN = "Super Admin",
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
  REVOKED = "revoked",
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
