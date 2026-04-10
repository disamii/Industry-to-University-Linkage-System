import {
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { DataTable } from "@/components/dashboard/table/data-table";
import {
  ActionDropdown,
  DropdownAction,
} from "@/components/dashboard/table/table-action-dropdown";
import { ConfirmDialog } from "@/components/reusable/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { TableColumn } from "@/types/interfaces";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { Eye, Pencil, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  query: {
    isLoading: boolean;
    isError: boolean;
    data?: any;
    refetch?: () => void;
  };
};

const IndustryRequestsTable = ({ query }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isOffice = pathname.split("/").includes("office");
  const detailLink = (id: string) =>
    `/dashboard/${isOffice ? "office" : "industry"}/requests/${id}`;

  const handleDeleteRequest = () => {
    if (!deleteId) return;

    alert("DELETED");

    // call delete API with deleteId
  };

  const columns = [
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
        <Badge variant="secondary">
          {value
            .split("_")
            .map((v) => v[0].toUpperCase() + v.slice(1))
            .join(" ")}
        </Badge>
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
            onClick: () => router.push(detailLink(row.id)),
          },

          ...(!isOffice
            ? [
                {
                  label: "Edit Request",
                  icon: Pencil,
                  onClick: () => router.push(`requests/${row.id}/edit`),
                },
                {
                  label: "Delete Request",
                  icon: Trash,
                  variant: "destructive" as const,
                  showSeparator: true,
                  onClick: () => setDeleteId(row.id),
                },
              ]
            : []),
        ];

        return <ActionDropdown actions={actions} />;
      },
    },
  ] satisfies TableColumn<IndustryRequestResponse>[];

  return (
    <>
      <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
        <DataTable
          columns={columns}
          data={query.data || []}
          isLoading={query.isLoading}
          isError={query.isError}
          refetch={query.refetch}
          onRowClick={(row) => router.push(detailLink(row.id))}
        />
      </div>

      <ConfirmDialog
        onOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDeleteRequest}
        isLoading={false}
        title="Delete Request"
        description="Are you sure you want to delete this request?"
        confirmText="Delete Request"
        variant="destructive"
      />
    </>
  );
};

export default IndustryRequestsTable;
