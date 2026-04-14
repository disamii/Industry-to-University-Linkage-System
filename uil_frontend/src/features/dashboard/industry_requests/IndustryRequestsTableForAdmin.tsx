import {
  DefaultBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { DataTable } from "@/components/dashboard/table/data-table";
import {
  ActionDropdown,
  DropdownAction,
} from "@/components/dashboard/table/table-action-dropdown";
import { formatDate } from "@/lib/utils";
import { ApiPaginatedResponse, TableColumn } from "@/types/interfaces";
import { IndustryRequestResponseForAdmin } from "@/types/interfaces.industry_requests";
import { UseQueryResult } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  query: UseQueryResult<
    ApiPaginatedResponse<IndustryRequestResponseForAdmin[]>
  >;
};

const IndustryRequestsTableForAdmin = ({ query }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const inRequestsPage = pathname.includes("/requests");

  const columns = [
    {
      key: "industry",
      label: "Industry Partner",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground tracking-tight">
            {value?.name}
          </span>
        </div>
      ),
    },

    {
      key: "title",
      label: "Request Title",
      render: (value) => (
        <div className="max-w-60 font-bold truncate">{value}</div>
      ),
    },
    {
      key: "title",
      label: "Request Title",
      render: (value) => (
        <div className="max-w-60 font-bold truncate">{value}</div>
      ),
    },
    {
      key: "type",
      label: "Category",
      render: (value) => (
        <DefaultBadge
          value={value
            .split("_")
            .map((v) => v[0].toUpperCase() + v.slice(1))
            .join(" ")}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "priority",
      label: "Priority",
      render: (value) => <PriorityBadge priority={value} />,
    },
    {
      key: "created_at",
      label: "Submitted at",
      render: (value) => (
        <span className="text-muted-foreground">
          {formatDate(value, {
            relative: true,
          })}
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
            onClick: () => router.push(`/dashboard/office/requests/${row.id}`),
          },
        ];

        return <ActionDropdown actions={actions} />;
      },
    },
  ] satisfies TableColumn<IndustryRequestResponseForAdmin>[];

  const filteredCols = columns.filter((col) => {
    if (!inRequestsPage) return col.key !== "industry";

    return true;
  });

  return (
    <>
      <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
        <DataTable
          columns={filteredCols}
          data={query.data?.items || []}
          isLoading={query.isLoading}
          isError={query.isError}
          refetch={query.refetch}
          onRowClick={(row) =>
            router.push(`/dashboard/office/requests/${row.id}`)
          }
        />
      </div>
    </>
  );
};

export default IndustryRequestsTableForAdmin;
