"use client";

import { DataTable } from "@/components/dashboard/reusable/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

export default function StaffManagement() {
  const staff = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      rank: "Professor",
      qualification: "PhD in AI & ML",
      email: "sarah.johnson@university.edu",
      phone: "+1 555-0101",
      activeProjects: 3,
      completedProjects: 12,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      department: "Engineering",
      rank: "Associate Professor",
      qualification: "PhD in Mech Eng",
      email: "michael.chen@university.edu",
      phone: "+1 555-0102",
      activeProjects: 2,
      completedProjects: 8,
    },
    {
      id: 3,
      name: "Dr. Emily White",
      department: "Materials Science",
      rank: "Professor",
      qualification: "PhD in Materials Eng",
      email: "emily.white@university.edu",
      phone: "+1 555-0103",
      activeProjects: 4,
      completedProjects: 15,
    },
    {
      id: 4,
      name: "Dr. James Brown",
      department: "Business",
      rank: "Assistant Professor",
      qualification: "PhD in Supply Chain",
      email: "james.brown@university.edu",
      phone: "+1 555-0104",
      activeProjects: 1,
      completedProjects: 5,
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Expert",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-xl w-10 h-10 font-bold text-primary text-xs">
            {value
              .split(" ")
              .map((n) => n[0])
              .join("")
              .replace("Dr.", "")}
          </div>
          <div>
            <div className="mb-1 font-bold text-foreground leading-none">
              {value}
            </div>
            <div className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
              {row.rank}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (value: string) => (
        <Badge
          variant="outline"
          className="bg-accent/20 border-border/60 rounded-lg font-medium"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "qualification",
      label: "Qualification",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <GraduationCap size={14} className="text-primary/60" />
          {value}
        </div>
      ),
    },
    {
      key: "activeProjects",
      label: "Workload",
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-accent rounded-full w-12 h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${value > 3 ? "bg-amber-500" : "bg-primary"}`}
              style={{ width: `${(value / 5) * 100}%` }}
            />
          </div>
          <span className="font-bold text-foreground text-xs">
            {value} Active
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_: any, row: any) => (
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg w-8 h-8 text-muted-foreground hover:text-primary"
          >
            <Mail size={16} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg w-8 h-8"
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="font-medium">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium">
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium text-destructive">
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Staff Directory
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage university experts and monitor their project capacity.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 px-6 rounded-2xl h-11 font-bold">
          <Plus size={18} />
          Add New Expert
        </Button>
      </div>

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
              <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[200px] h-12">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="materials">Materials Science</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2 border-border/60 rounded-2xl h-12 font-bold"
            >
              <Briefcase size={18} />
              Capacity View
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable columns={columns} data={staff} />
        </div>
      </div>
    </div>
  );
}
