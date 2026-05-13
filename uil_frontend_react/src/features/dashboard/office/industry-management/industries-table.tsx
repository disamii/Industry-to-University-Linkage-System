import { Pagination } from "@/components/reusable/pagination";
import Table from "@/components/reusable/table";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";
import { formatType } from "@/lib/utils";
import { ApiPaginatedResponse, ITableHead } from "@/types/interfaces";
import { IndustryResponse, IndustryStats } from "@/types/interfaces.industry";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";
import { useIndustryParams } from "../../../../data/industry/use-industry-params";
import IndustryActions from "./industry-actions";

type RowProps = {
  item: IndustryResponse;
  index: number;
};

const IndustryTableRow = ({ item, index }: RowProps) => {
  const { params } = useIndustryParams();

  const currentPage = params.page;
  const currentIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <TableRow>
      <TableCell>{currentIndex + index + 1}</TableCell>
      <TableCell>
        <div>
          <h4 className="font-bold">{item.name}</h4>
          <p className="max-w-60 text-muted-foreground text-xs truncate">
            {item.contact_email}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {formatType(item.industry_type)}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="max-w-40 text-xs truncate">{item.description}</p>
      </TableCell>
      <TableCell>
        <p className="font-medium text-sm">{item.number_of_employees}</p>
      </TableCell>
      <TableCell>
        {item.website ? (
          <div className="flex items-center gap-1 text-primary">
            <a
              href={item.website}
              target="_blank"
              className="max-w-30 text-xs truncate"
            >
              {item.website}
            </a>
            <ExternalLink className="size-3" />
          </div>
        ) : (
          <p className="text-destructive">N/A</p>
        )}
      </TableCell>
      <TableCell>
        <div>
          <h4 className="font-medium">{item.contact_full_name}</h4>
          <p className="max-w-60 text-muted-foreground text-xs truncate">
            {item.contact_email}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <IndustryActions id={item.id} />
      </TableCell>
    </TableRow>
  );
};

type TableProps = {
  data: ApiPaginatedResponse<IndustryResponse, undefined, IndustryStats>;
};

const IndustriesTable = ({ data }: TableProps) => {
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
    { content: "Industry Type" },
    { content: "Description" },
    { content: "# of Employees" },
    { content: "Site" },
    { content: "Contact Person" },
    { content: "Actions", className: "text-center" },
  ].filter(Boolean);

  return (
    <Table topCardRef={topCardRef}>
      <Table.Header heads={tableHeads} />

      <Table.Body
        data={results}
        render={(item, idx) => (
          <IndustryTableRow key={`${item.id}—${idx}`} item={item} index={idx} />
        )}
      />

      <Table.Footer>
        <Pagination
          variant="table"
          totalItems={pagination.total}
          scrollRef={topCardRef}
          namespace="industries"
        />
      </Table.Footer>
    </Table>
  );
};

export default IndustriesTable;
