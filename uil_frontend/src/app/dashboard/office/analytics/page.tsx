"use client";

import { StatCard } from "@/components/dashboard/reusable/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Star,
  TrendingUp,
} from "lucide-react";

export default function ReportsPage() {
  const monthlyData = [
    { month: "Jan", requests: 12, completed: 10 },
    { month: "Feb", requests: 15, completed: 13 },
    { month: "Mar", requests: 18, completed: 16 },
  ];

  const topStaff = [
    { name: "Dr. Emily White", projects: 15, rating: 4.9, dept: "Materials" },
    { name: "Dr. Sarah Johnson", projects: 12, rating: 4.8, dept: "CS" },
    { name: "Dr. Michael Chen", projects: 8, rating: 4.7, dept: "Eng" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Analytics Hub
          </h1>
          <p className="mt-1 text-muted-foreground">
            Measuring the impact of university-industry linkages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="bg-background border-border/60 rounded-2xl w-[160px] h-11">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 px-6 rounded-2xl h-11 font-bold">
            <Download size={18} />
            Export data
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value="156"
          icon={FileText}
          color="bg-primary"
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard
          title="Completion Rate"
          value="94%"
          icon={CheckCircle}
          color="bg-emerald-500"
          trend={{ value: "5%", isPositive: true }}
        />
        <StatCard
          title="Avg Response"
          value="2.3d"
          icon={Clock}
          color="bg-amber-500"
          trend={{ value: "0.5d", isPositive: true }}
        />
        <StatCard
          title="Partnerships"
          value="32"
          icon={Building2}
          color="bg-indigo-500"
          trend={{ value: "8%", isPositive: true }}
        />
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        {/* Monthly Progress */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="font-bold text-xl">
              Delivery Efficiency
            </CardTitle>
            <CardDescription>
              Ratio of submitted vs. completed projects per month.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">
                    {data.month}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-border/60 rounded-lg font-bold text-[10px] uppercase tracking-tighter"
                  >
                    {data.completed} of {data.requests} Finished
                  </Badge>
                </div>
                <Progress
                  value={(data.completed / data.requests) * 100}
                  className="bg-accent/50 h-2.5"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="font-bold text-xl">Funnel Status</CardTitle>
            <CardDescription>
              Current distribution of active requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4 grid grid-cols-2 px-8 pb-8">
            {[
              { label: "Pending", count: 8, pct: "5%", color: "bg-amber-500" },
              { label: "Assigned", count: 12, pct: "8%", color: "bg-blue-500" },
              {
                label: "In Progress",
                count: 18,
                pct: "12%",
                color: "bg-indigo-500",
              },
              {
                label: "Completed",
                count: 118,
                pct: "75%",
                color: "bg-emerald-500",
              },
            ].map((status) => (
              <div
                key={status.label}
                className="flex flex-col justify-between bg-accent/20 p-4 border border-border/30 rounded-3xl h-28"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-foreground text-2xl">
                    {status.count}
                  </span>
                  <span className="font-bold text-muted-foreground text-xs">
                    ({status.pct})
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        {/* Top Staff */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-6 border-border/40 border-b">
            <CardTitle className="flex items-center gap-2 font-bold text-xl">
              <TrendingUp className="text-primary" size={20} />
              Expert Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topStaff.map((staff, i) => (
              <div
                key={staff.name}
                className={`flex items-center justify-between p-6 px-8 ${i !== topStaff.length - 1 ? "border-b border-border/30" : ""} hover:bg-accent/10 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-black text-muted-foreground/30 text-2xl italic">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{staff.name}</p>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                      {staff.dept} Department
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-0.5 font-bold text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {staff.rating}
                  </div>
                  <p className="font-bold text-[10px] text-muted-foreground uppercase">
                    {staff.projects} Projects
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Highlights */}
        <Card className="bg-primary/[0.02] shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="flex items-center gap-2 font-bold text-xl">
              <DollarSign className="text-emerald-500" size={20} />
              Financial Outlook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <div className="flex justify-between items-center bg-background shadow-sm p-6 border border-border/50 rounded-[2rem]">
              <div>
                <p className="mb-1 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                  Total Revenue
                </p>
                <p className="font-black text-foreground text-3xl">$2.4M</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full font-bold text-emerald-500 text-xs">
                <ArrowUpRight size={14} />
                18%
              </div>
            </div>

            <div className="gap-4 grid grid-cols-2">
              <div className="bg-background shadow-sm p-6 border border-border/50 rounded-[2rem]">
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Avg Project
                </p>
                <p className="font-bold text-foreground text-xl">$65K</p>
                <div className="flex items-center gap-1 mt-2 font-bold text-[10px] text-primary">
                  <ArrowUpRight size={10} /> 12.4%
                </div>
              </div>
              <div className="bg-background shadow-sm p-6 border border-border/50 rounded-[2rem]">
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Forecast
                </p>
                <p className="font-bold text-foreground text-xl">+25%</p>
                <div className="flex items-center gap-1 mt-2 font-bold text-[10px] text-amber-500">
                  Next Quarter
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
