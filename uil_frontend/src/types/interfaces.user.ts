import { UserRole } from "@/lib/enums";

export type UserBase = {
  email: string;
  role?: UserRole;
};

export type User = UserBase & {
  id: string;
  status: string;
  role: UserRole;
  first_name?: string;
  father_name?: string;
  grand_father_name?: string;
  biography?: string;
  research_interests?: string;
  phone_number?: string;
  profile_picture?: string;
};
