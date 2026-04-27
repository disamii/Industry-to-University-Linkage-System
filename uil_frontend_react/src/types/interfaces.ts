export interface ApiErrorResponse {
  status?: number;
  error?: string;
  message?: string;
  details?: any;
}

// export type ApiErrorResponse = {
//   error: string;
// };

export type ApiPaginatedResponse<T> = {
  items: T;
  total: number;
  page: number;
  size: number;
  pages: number;
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
