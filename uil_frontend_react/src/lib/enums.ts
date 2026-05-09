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
 * Request
 */
export enum IndustryRequestType {
  RND = "rnd",
  TECH_SUPPORT = "tech_support",
  CONSULTANCY = "consultancy",
  TESTING = "testing",
  TRAINING = "training",
  INTERNSHIP = "internship",
  EXTERNSHIP = "externship",
  RECRUITMENT = "recruitment",
  OTHER = "other",
}

export enum OfficeRequestType {
  CURRICULUM_REVIEW = "curriculum_review",
  INDUSTRIAL_VISIT = "industrial_visit",
  JOINT_RESEARCH = "joint_research",
  GUEST_LECTURE = "guest_lecture",
  LAB_ACCESS = "lab_access",
  TECH_TRANSFER = "tech_transfer",
  WORKSHOP_CALL = "workshop_call",
  CONFERENCE_CALL = "conference_call",
  EXHIBITION_CALL = "exhibition_call",
  JOINT_COMMUNITY_ENGAGEMENT = "joint_community_engagement",
  OTHER = "other",
}

export enum Entity {
  INDUSTRY = "industry",
  ACADEMIC_UNIT = "academic_unit",
  STAFF = "staff",
  STUDENT = "student",
}

export enum ActionType {
  INITIATED = "initiated",
  ASSIGNED = "assigned",
  FORWARDED = "forwarded",
  ACCEPT_FORWARDED = "accept_forwarded",
  POSTED_AS_THEMATIC = "posted_as_thematic",
  REPLIED = "replied",
  REJECTED = "rejected",
  // REASSIGNED = "reassigned",
  COMPLETED = "completed",
  // REVOKED = "revoked",
  CANCELLED = "cancelled",
  REVERTED = "reverted",
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
 * Assignments
 */
export enum AssignmentStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Posts
 */
export enum PostType {
  SUCCESS_STORY = "success_story",
  THEMATIC_AREA = "thematic_area",
  OPEN_REQUEST = "open_request",
  ANNOUNCEMENT = "announcement",
  GUIDELINE = "guideline",
}

export enum PostContentType {
  REQUEST = "request",
  ASSIGNMENT = "assignment",
  USER = "user",
  INDUSTRY_PROFILE = "industryprofile",
}
