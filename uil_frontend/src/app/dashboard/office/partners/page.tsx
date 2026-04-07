"use client";

import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import { DataTable } from "@/components/dashboard/reusable/data-table";
import { StatCard } from "@/components/dashboard/reusable/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stats } from "@/data/dummy-data";
import { Building2, ExternalLink, Mail, Plus, Search } from "lucide-react";

// Stats Needed — total partners(Building2), total requests(Layers), active projects(TrendingUp), total revenue(ArrowUpRight)

export default function IndustriesManagement() {
  const industries = [
    {
      id: 1,
      company: "TechCorp Industries",
      industry: "Technology",
      contactPerson: "John Doe",
      email: "john.doe@techcorp.com",
      phone: "+1 555-1001",
      totalRequests: 12,
      activeRequests: 3,
      joinedDate: "Jan 15, 2025",
    },
    {
      id: 2,
      company: "GreenEnergy Co",
      industry: "Energy",
      contactPerson: "Jane Smith",
      email: "jane.smith@greenenergy.com",
      phone: "+1 555-1002",
      totalRequests: 8,
      activeRequests: 2,
      joinedDate: "Feb 20, 2025",
    },
    {
      id: 3,
      company: "Manufacturing Plus",
      industry: "Manufacturing",
      contactPerson: "Robert Wilson",
      email: "robert.wilson@mfgplus.com",
      phone: "+1 555-1003",
      totalRequests: 15,
      activeRequests: 4,
      joinedDate: "Dec 10, 2024",
    },
    {
      id: 4,
      company: "BuildRight Construction",
      industry: "Construction",
      contactPerson: "Maria Garcia",
      email: "maria.garcia@buildright.com",
      phone: "+1 555-1004",
      totalRequests: 6,
      activeRequests: 1,
      joinedDate: "Mar 5, 2025",
    },
  ];

  const columns = [
    {
      key: "company",
      label: "Partner",
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-accent/50 border border-border/50 rounded-xl w-10 h-10">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="mb-1 font-bold text-foreground leading-none">
              {value}
            </div>
            <div className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
              Global Partner
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "Sector",
      render: (value: string) => (
        <Badge
          variant="secondary"
          className="bg-primary/5 border-none rounded-lg font-bold text-[10px] text-primary uppercase"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "contactPerson",
      label: "Contact Details",
      render: (value: string, row: any) => (
        <div className="space-y-1">
          <div className="font-bold text-foreground text-sm">{value}</div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Mail size={12} className="text-primary" />
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: "activeRequests",
      label: "Activity",
      render: (value: number, row: any) => (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-bold text-foreground text-sm">
              {row.totalRequests}
            </div>
            <div className="font-bold text-[10px] text-muted-foreground uppercase">
              Total
            </div>
          </div>
          <div className="bg-border w-[1px] h-8" />
          <div className="text-center">
            <div className="font-bold text-primary text-sm">{value}</div>
            <div className="font-bold text-[10px] text-primary/70 uppercase">
              Active
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "joinedDate",
      label: "Joined",
      render: (value: string) => (
        <span className="font-medium tabular-nums text-muted-foreground text-xs">
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 rounded-xl hover:text-primary"
        >
          <ExternalLink size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}

      <AdminHeaderTitle
        title="Industry Partners"
        desc="Nurture and track long-term corporate collaborations.
          "
        links={{
          href: "/dashboard/office/partners/create",
          Icon: Plus,
          linkLabel: "Register New Partner",
        }}
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
            <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[200px] h-12">
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
          <DataTable columns={columns} data={industries} />
        </div>
      </div>
    </div>
  );
}
