"use client";

import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetIndustryRequestListForAdmin } from "@/data/industry_requests/industry_request-list-query-for-admin";
import IndustryRequestsTableForAdmin from "@/features/dashboard/industry_requests/IndustryRequestsTableForAdmin";
import { Search, SlidersHorizontal } from "lucide-react";

export default function AdminRequestsManagement() {
  const listQuery = useGetIndustryRequestListForAdmin();

  return (
    <div className="space-y-8 pb-10">
      <AdminHeaderTitle
        title="Requests Management"
        desc="Centralized control for all university-industry collaboration
            funnel."
        // links={{
        //   onClick: () => {},
        //   Icon: LayoutGrid,
        //   linkLabel: "Board View",
        // }}
      />

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
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-40 h-12">
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
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-40 h-12">
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
        <IndustryRequestsTableForAdmin query={listQuery} />
      </div>
    </div>
  );
}
