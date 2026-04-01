"use client";

import React from "react";
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";

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

  const stats = [
    {
      label: "Total Partners",
      value: "32",
      icon: Building2,
      color: "text-blue-500",
    },
    {
      label: "Total Requests",
      value: "156",
      icon: Layers,
      color: "text-primary",
    },
    {
      label: "Active Projects",
      value: "24",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      label: "Total Revenue",
      value: "$2.4M",
      icon: ArrowUpRight,
      color: "text-indigo-500",
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
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Industry Partners
          </h1>
          <p className="mt-1 text-muted-foreground">
            Nurture and track long-term corporate collaborations.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 px-6 rounded-2xl h-11 font-bold">
          <Plus size={18} />
          Register New Partner
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="shadow-sm border-border/40 rounded-[2rem] overflow-hidden"
          >
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="font-bold text-foreground text-2xl">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl bg-accent/30 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </CardContent>
          </Card>
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
