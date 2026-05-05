import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITableHead } from "@/types/interfaces";
import React, {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Card, CardContent } from "../ui/card";

type TableContextType = {
  colCount: number;
  setColCount: (count: number) => void;
};

const TableContext = createContext<TableContextType>({
  colCount: 0,
  setColCount: () => {},
});

type TableProps = {
  children: ReactNode;
  topCardRef?: React.Ref<HTMLDivElement>;
};

function Table({ children, topCardRef }: TableProps) {
  const [colCount, setColCount] = useState(0);

  return (
    <TableContext.Provider value={{ colCount, setColCount }}>
      <Card ref={topCardRef} className="p-0!">
        <CardContent className="p-0!">
          <ShadTable>{children}</ShadTable>
        </CardContent>
      </Card>
    </TableContext.Provider>
  );
}

type HeaderProps = {
  heads: ITableHead[];
};

function Header({ heads }: HeaderProps) {
  const { setColCount } = useContext(TableContext);

  useEffect(() => {
    setColCount(heads.length);
  }, [setColCount, heads.length]);

  return (
    <TableHeader>
      <TableRow>
        {heads.map((header, inx) => (
          <TableHead key={inx} className={header.className}>
            {header.content}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

type BodyProps<T> = {
  data: T[];
  render: (item: T, index: number) => ReactElement;
};

function Body<T>({ data, render }: BodyProps<T>) {
  const { colCount } = useContext(TableContext);

  if (!data?.length)
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={colCount}
            className="py-8 text-muted-foreground text-center"
          >
            No data found!
          </TableCell>
        </TableRow>
      </TableBody>
    );

  return <TableBody>{data?.map(render)}</TableBody>;
}

type FooterProps = {
  children: ReactElement<{ colCount?: number }>;
};

function Footer({ children }: FooterProps) {
  const { colCount } = useContext(TableContext);

  if (React.isValidElement(children)) {
    return <TableFooter>{cloneElement(children, { colCount })}</TableFooter>;
  }

  return <TableFooter>{children}</TableFooter>;
}

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
