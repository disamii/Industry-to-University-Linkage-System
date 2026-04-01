"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const recentRequests = [
    {
      id: 1,
      industry: "TechCorp Industries",
      title: "AI Quality Control System",
      status: "pending",
      date: "1 hour ago",
    },
    {
      id: 2,
      industry: "GreenEnergy Co",
      title: "Renewable Energy Analysis",
      status: "assigned",
      date: "3 hours ago",
    },
    {
      id: 3,
      industry: "Manufacturing Plus",
      title: "Supply Chain Optimization",
      status: "in-progress",
      date: "5 hours ago",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      message: "New request submitted by TechCorp Industries",
      time: "1 hour ago",
      type: "new",
    },
    {
      id: 2,
      message: "Request #127 assigned to Dr. Sarah Johnson",
      time: "2 hours ago",
      type: "assign",
    },
    {
      id: 3,
      message: "Request #125 marked as completed",
      time: "4 hours ago",
      type: "complete",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Office Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Real-time metrics for university-industry collaboration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border/60 rounded-2xl h-11 font-bold"
          >
            Download Report
          </Button>
          <Link href="/dashboard/office/requests">
            <Button className="shadow-lg shadow-primary/20 px-6 rounded-2xl h-11 font-bold">
              Manage All Requests
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value="156"
          icon={FileText}
          color="bg-primary"
          trend={{ value: "12%", isPositive: true }}
        />
        <StatCard
          title="Pending Review"
          value="8"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Completed"
          value="124"
          icon={CheckCircle}
          color="bg-emerald-500"
          trend={{ value: "8%", isPositive: true }}
        />
        <StatCard
          title="Active Staff"
          value="45"
          icon={Users}
          color="bg-indigo-500"
        />
      </div>

      {/* Efficiency Metrics */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        <Card className="bg-accent/20 shadow-none border-border/40 rounded-[2rem]">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-1">
              <p className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Industry Partners
              </p>
              <p className="font-bold text-foreground text-2xl">32</p>
            </div>
            <div className="flex justify-center items-center bg-background border border-border/50 rounded-2xl w-12 h-12 text-primary">
              <Building2 size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/20 shadow-none border-border/40 rounded-[2rem]">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-1">
              <p className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Avg Response
              </p>
              <p className="font-bold text-foreground text-2xl">2.3 Days</p>
            </div>
            <div className="flex justify-center items-center bg-background border border-border/50 rounded-2xl w-12 h-12 text-emerald-500">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/20 shadow-none border-border/40 rounded-[2rem]">
          <CardContent className="flex justify-between items-center p-6">
            <div className="space-y-1">
              <p className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Success Rate
              </p>
              <p className="font-bold text-foreground text-2xl">96%</p>
            </div>
            <div className="flex justify-center items-center bg-background border border-border/50 rounded-2xl w-12 h-12 text-indigo-500">
              <CheckCircle size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        {/* Recent Requests */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="flex flex-row justify-between items-center px-8 pt-8">
            <div>
              <CardTitle className="font-bold text-xl">
                Incoming Requests
              </CardTitle>
              <CardDescription>
                Latest submissions requiring attention.
              </CardDescription>
            </div>
            <Link href="/dashboard/office/requests">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/5 font-bold text-primary"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`/dashboard/office/requests/${request.id}`}
                className="group flex justify-between items-center bg-accent/30 hover:bg-accent/50 p-5 border border-transparent hover:border-border/60 rounded-[1.8rem] transition-all"
              >
                <div className="space-y-1 overflow-hidden">
                  <h3 className="font-bold text-foreground group-hover:text-primary truncate transition-colors">
                    {request.title}
                  </h3>
                  <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                    <span className="text-foreground/70">
                      {request.industry}
                    </span>
                    <span>•</span>
                    <span>{request.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={request.status as any} />
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="px-8 pt-8">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Activity className="text-primary" size={22} />
              Office Activity
            </div>
            <CardDescription>
              Live log of system and administrative actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="before:top-2 before:bottom-2 before:left-[11px] before:absolute relative space-y-6 before:bg-border/40 before:w-[2px]">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative pl-10">
                  <div className="top-1 left-0 z-10 absolute flex justify-center items-center bg-background border-2 border-primary rounded-full w-6 h-6">
                    <div className="bg-primary rounded-full w-1.5 h-1.5" />
                  </div>
                  <div className="bg-accent/20 p-4 border border-border/30 rounded-2xl">
                    <p className="font-bold text-foreground text-sm leading-tight">
                      {activity.message}
                    </p>
                    <p className="opacity-70 mt-2 font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-6 rounded-xl w-full font-bold text-muted-foreground hover:text-foreground"
            >
              Load More Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
