export type SigninResponse = {
  access_token: string;
  token_type: string;
};

export type CheckStaffEmailResponse = {
  exists: boolean;
  email: string;
  name: string;
  role: "user";
};
