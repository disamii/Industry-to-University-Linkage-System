"use client";

import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsers } from "@/data/user/user-list-query";
import StaffTable from "@/features/dashboard/staff/StaffTable";
import { Search } from "lucide-react";

export default function StaffManagement() {
  const listQuery = useGetUsers();

  return (
    <div className="space-y-8 pb-10">
      <AdminHeaderTitle
        title="Staff Directory"
        desc="Manage university experts and monitor their project capacity."
      />

      {/* Directory Controls */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="Search by name, expertise, or PhD focus..."
              className="bg-background pl-11 border-border/60 rounded-2xl w-full h-12"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Select>
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-50 h-12">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="materials">Materials Science</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <StaffTable query={listQuery} />
      </div>
    </div>
  );
}
