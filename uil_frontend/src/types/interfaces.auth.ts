import { UserProfile } from "./interfaces.user";

export type SigninResponse = {
  access: string;
  // refresh_token: string;
  // token_type: string;
};

// export type CheckStaffEmailResponse = {
//   exists: boolean;
//   email: string;
//   name: string;
//   role: "user";
// };

export type CheckStaffEmailResponse = UserProfile;
