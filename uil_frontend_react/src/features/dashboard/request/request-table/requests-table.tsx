import { Pagination } from "@/components/reusable/pagination";
import RequestActionBadge from "@/components/reusable/request-action-badge";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { useGetRoleByPath } from "@/hooks/use-get-role-by-path";
import { PAGE_SIZE } from "@/lib/constants";
import { UserRole } from "@/lib/enums";
import { cn, formatDate, formatType, getAcademicUnitAbbr } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import {
  MyRequestResponse,
  OfficeRequestResponse,
  RequestStats,
} from "@/types/interfaces.requests";
import { useRef } from "react";
import { useRequestParams } from "../../../../data/requests/use-request-params";
import RequestActions from "../request-actions";
import useTabParams from "@/hooks/use-tab-params";

type CommonProps = {
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
};

type RowProps = CommonProps & {
  item: MyRequestResponse | OfficeRequestResponse;
  index: number;
  isOffice: boolean;
  isIndustry: boolean;
  currentTab: string;
};

const RequestTableRow = ({
  item,
  index,
  isOffice,
  isIndustry,
  currentTab,
  onEdit,
  onDelete,
}: RowProps) => {
  const { params } = useRequestParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      {isOffice && (
        <TableCell>
          <h4 className="font-bold">
            {(item as OfficeRequestResponse).industry.name}
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
          {formatType(item.type)}
        </Badge>
      </TableCell>
      {isIndustry && currentTab === "incoming" && (
        <TableCell>
          <Badge variant="outline" className="capitalize">
            {formatType(item.requesting_entity)}
          </Badge>
        </TableCell>
      )}
      <TableCell>
        <p className="max-w-40 text-xs truncate">{item.description}</p>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          {/* Primary */}
          <p className="max-w-50 font-medium text-xs truncate">
            {item.academic_unit.name}
          </p>

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
        <RequestActionBadge type={item.latest_action} />
      </TableCell>
      <TableCell>
        <p className="text-muted-foreground text-xs">
          {formatDate(item.created_at)}
        </p>
      </TableCell>
      <TableCell className="text-center">
        <RequestActions {...item} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

type TableProps = CommonProps & {
  data: ApiPaginatedResponse<
    MyRequestResponse | OfficeRequestResponse,
    undefined,
    RequestStats
  >;
};

const RequestsTable = ({ data, onEdit, onDelete }: TableProps) => {
  const { pagination, results } = data;
  const topCardRef = useRef<HTMLDivElement>(null);

  const currentRole = useGetRoleByPath();
  const {
    params: { tab: currentTab },
  } = useTabParams();

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
    ...(currentRole === UserRole.ADMIN ? [{ content: "Industry Name" }] : []),
    { content: "Request Title" },
    { content: "Request Type" },
    ...(currentRole === UserRole.INDUSTRY && currentTab === "incoming"
      ? [{ content: "Requested by" }]
      : []),
    { content: "Request Description" },
    { content: "To Unit" },
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
          <RequestTableRow
            key={`${item.id}—${idx}`}
            item={item}
            index={idx}
            isOffice={currentRole === UserRole.ADMIN}
            isIndustry={currentRole === UserRole.INDUSTRY}
            currentTab={currentTab}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      />

      <Table.Footer>
        <Pagination
          variant="table"
          totalItems={pagination.total}
          scrollRef={topCardRef}
          namespace="requests"
        />
      </Table.Footer>
    </Table>
  );
};

export default RequestsTable;
