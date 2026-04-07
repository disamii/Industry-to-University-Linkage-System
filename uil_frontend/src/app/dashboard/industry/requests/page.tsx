"use client";

import AdminCard from "@/components/dashboard/reusable/admin-card";
import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetIndustryRequestList } from "@/data/industry_requests/industry_request-list-query";
import IndustryRequestsTable from "@/features/dashboard/industry_requests/IndustryRequestsTable";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

export default function MyRequests() {
  const listQuery = useGetIndustryRequestList();

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
        <IndustryRequestsTable query={listQuery} />
      </AdminCard>
    </>
  );
}
