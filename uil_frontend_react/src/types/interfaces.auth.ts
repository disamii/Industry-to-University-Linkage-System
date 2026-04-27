import { UserProfile } from "./interfaces.user";

export type SigninResponse = {
  access: string;
  // refresh_token: string;
  // token_type: string;
};

export type CheckStaffEmailResponse = UserProfile & {
  is_active: boolean;
  last_login: string | null;
  raw_password: string | null;
};
