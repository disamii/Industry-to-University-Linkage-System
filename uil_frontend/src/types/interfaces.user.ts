import {
  AcademicRankCode,
  AcademicTitle,
  AssignmentStatus,
  AuthorCategoryCode,
  EmploymentTypeCode,
  ISCEDBandCode,
  QualificationCode,
  UserRole,
} from "@/lib/enums";

export type UserBase = {
  email: string;
  role?: UserRole;
};

// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS
type AcademicUnitBase = {
  name: string;
  abbreviation: string | null;
  unit_type: string;
  description: string | null;
  parent_id: string | null;
};

export type AcademicUnit = AcademicUnitBase & {
  id: string;
  created_at: string;
  updated_at: string | null;
};
// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS// MOVE TO ORAN UNITS

// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS
export type AssignmentBase = {
  status?: AssignmentStatus;
  progress?: string;
};

export type Assignment = AssignmentBase & {
  id: string;
  request_id: string;
  staff_id: string;
  department_id?: string | null;
  assigned_at?: Date | string | null;
  completed_at?: Date | string | null;
};
// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS// MOVE TO ASSIGNMENTS

export type User = UserBase & {
  id: string;
  status: string;
  role: UserRole;

  first_name?: string | null;
  father_name?: string | null;
  grand_father_name?: string | null;
  username?: string | null;
  biography?: string | null;
  research_interests?: string | null;
  phone_number?: string | null;
  profile_picture?: string | null;
  author_gender?: string | null;

  publication_isced_band?: ISCEDBandCode | null;
  author_category?: AuthorCategoryCode | null;
  author_academic_rank?: AcademicRankCode | null;
  author_qualification?: QualificationCode | null;
  author_employment_type?: EmploymentTypeCode | null;
  academic_title?: AcademicTitle | null;

  academic_unit?: AcademicUnit | null;
  assignments?: Assignment[];

  created_at?: string;
  updated_at?: string | null;
};
