export type IndustryBase = {
  name: string;
  email: string;
  contact_person?: string;
  phone?: string;
  industry_type?: string;
  efficiency_level?: string;
  address?: string;
  website?: string;
};

// export type IndustryProfileUpdate = {
//   name?: string;
//   contact_person?: string;
//   phone?: string;
//   industry_type?: string;
//   efficiency_level?: string;
//   address?: string;
//   website?: string;
// };

export type Industry = IndustryBase & {
  id: string;
  status: string;
  created_at: string;
  updated_at?: string;
};
