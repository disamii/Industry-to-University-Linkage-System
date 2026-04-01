"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

export function DataTable({
  columns,
  data,
  onRowClick,
}: {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="bg-card shadow-sm border border-border/50 rounded-[2rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/50 border-border/50 border-b">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 font-bold text-[11px] text-muted-foreground uppercase tracking-widest"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "group hover:bg-accent/30 transition-colors",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 font-medium text-foreground/80 group-hover:text-foreground text-sm"
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex sm:flex-row flex-col justify-between items-center gap-4 bg-accent/10 px-6 py-4 border-border/50 border-t">
        <p className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
          Showing {data.length} Results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl w-9 h-9"
            disabled
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            size="sm"
            className="shadow-md shadow-primary/10 px-4 rounded-xl h-9 font-bold"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl w-9 h-9"
            disabled
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
