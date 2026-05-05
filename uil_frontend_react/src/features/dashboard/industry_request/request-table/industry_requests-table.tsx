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
  IndustryRequestOfficeResponse,
  IndustryRequestStats,
} from "@/types/interfaces.industry_requests";
import { useRef } from "react";
import IndustryRequestActions from "../indutry_request-actions";
import { actionIcons, actionStyles } from "../utils.industry_request-actions";
import {
  defaultIndustryRequestParams,
  IndustryRequestParams,
} from "./use-industry_request-params";

type RowProps = {
  item: IndustryRequestMineResponse | IndustryRequestOfficeResponse;
  index: number;
  isOffice?: boolean;
};

const IndustryRequestTableRow = ({ item, index, isOffice }: RowProps) => {
  const { getParam } = useUrlParams<IndustryRequestParams>(
    defaultIndustryRequestParams,
  );

  const currentPage = getParam("page");
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  const ActionIcon = actionIcons[item.latest_action];

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      {isOffice && (
        <TableCell>
          <h4 className="font-bold">
            {(item as IndustryRequestOfficeResponse).industry.name}
          </h4>
        </TableCell>
      )}
      <TableCell>
        <h4 className={cn(isOffice ? "font-medium" : "font-semibold")}>
          {item.title}
        </h4>
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
        <IndustryRequestActions {...item} isOffice={isOffice} />
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<
    IndustryRequestMineResponse | IndustryRequestOfficeResponse,
    undefined,
    IndustryRequestStats
  >;
  isOffice?: boolean;
};

const IndustryRequestsTable = ({ data, isOffice }: TableProps) => {
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
    ...(isOffice ? [{ content: "Industry" }] : []),
    { content: "Title" },
    { content: "Type" },
    { content: "Description" },
    { content: "Academic Unit" },
    { content: "Latest Activity" },
    { content: "Submitted At" },
    { content: "Actions", className: "text-center" },
  ].filter(Boolean);

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
            isOffice={isOffice}
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
