"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Building2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/reusable/data-table";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";

export default function AdminRequestsManagement() {
  const router = useRouter();

  const requests = [
    {
      id: 1,
      industry: "TechCorp Industries",
      title: "AI-Powered Quality Control System",
      type: "Technical Support",
      status: "in-progress",
      priority: "high",
      submittedDate: "Mar 25, 2026",
    },
    {
      id: 2,
      industry: "GreenEnergy Co",
      title: "Renewable Energy Feasibility",
      type: "Research Collaboration",
      status: "assigned",
      priority: "high",
      submittedDate: "Mar 27, 2026",
    },
    {
      id: 3,
      industry: "Manufacturing Plus",
      title: "Supply Chain Optimization",
      type: "Consulting Services",
      status: "pending",
      priority: "medium",
      submittedDate: "Mar 28, 2026",
    },
    {
      id: 4,
      industry: "BuildRight Construction",
      title: "Material Testing and Analysis",
      type: "Testing & Analysis",
      status: "in-progress",
      priority: "medium",
      submittedDate: "Mar 20, 2026",
    },
    {
      id: 5,
      industry: "DataFlow Systems",
      title: "Big Data Processing Pipeline",
      type: "Technical Support",
      status: "completed",
      priority: "low",
      submittedDate: "Mar 15, 2026",
    },
    {
      id: 6,
      industry: "FoodTech Innovations",
      title: "Food Safety Compliance Study",
      type: "Research Collaboration",
      status: "pending",
      priority: "high",
      submittedDate: "Mar 29, 2026",
    },
  ];

  const columns = [
    {
      key: "industry",
      label: "Industry Partner",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
            <Building2 size={14} />
          </div>
          <span className="font-bold text-foreground tracking-tight">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "title",
      label: "Request Title",
      render: (value: string) => (
        <span className="block max-w-[200px] font-medium text-muted-foreground truncate">
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Category",
      render: (value: string) => (
        <span className="bg-accent/50 px-2 py-1 rounded-md font-semibold text-muted-foreground/80 text-xs">
          {value}
        </span>
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
      key: "submittedDate",
      label: "Submitted",
      render: (value: string) => (
        <span className="tabular-nums text-muted-foreground text-xs">
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Requests Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Centralized control for all university-industry collaboration
            funnel.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-border/60 rounded-2xl h-11 font-bold"
        >
          <LayoutGrid size={18} />
          Board View
        </Button>
      </div>

      {/* Filter & Table Card */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        {/* Advanced Filters */}
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by industry, project, or type..."
              className="bg-background pl-11 border-border/60 rounded-2xl focus:ring-primary/20 w-full h-12 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select>
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[160px] h-12">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[160px] h-12">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="secondary"
              className="gap-2 px-5 rounded-2xl h-12 font-bold"
            >
              <SlidersHorizontal size={18} />
              More
            </Button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable
            columns={columns}
            data={requests}
            onRowClick={(row) =>
              router.push(`/dashboard/office/requests/${row.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
