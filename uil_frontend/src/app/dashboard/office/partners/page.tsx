"use client";

import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { StatCard } from "@/components/dashboard/reusable/stat-card";
import { DataTable } from "@/components/dashboard/table/data-table";
import {
  ActionDropdown,
  DropdownAction,
} from "@/components/dashboard/table/table-action-dropdown";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stats } from "@/data/dummy-data";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import { formatDate } from "@/lib/utils";
import { TableColumn } from "@/types/interfaces";
import { IndustryResponse } from "@/types/interfaces.industry";
import { Eye, Pencil, Phone, Search, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

// Stats Needed — total partners(Building2), total requests(Layers), active projects(TrendingUp), total revenue(ArrowUpRight)

export default function IndustriesManagement() {
  const listQuery = useGetIndustryList();
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
          <Badge className="bg-primary/10 font-medium text-primary uppercase">
            {value}
          </Badge>
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
          <Badge variant="secondary">{value}</Badge>
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
          {
            label: "Edit Industry",
            icon: Pencil,
            onClick: () => router.push(`partners/${row.id}/edit`),
          },
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
    <div className="space-y-8 pb-10">
      <AdminHeaderTitle
        title="Industry Partners"
        desc="Nurture and track long-term corporate collaborations."
      />

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={`${stat.title}—${idx}`} {...stat} />
        ))}
      </div>

      {/* Management Table */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by company, representative, or industry..."
              className="bg-background pl-11 border-border/60 rounded-2xl w-full h-12"
            />
          </div>

          <Select>
            <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-50 h-12">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable
            columns={columns}
            data={listQuery.data || []}
            isLoading={listQuery.isLoading}
            isError={listQuery.isError}
            onRowClick={(row) => router.push(`partners/${row.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
