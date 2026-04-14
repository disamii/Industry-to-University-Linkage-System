import {
  AcademicRankCode,
  AcademicTitle,
  AuthorCategoryCode,
  EmploymentTypeCode,
  ISCEDBandCode,
  QualificationCode,
  UserRole,
} from "@/lib/enums";
import { AssignmentResponse } from "./interfaces.assignments";
import { OrgUnitResponse } from "./interfaces.org_units";

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
