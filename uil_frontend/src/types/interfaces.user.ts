import {
  AcademicRankCode,
  AcademicTitle,
  AuthorCategoryCode,
  EmploymentTypeCode,
  ISCEDBandCode,
  QualificationCode,
  UserRole,
  UserStatus,
} from "@/lib/enums";
import { AssignmentResponse } from "./interfaces.assignments";
import { AcademicUnit, OrgUnitResponse } from "./interfaces.org_units";
import { Metadata } from "./interfaces";

// Should be removed
// ——————————————----------------————————————————————————
export type UserBase = {
  email: string;
  role?: UserRole;
};

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

  academic_unit?: OrgUnitResponse | null;
  assignments?: AssignmentResponse[];

  created_at?: string;
  updated_at?: string | null;
};
// ——————————————----------------————————————————————————

export type UserProfile = Metadata & {
  id: number;
  username: string;
  email: string;
  first_name: string;
  father_name: string;
  grand_father_name: string;
  status: UserStatus;
  is_active: boolean;
  must_change_password: boolean;
  last_login: string | null;
  raw_password: string | null;
  academic_unit: AcademicUnit;
};
