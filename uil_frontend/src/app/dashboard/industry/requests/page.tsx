"use client";

import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { DataTable } from "@/components/dashboard/reusable/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetIndustryRequestList } from "@/data/industry_requests/industry_request-list-mutation";
import { formatDate } from "@/lib/utils";
import { TableColumn } from "@/types/interfaces";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyRequests() {
  const router = useRouter();

  const listQuery = useGetIndustryRequestList();

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
      render: (value) => <span>{value}</span>,
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
  ] satisfies TableColumn<IndustryRequestResponse>[];

  return (
    <>
      <AdminHeaderTitle
        title="My Requests"
        desc="Track and manage your industrial collaboration portfolio"
        links={{
          href: "/dashboard/industry/requests/create",
          Icon: Plus,
          linkLabel: "New Request",
        }}
      />

      {/* Main Table Card */}
      <AdminCard hasHeader={false} className="py-8">
        {/* Search & Filters */}
        <div className="flex sm:flex-row flex-col items-center gap-4 pb-4">
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by title or expert..."
              className="bg-background pl-11 border-border/60 rounded-2xl focus:ring-primary/20 w-full h-12 transition-all"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-accent px-5 border-border/60 rounded-2xl w-full sm:w-auto h-12 font-bold"
          >
            <SlidersHorizontal size={18} />
            Filter
          </Button>
        </div>

        {/* Data Table */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable
            columns={columns}
            data={listQuery.data || []}
            isLoading={listQuery.isLoading}
            isError={listQuery.isError}
            onRowClick={(row) =>
              router.push(`/dashboard/industry/requests/${row.id}`)
            }
          />
        </div>
      </AdminCard>
    </>
  );
}
