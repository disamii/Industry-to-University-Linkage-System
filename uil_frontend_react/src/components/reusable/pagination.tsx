import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUrlParams } from "@/hooks/use-url-params";
import { PAGE_SIZE, SELECT_PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface PaginationProps {
  totalItems: number;
  variant?: "default" | "table";
  colCount?: number; // Used for table variant
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  variant = "default",
  colCount = 1,
  scrollRef,
}) => {
  const { getParam, setParams } = useUrlParams();

  // Extract logic with defaults
  const currentPage = Number(getParam("page", "1"));
  const itemsPerPage = Number(getParam("page_size", PAGE_SIZE.toString()));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const prevPageRef = useRef(currentPage);

  const handlePageChange = (page: number) => {
    setParams({ page });
  };

  const handleSizeChange = (value: string) => {
    // Update size and reset page to 1 simultaneously
    setParams({ pageSize: value, page: 1 });
  };

  // --- Pagination Logic ---
  const getVisiblePageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
  };

  // --- Scroll Effect ---
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      if (scrollRef?.current) {
        const y =
          scrollRef.current.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    prevPageRef.current = currentPage;
  }, [currentPage, scrollRef]);

  const Content = (
    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Items per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleSizeChange}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SELECT_PAGE_SIZE_OPTIONS.map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          Showing {totalItems === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePageNumbers().map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNumber)}
              className="p-0 w-8 h-8"
            >
              {pageNumber}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (variant === "table") {
    return (
      <tr className="border-t">
        <td colSpan={colCount}>{Content}</td>
      </tr>
    );
  }

  return (
    <div className="mt-6">
      <Separator className="mb-6" />
      {Content}
    </div>
  );
};
