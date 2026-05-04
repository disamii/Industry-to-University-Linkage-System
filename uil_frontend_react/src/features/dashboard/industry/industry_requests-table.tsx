import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { useUrlParams } from "@/hooks/use-url-params";
import { PAGE_SIZE } from "@/lib/constants";
import { cn, formatDate, getAcademicUnitAbbr } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import {
  IndustryRequestMineResponse,
  IndustryRequestMineStats,
} from "@/types/interfaces.industry_requests";
import { useRef } from "react";
import IndustryRequestActions from "./indutry_request-actions";
import {
  actionIcons,
  actionStyles,
} from "../../../lib/utils.industry_request-actions";
import { IndustryRequestMineParams } from "@/data/industry_requests/industry_requests-mine-list-query";

type RowProps = { item: IndustryRequestMineResponse; index: number };

const IndustryRequestTableRow = ({ item, index }: RowProps) => {
  const { getParam } = useUrlParams<IndustryRequestMineParams>();

  const currentPage = getParam("page", 1);
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  const ActionIcon = actionIcons[item.latest_action];

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      <TableCell>
        <h4 className="font-semibold">{item.title}</h4>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {item.type.split("_").join(" ")}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="max-w-40 text-xs truncate">{item.description}</p>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          {/* Primary */}
          <p className="font-medium">{item.academic_unit.name}</p>

          <Popover>
            <PopoverTrigger asChild>
              <p className="w-fit text-muted-foreground text-xs hover:underline cursor-pointer">
                {[...(item.academic_unit.ancestors ?? []), item.academic_unit]
                  .map((u) => getAcademicUnitAbbr(u.name))
                  .join(" > ")}
              </p>
            </PopoverTrigger>

            <PopoverContent className="w-64 text-sm">
              <div className="flex flex-col gap-2">
                {[
                  ...(item.academic_unit.ancestors ?? []),
                  item.academic_unit,
                ].map((u, i) => (
                  <div key={u.id} className="flex gap-1">
                    <span className="mt-0.5 text-xs">{i + 1}.</span>
                    <span>{u.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(actionStyles[item.latest_action], "capitalize gap-1.5")}
        >
          <ActionIcon className="w-3 h-3" />
          {item.latest_action}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {formatDate(item.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <IndustryRequestActions {...item} />
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<
    IndustryRequestMineResponse,
    undefined,
    IndustryRequestMineStats
  >;
};

const IndustryRequestsTable = ({ data }: TableProps) => {
  const { pagination, results } = data;
  const topCardRef = useRef<HTMLDivElement>(null);

  const tableHeads: ITableHead[] = [
    // {
    //   content: (
    //     <Checkbox
    //       checked={isAllSelected}
    //       onCheckedChange={handleSelectAll}
    //       aria-label="Select all"
    //     />
    //   ),
    // },
    { content: "#", className: "py-3" },
    { content: "Title" },
    { content: "Type" },
    { content: "Description" },
    { content: "Academic Unit" },
    { content: "Latest Activity" },
    { content: "Submitted At" },
    { content: "Actions", className: "text-center" },
  ];

  return (
    <Table topCardRef={topCardRef}>
      <Table.Header heads={tableHeads} />

      <Table.Body
        data={results}
        render={(item, idx) => (
          <IndustryRequestTableRow
            key={`${item.id}—${idx}`}
            item={item}
            index={idx}
          />
        )}
      />

      <Table.Footer>
        <Pagination
          variant="table"
          totalItems={pagination.total}
          scrollRef={topCardRef}
        />
      </Table.Footer>
    </Table>
  );
};

export default IndustryRequestsTable;
