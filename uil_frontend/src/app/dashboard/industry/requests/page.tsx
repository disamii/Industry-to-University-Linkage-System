"use client";

import { DataTable } from "@/components/layout/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/layout/dashboard/badges";

export default function MyRequests() {
  const router = useRouter();

  const requests = [
    {
      id: 1,
      title: "AI-Powered Quality Control System",
      type: "Technical Support",
      status: "in-progress",
      priority: "high",
      submittedDate: "Mar 25, 2026",
      assignedTo: "Dr. Sarah Johnson",
    },
    {
      id: 2,
      title: "Supply Chain Optimization Study",
      type: "Research Collaboration",
      status: "assigned",
      priority: "medium",
      submittedDate: "Mar 22, 2026",
      assignedTo: "Dr. Michael Chen",
    },
    {
      id: 3,
      title: "Employee Training Program Design",
      type: "Training & Development",
      status: "pending",
      priority: "low",
      submittedDate: "Mar 28, 2026",
      assignedTo: "-",
    },
    {
      id: 4,
      title: "Renewable Energy Feasibility Analysis",
      type: "Consulting Services",
      status: "completed",
      priority: "high",
      submittedDate: "Mar 10, 2026",
      assignedTo: "Dr. Emily White",
    },
    {
      id: 5,
      title: "Material Testing and Analysis",
      type: "Testing & Analysis",
      status: "in-progress",
      priority: "medium",
      submittedDate: "Mar 18, 2026",
      assignedTo: "Dr. James Brown",
    },
  ];

  const columns = [
    {
      key: "title",
      label: "Request Title",
      render: (value: string) => (
        <div className="max-w-[240px] font-bold text-foreground truncate tracking-tight">
          {value}
        </div>
      ),
    },
    {
      key: "type",
      label: "Category",
      render: (value: string) => (
        <span className="font-medium text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => <StatusBadge status={value} />,
    },
    {
      key: "priority",
      label: "Priority",
      render: (value: any) => <PriorityBadge priority={value} />,
    },
    {
      key: "assignedTo",
      label: "Expert",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value !== "-" && (
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-6 h-6 font-bold text-[10px] text-primary">
              {value.split(" ").pop()?.charAt(0)}
            </div>
          )}
          <span className="font-medium text-muted-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: "submittedDate",
      label: "Date",
      render: (value: string) => (
        <span className="tabular-nums text-muted-foreground">{value}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            My Requests
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage your industrial collaboration portfolio
          </p>
        </div>
        <Link href="/dashboard/industry/submit-request">
          <Button className="group shadow-lg shadow-primary/20 px-6 rounded-2xl w-full md:w-auto h-12 font-bold">
            <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        {/* Search & Filters */}
        <div className="flex sm:flex-row flex-col items-center gap-4 mb-8">
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
            data={requests}
            onRowClick={(row) =>
              router.push(`/dashboard/industry/requests/${row.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
