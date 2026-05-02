import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import EmptyState from "./empty-state";

type TableContextType = {
  colCount?: number;
  setColCount: (count: number) => void;
};

const TableContext = createContext<TableContextType>({
  colCount: undefined,
  setColCount: () => {},
});

type TableProps = {
  children: ReactNode;
};

function Table({ children }: TableProps) {
  const [colCount, setColCount] = useState(0);

  return (
    <TableContext.Provider value={{ colCount, setColCount }}>
      <div className="relative border sm:rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

type HeaderProps = {
  heads: string[];
};

function Header({ heads }: HeaderProps) {
  const { setColCount } = useContext(TableContext);

  useEffect(
    function () {
      setColCount(heads.length);
    },
    [setColCount, heads.length],
  );

  return (
    <thead className="bg-muted border-b text-sm uppercase">
      <tr className="whitespace-nowrap">
        {heads.map((header, index) => (
          <th
            key={index}
            scope="col"
            className="px-6 py-5 dark:font-medium font-semibold"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

type BodyProps<T> = {
  data: T[];
  render: (item: T, index: number) => ReactElement;
};

function Body<T>({ data, render }: BodyProps<T>) {
  const { colCount } = useContext(TableContext);

  if (!data?.length) return <EmptyState colCount={colCount} />;

  return <tbody>{data?.map(render)}</tbody>;
}

type RowProps = {
  children: ReactNode;
  size?: "large" | "default";
};

function Row({ children, size = "default" }: RowProps) {
  return (
    <tr
      className={`whitespace-nowrap border-b bg-foreground hover:bg-muted ${
        size === "large" ? "text-base" : ""
      }`}
    >
      {children}
    </tr>
  );
}

const tableDataStyles = {
  regular: "px-6 py-3 font-medium",
  image: "pb-2 pr-2 pt-1",
  long: "px-6 py-3 whitespace-nowrap",
} as const;

type TableDataProps = {
  type?: keyof typeof tableDataStyles;
  children: ReactNode;
};

function TableData({ type = "regular", children }: TableDataProps) {
  return (
    <td scope="row" className={tableDataStyles[type]}>
      {children}
    </td>
  );
}

type FooterProps = {
  children: ReactElement<{ colCount?: number }>;
};

function Footer({ children }: FooterProps) {
  const { colCount } = useContext(TableContext);

  return <tfoot>{cloneElement(children, { colCount })}</tfoot>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Data = TableData;
Table.Footer = Footer;

export default Table;
