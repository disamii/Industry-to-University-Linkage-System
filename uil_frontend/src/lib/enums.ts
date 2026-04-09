/**
 * User
 */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  INDUSTRY = "industry",
}

/**
 * Industry Request
 */
export enum RequestStatus {
  PENDING = "PENDING",
  IN_REVIEW = "IN_REVIEW",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum RequestPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum RequestType {
  TECHNICAL_SUPPORT = "technical_support",
  RESEARCH_COLLABORATION = "research_collaboration",
  WORKSHOP = "workshop",
  SEMINAR = "seminar",
  EMPLOYEE_TRAINING = "employee_training",
  INTERNSHIP = "internship",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

/**
 * Assignment Status
 */
export enum AssignmentStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

/**
 * ISCED Band Codes
 */
export enum ISCEDBandCode {
  GENERIC = "00",
  EDUCATION = "01",
  ARTS_HUMANITIES = "02",
  SOCIAL_SCIENCES = "03",
  BUSINESS_LAW = "04",
  NATURAL_SCIENCES = "05",
  ICT = "06",
  ENGINEERING = "07",
  AGRICULTURE = "08",
  HEALTH_WELFARE = "09",
  SERVICES = "10",
  FIELD_UNKNOWN = "99",
}

export const ISCEDBandLabels: Record<ISCEDBandCode, string> = {
  [ISCEDBandCode.GENERIC]: "Generic programmes and qualifications",
  [ISCEDBandCode.EDUCATION]: "Education",
  [ISCEDBandCode.ARTS_HUMANITIES]: "Arts and humanities",
  [ISCEDBandCode.SOCIAL_SCIENCES]:
    "Social sciences, journalism and information",
  [ISCEDBandCode.BUSINESS_LAW]: "Business, administration and law",
  [ISCEDBandCode.NATURAL_SCIENCES]:
    "Natural sciences, mathematics and statistics",
  [ISCEDBandCode.ICT]: "Information and Communication Technologies (ICTs)",
  [ISCEDBandCode.ENGINEERING]: "Engineering, manufacturing and construction",
  [ISCEDBandCode.AGRICULTURE]:
    "Agriculture, forestry, fisheries and veterinary",
  [ISCEDBandCode.HEALTH_WELFARE]: "Health and welfare",
  [ISCEDBandCode.SERVICES]: "Services",
  [ISCEDBandCode.FIELD_UNKNOWN]: "Field unknown",
};

/**
 * Author Category Codes
 */
export enum AuthorCategoryCode {
  ACADEMIC_STAFF = "AS",
  FIRST_DEGREE_STUDENT = "FDS",
  SECOND_DEGREE_STUDENT = "SDS",
  THIRD_DEGREE_STUDENT = "TDS",
  FULL_TIME_RESEARCHER = "FR",
}

export const AuthorCategoryLabels: Record<AuthorCategoryCode, string> = {
  [AuthorCategoryCode.ACADEMIC_STAFF]: "Academic Staff",
  [AuthorCategoryCode.FIRST_DEGREE_STUDENT]: "First Degree Student",
  [AuthorCategoryCode.SECOND_DEGREE_STUDENT]: "Second Degree Student",
  [AuthorCategoryCode.THIRD_DEGREE_STUDENT]: "Third Degree Student",
  [AuthorCategoryCode.FULL_TIME_RESEARCHER]: "Full Time Researcher",
};

/**
 * Academic Rank Codes
 */
export enum AcademicRankCode {
  GRAD_ASSISTANT_I = "GRA-I",
  GRAD_ASSISTANT_II = "GRA-II",
  LECTURER = "LEC",
  ASSISTANT_PROFESSOR = "AST",
  ASSOCIATE_PROFESSOR = "ASC",
  PROFESSOR = "PRF",
  ASSISTANT_LECTURER = "AL",
  TECHNICAL_ASSISTANCE = "TA",
}

export const AcademicRankLabels: Record<AcademicRankCode, string> = {
  [AcademicRankCode.GRAD_ASSISTANT_I]: "Graduate Assistant I",
  [AcademicRankCode.GRAD_ASSISTANT_II]: "Graduate Assistant II",
  [AcademicRankCode.LECTURER]: "Lecturer",
  [AcademicRankCode.ASSISTANT_PROFESSOR]: "Assistant Professor",
  [AcademicRankCode.ASSOCIATE_PROFESSOR]: "Associate Professor",
  [AcademicRankCode.PROFESSOR]: "Professor",
  [AcademicRankCode.ASSISTANT_LECTURER]: "Assistant Lecturer",
  [AcademicRankCode.TECHNICAL_ASSISTANCE]: "Technical Assistance",
};

/**
 * Qualification Codes
 */
export enum QualificationCode {
  BACHELOR = "BCH",
  HEALTH_SPECIALITY = "HSP",
  POST_GRAD_DIPLOMA = "PGD",
  MASTER = "MST",
  DOCTORATE = "PHD",
  HEALTH_SUB_SPECIALTY = "SSP",
  BACHELOR_TEACHING = "BCH-TE",
}

export const QualificationLabels: Record<QualificationCode, string> = {
  [QualificationCode.BACHELOR]: "Bachelor's degree",
  [QualificationCode.HEALTH_SPECIALITY]: "Health Speciality Certificate",
  [QualificationCode.POST_GRAD_DIPLOMA]: "Post graduate diploma",
  [QualificationCode.MASTER]: "Master's degree",
  [QualificationCode.DOCTORATE]: "Doctorate degree",
  [QualificationCode.HEALTH_SUB_SPECIALTY]: "Health Sub-Specialty",
  [QualificationCode.BACHELOR_TEACHING]: "Bachelor's degree in teaching",
};

/**
 * Employment Type Codes
 */
export enum EmploymentTypeCode {
  FULL_TIME = "FT",
  PART_TIME = "PT",
  JOINT_EDU = "JAEI",
  JOINT_INDUSTRY = "JAI",
  VISITING_PROFESSOR = "VP",
}

export const EmploymentTypeLabels: Record<EmploymentTypeCode, string> = {
  [EmploymentTypeCode.FULL_TIME]: "Full Time",
  [EmploymentTypeCode.PART_TIME]: "Part Time",
  [EmploymentTypeCode.JOINT_EDU]:
    "Jointly Appointed with other education institutions",
  [EmploymentTypeCode.JOINT_INDUSTRY]: "Jointly Appointed with the industry",
  [EmploymentTypeCode.VISITING_PROFESSOR]: "Visiting Professor",
};

/**
 * Academic Titles
 */
export enum AcademicTitle {
  MR = "MR",
  MRS = "MRS",
  MISS = "MISS",
  MS = "MS",
  DR = "DR",
  PROF = "PROF",
}

export const AcademicTitleLabels: Record<AcademicTitle, string> = {
  [AcademicTitle.MR]: "Mr.",
  [AcademicTitle.MRS]: "Mrs.",
  [AcademicTitle.MISS]: "Miss",
  [AcademicTitle.MS]: "Ms.",
  [AcademicTitle.DR]: "Dr.",
  [AcademicTitle.PROF]: "Professor",
};

/**
 * Author Types
 */
export enum AuthorType {
  FIRST_AUTHOR = "FA",
  CO_AUTHOR = "COA",
  CORRESPONDING_AUTHOR = "CRA",
}

export const AuthorTypeLabels: Record<AuthorType, string> = {
  [AuthorType.FIRST_AUTHOR]: "First Author",
  [AuthorType.CO_AUTHOR]: "Co-Author",
  [AuthorType.CORRESPONDING_AUTHOR]: "Corresponding Author",
};
