"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { TableColumn } from "@/types/interfaces";
import { TableState } from "./table-states";

type DataTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
};

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  isLoading,
  isError,
  emptyMessage,
}: DataTableProps<T>) {
  const colSpan = columns.length;

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className="bg-[#fcfcfd] dark:bg-slate-950 px-6 py-4 font-bold text-[11px] text-muted-foreground uppercase tracking-widest"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {/* Loading */}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <TableState type="loading" />
              </TableCell>
            </TableRow>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <TableState type="error" />
              </TableCell>
            </TableRow>
          )}

          {/* Empty */}
          {!isLoading && !isError && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <TableState type="empty" message={emptyMessage} />
              </TableCell>
            </TableRow>
          )}

          {/* Data */}
          {!isLoading &&
            !isError &&
            data.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-accent/30 transition-colors",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => {
                  const value = row[col.key];

                  return (
                    <TableCell
                      key={String(col.key)}
                      className="px-6 py-4 font-medium text-foreground/80 text-sm"
                    >
                      {col.render ? col.render(value, row) : String(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
