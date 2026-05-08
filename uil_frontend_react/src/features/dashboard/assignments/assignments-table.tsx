import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";

import UsersAvatarPopover from "@/components/reusable/users-avatar-popver";
import { cn, formatDate, formatType, getAcademicUnitAbbr } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import { useRef } from "react";
import { useAssignmentParams } from "../../../data/assignments/use-assignment-params";
import AssignmentActions from "./assignment-actions";
import { getAssignmentStatusConfig } from "./utils.assignments";

type RowProps = {
  item: AssignmentResponse;
  index: number;
};

const AssignmentTableRow = ({ item, index }: RowProps) => {
  const { params } = useAssignmentParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  const { Icon, color } = getAssignmentStatusConfig(item.status);

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      <TableCell>
        <h4 className="font-bold">{item.request.industry.name}</h4>
      </TableCell>
      <TableCell>
        <h4 className="font-medium">{item.request.title}</h4>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {formatType(item.request.type)}
        </Badge>
      </TableCell>
      <TableCell>
        <UsersAvatarPopover users={item.assigned_users} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          {/* Primary */}
          <p className="max-w-50 font-medium text-xs truncate">
            {item.request.academic_unit.name}
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <p className="w-fit text-muted-foreground text-xs hover:underline cursor-pointer">
                {[
                  ...(item.request.academic_unit.ancestors ?? []),
                  item.request.academic_unit,
                ]
                  .map((u) => getAcademicUnitAbbr(u.name))
                  .join(" > ")}
              </p>
            </PopoverTrigger>

            <PopoverContent className="w-64 text-sm">
              <div className="flex flex-col gap-2">
                {[
                  ...(item.request.academic_unit.ancestors ?? []),
                  item.request.academic_unit,
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
        <Badge variant="secondary" className={cn("capitalize", color)}>
          <Icon className="size-3.5" />
          {formatType(item.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="max-w-35 text-muted-foreground text-xs whitespace-normal">
          {`${formatDate(item.start_date)} - ${formatDate(item.end_date)}`}
        </p>
      </TableCell>

      <TableCell className="text-center">
        <AssignmentActions
          assignment_id={item.id}
          request_title={item.request.title}
          request_description={item.request.description}
          assigned_users={item.assigned_users}
          supported_actions={item.supported_actions}
        />
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<AssignmentResponse>;
};

const AssignmentsTable = ({ data }: TableProps) => {
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
    { content: "Industry" },
    { content: "Request title" },
    { content: "Request type" },
    { content: "Assigned Users" },
    { content: "Academic Unit" },
    { content: "Assignment Status" },
    { content: "Date Range" },
    { content: "Actions", className: "text-center" },
  ].filter(Boolean);

  return (
    <Table topCardRef={topCardRef}>
      <Table.Header heads={tableHeads} />

      <Table.Body
        data={results}
        render={(item, idx) => (
          <AssignmentTableRow
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

export default AssignmentsTable;
