"use client";

import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { StatCard } from "@/components/dashboard/reusable/stat-card";
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
import IndustryTable from "@/features/dashboard/industry/IndustryTable";
import { Search } from "lucide-react";

// Stats Needed — total partners(Building2), total requests(Layers), active projects(TrendingUp), total revenue(ArrowUpRight)

export default function IndustriesManagement() {
  const listQuery = useGetIndustryList();

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

        <IndustryTable query={listQuery} />
      </div>
    </div>
  );
}
