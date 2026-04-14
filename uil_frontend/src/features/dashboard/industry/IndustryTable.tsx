import { DefaultBadge } from "@/components/dashboard/reusable/badges";
import { DataTable } from "@/components/dashboard/table/data-table";
import {
  ActionDropdown,
  DropdownAction,
} from "@/components/dashboard/table/table-action-dropdown";
import { formatDate } from "@/lib/utils";
import { ApiPaginatedResponse, TableColumn } from "@/types/interfaces";
import { IndustryResponse } from "@/types/interfaces.industry";
import { UseQueryResult } from "@tanstack/react-query";
import { Eye, Phone, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  query: UseQueryResult<ApiPaginatedResponse<IndustryResponse[]>>;
};

const IndustryTable = ({ query }: Props) => {
  const router = useRouter();

  const columns = [
    {
      key: "name",
      label: "Partner",
      render: (value, row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-primary capitalize">{value}</p>
          <p className="text-muted-foreground text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: "industry_type",
      label: "Sector",
      render: (value) =>
        value ? (
          <DefaultBadge
            value={value}
            variant="default"
            className="bg-primary/10 font-medium text-primary uppercase"
          />
        ) : (
          <p className="text-muted-foreground text-sm">Not Specified</p>
        ),
    },
    {
      key: "contact_person",
      label: "Contact Person",
      render: (value, row) =>
        value ? (
          <div className="space-y-1">
            <div className="font-bold text-foreground text-sm">{value}</div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Phone size={12} className="text-primary" />
              {row.phone}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Not Assigned</p>
        ),
    },
    {
      key: "efficiency_level",
      label: "Efficiency Level",
      render: (value) =>
        value ? (
          <DefaultBadge value={value} />
        ) : (
          <p className="text-muted-foreground text-sm">Unknown</p>
        ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (value) => (
        <span className="font-medium tabular-nums text-muted-foreground text-xs">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => {
        const actions: DropdownAction[] = [
          {
            label: "View Details",
            icon: Eye,
            onClick: () => router.push(`partners/${row.id}`),
          },
          // {
          //   label: "Edit Industry",
          //   icon: Pencil,
          //   onClick: () => router.push(`partners/${row.id}/edit`),
          // },
          {
            label: "Delete Industry",
            icon: Trash,
            variant: "destructive",
            showSeparator: true,
            onClick: () => alert(row.id),
          },
        ];

        return <ActionDropdown actions={actions} />;
      },
    },
  ] satisfies TableColumn<IndustryResponse>[];

  return (
    <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
      <DataTable
        columns={columns}
        data={query.data?.items || []}
        isLoading={query.isLoading}
        isError={query.isError}
        refetch={query.refetch}
        onRowClick={(row) => router.push(`partners/${row.id}`)}
      />
    </div>
  );
};

export default IndustryTable;
