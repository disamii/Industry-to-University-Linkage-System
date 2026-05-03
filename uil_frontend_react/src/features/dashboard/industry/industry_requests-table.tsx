import ConfirmDelete from "@/components/reusable/confirm-delete-dialog";
import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { useIndustryRequestDeleteMutation } from "@/data/industry_requests/industry_request-delete-mutation";
import { useUrlParams } from "@/hooks/use-url-params";
import { PAGE_SIZE } from "@/lib/constants";
import { actionStyles, cn, formatDate, getAcademicUnitAbbr } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { IndustryRequestMineResponse } from "@/types/interfaces.industry_requests";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RowProps = { item: IndustryRequestMineResponse; index: number };

const IndustryRequestTableRow = ({ item, index }: RowProps) => {
  const { mutate: deleteRequest, isPending: isDeleting } =
    useIndustryRequestDeleteMutation();
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { getParam } = useUrlParams();
  const navigate = useNavigate();

  const currentPage = Number(getParam("page", "1"));
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

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
        <Badge className={cn(actionStyles[item.latest_action], "capitalize")}>
          {item.latest_action}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {formatDate(item.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted p-2 rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate(`${item.id}`)}>
              <Eye className="mr-2 w-4 h-4" />
              View details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate(`${item.id}/edit`)}>
              <Pencil className="mr-2 w-4 h-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 w-4 h-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmDelete
          resourceName="Industry Request"
          item={{ label: item.title, sublabel: item.description }}
          isDeleting={isDeleting}
          onDelete={deleteRequest}
          targets={item.id}
          open={DeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<IndustryRequestMineResponse>;
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
