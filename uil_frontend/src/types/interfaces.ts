export type ApiErrorResponse = {
  detail: string;
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
