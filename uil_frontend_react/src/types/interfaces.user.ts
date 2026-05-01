import { UserRole, UserStatus } from "@/lib/enums";
import { Metadata } from "./interfaces";
import { OrgUnitResponse } from "./interfaces.org_units";

export type UserProfile = Metadata & {
  id: number;
  username: string;
  first_name: string;
  father_name: string;
  grand_father_name: string;
  email: string;
  academic_unit: OrgUnitResponse;
  academic_unit_response: OrgUnitResponse;
  must_change_password: boolean;
  is_superuser: boolean;
  status: UserStatus;
  has_profile: boolean;
  profile_picture: string | null;
  roles: UserRole[];
  permissions: string[];
};
