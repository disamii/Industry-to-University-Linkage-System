export type ApiErrorResponse = {
  detail: string;
};

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
