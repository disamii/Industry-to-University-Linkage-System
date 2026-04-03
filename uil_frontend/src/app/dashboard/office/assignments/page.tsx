"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/badges";

export default function AssignmentsManagement() {
  const router = useRouter();

  const assignments = [
    {
      id: 1,
      request: "AI-Powered Quality Control System",
      staff: "Dr. Sarah Johnson",
      department: "Computer Science",
      status: "in-progress",
      progress: 65,
      deadline: "Apr 15, 2026",
    },
    {
      id: 2,
      request: "Renewable Energy Feasibility",
      staff: "Dr. Michael Chen",
      department: "Engineering",
      status: "assigned",
      progress: 20,
      deadline: "Apr 20, 2026",
    },
    {
      id: 3,
      request: "Material Testing Analysis",
      staff: "Dr. Emily White",
      department: "Materials Science",
      status: "in-progress",
      progress: 80,
      deadline: "Apr 10, 2026",
    },
    {
      id: 4,
      request: "Supply Chain Optimization",
      staff: "Dr. James Brown",
      department: "Business",
      status: "in-progress",
      progress: 45,
      deadline: "Apr 25, 2026",
    },
    {
      id: 5,
      request: "Big Data Processing Pipeline",
      staff: "Dr. Lisa Davis",
      department: "Computer Science",
      status: "completed",
      progress: 100,
      deadline: "Mar 30, 2026",
    },
  ];

  const columns = [
    {
      key: "request",
      label: "Project Name",
      render: (value: string) => (
        <div className="max-w-[220px] font-bold text-foreground truncate tracking-tight">
          {value}
        </div>
      ),
    },
    {
      key: "staff",
      label: "Assigned Expert",
      render: (value: string, row: any) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-bold text-foreground text-sm">
            <div className="bg-primary/40 rounded-full w-2 h-2" />
            {value}
          </div>
          <div className="ml-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
            {row.department}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => <StatusBadge status={value} />,
    },
    {
      key: "progress",
      label: "Completion",
      render: (value: number) => (
        <div className="space-y-2 w-full min-w-[120px]">
          <div className="flex justify-between font-bold text-[10px] uppercase tracking-tighter">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary">{value}%</span>
          </div>
          <Progress value={value} className="h-1.5" />
        </div>
      ),
    },
    {
      key: "deadline",
      label: "Due Date",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={14} className="opacity-50" />
          <span className="font-medium tabular-nums text-xs">{value}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Staff Assignments
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor workloads and project delivery across university
            departments.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-border/60 rounded-2xl h-11 font-bold"
        >
          <Users size={18} />
          Staff Directory
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        {/* Search & Filter Bar */}
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search experts or projects..."
              className="bg-background pl-11 border-border/60 rounded-2xl focus:ring-primary/20 w-full h-12 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select>
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[180px] h-12">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[180px] h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="secondary"
              size="icon"
              className="rounded-2xl w-12 h-12"
            >
              <Filter size={18} />
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable
            columns={columns}
            data={assignments}
            onRowClick={(row) =>
              router.push(`/dashboard/office/requests/${row.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
