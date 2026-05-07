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
import { cn, formatDate, getAcademicUnitAbbr } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { AssignmentResponse } from "@/types/interfaces.assignments";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useRef } from "react";
import { useAssignmentParams } from "./assignment-params";
import { assignmentStatusColorMap } from "@/lib/mappings";

type RowProps = {
  item: AssignmentResponse;
  index: number;
};

const AssignmentTableRow = ({ item, index }: RowProps) => {
  const { params } = useAssignmentParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

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
          {item.request.type.split("_").join(" ")}
        </Badge>
      </TableCell>
      <TableCell>
        {item.assigned_users?.length ? (
          <div className="flex items-center">
            {item.assigned_users.slice(0, 2).map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "flex justify-center items-center bg-muted border rounded-full w-7 h-7 font-medium text-xs",
                  index !== 0 && "-ml-2",
                )}
              >
                {user.first_name[0]}
                {user.father_name[0]}
              </div>
            ))}

            {item.assigned_users.length > 2 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex justify-center items-center bg-background hover:bg-muted -ml-2 border rounded-full w-7 h-7 font-medium text-xs">
                    +{item.assigned_users.length - 2}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-64">
                  <div className="flex flex-col gap-2">
                    {item.assigned_users.map((user) => (
                      <div key={user.id} className="flex items-center gap-2">
                        <div className="flex justify-center items-center bg-muted rounded-full w-8 h-8 font-medium text-xs">
                          {user.first_name[0]}
                          {user.father_name[0]}
                        </div>

                        <div className="flex flex-col">
                          <p className="font-medium text-sm">
                            {user.first_name} {user.father_name}
                          </p>

                          <p className="text-muted-foreground text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">No users</span>
        )}
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
        <Badge
          variant="secondary"
          className={cn("capitalize", assignmentStatusColorMap[item.status])}
        >
          {item.status.split("_").join(" ")}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {`${formatDate(item.start_date)} - ${formatDate(item.end_date)}`}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>CONTENT</DropdownMenuContent>
        </DropdownMenu>
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
