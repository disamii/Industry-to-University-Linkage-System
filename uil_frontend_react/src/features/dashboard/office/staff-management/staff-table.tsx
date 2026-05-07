import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { useUserParams } from "@/data/user/use-user-params";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDate, getAcademicUnitAbbr, getFullName } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { UserProfile } from "@/types/interfaces.user";
import { MoreVertical } from "lucide-react";
import { useRef } from "react";

type RowProps = {
  item: UserProfile;
  index: number;
};

const StaffTableRow = ({ item, index }: RowProps) => {
  const { params } = useUserParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      <TableCell>
        <div>
          <h4 className="font-bold">{getFullName(item)}</h4>
          <p className="max-w-60 text-muted-foreground text-xs truncate">
            {item.email}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          {/* Primary */}
          <p className="max-w-60 font-medium truncate">
            {item.academic_unit_response.name}
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <p className="w-fit text-muted-foreground text-xs hover:underline cursor-pointer">
                {[
                  ...(item.academic_unit_response.ancestors ?? []),
                  item.academic_unit_response,
                ]
                  .map((u) => getAcademicUnitAbbr(u.name))
                  .join(" > ")}
              </p>
            </PopoverTrigger>

            <PopoverContent className="w-64 text-sm">
              <div className="flex flex-col gap-2">
                {[
                  ...(item.academic_unit_response.ancestors ?? []),
                  item.academic_unit_response,
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
        <p className="max-w-40 truncate">{item.roles.join(",") || "Staff"}</p>
      </TableCell>
      <TableCell>
        <p className="font-medium text-sm">{formatDate(item.created_at)}</p>
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
  data: ApiPaginatedResponse<UserProfile>;
};

const StaffTable = ({ data }: TableProps) => {
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
    { content: "Name" },
    { content: "Academic Unit" },
    { content: "Roles" },
    { content: "Registered At" },
    { content: "Actions", className: "text-center" },
  ].filter(Boolean);

  return (
    <Table topCardRef={topCardRef}>
      <Table.Header heads={tableHeads} />

      <Table.Body
        data={results}
        render={(item, idx) => (
          <StaffTableRow key={`${item.id}—${idx}`} item={item} index={idx} />
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

export default StaffTable;
