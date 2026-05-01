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
  current_size: number;
  total_pages: number;
};

export type ApiPaginatedResponse<T, CT = { total: number }> = {
  counts?: CT;
  pagination: Pagination;
  results: T[];
  // scope?: AcademicScope;
};

export interface Metadata {
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
}

type Trend = {
  value: string;
  isPositive: boolean;
};

export type Stats = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend: Trend;
};

export type TableColumn<T> =
  | {
      [K in keyof T]: {
        key: K;
        label: string;
        render?: (value: T[K], row: T) => React.ReactNode;
      };
    }[keyof T]
  | {
      key: "actions";
      label: string;
      render: (_: undefined, row: T) => React.ReactNode;
    };

export interface BaseTreeNode {
  id: string | number;
  label: string;
  hasChildren?: boolean;
}
