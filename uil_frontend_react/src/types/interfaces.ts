export interface ApiErrorResponse {
  status?: number;
  error?: string;
  message?: string;
  details?: any;
}

type Pagination = {
  links: {
    previous: string | null;
    next: string | null;
  };
  total: number;
  page_size: number;
  current_page: number;
  total_pages: number;
};

export type ApiPaginatedResponse<T, CT = { total: number }, S = undefined> = {
  counts?: CT;
  pagination: Pagination;
  results: T[];
  stats: S;
  // scope?: AcademicScope;
};

export interface Metadata {
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
}

export type BaseTreeNode = {
  id: string | number;
  label: string;
  hasChildren?: boolean;
};

export type ITableHead = {
  content: string | number | React.ReactNode;
  className?: string;
};

export type PageParams = {
  page: number;
  page_size: number;
};
