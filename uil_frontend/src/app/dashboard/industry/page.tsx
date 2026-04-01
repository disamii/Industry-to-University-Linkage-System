"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Plus,
  ChevronRight,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";

// 1. Status Badge with our established premium palette
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    "in-progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 rounded-lg font-semibold capitalize",
        styles[status],
      )}
    >
      {status.replace("-", " ")}
    </Badge>
  );
};

export default function IndustryDashboard() {
  const recentRequests = [
    {
      id: 1,
      title: "AI Quality Control System",
      status: "in-progress",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Supply Chain Optimization",
      status: "assigned",
      date: "5 days ago",
    },
    {
      id: 3,
      title: "Renewable Energy Analysis",
      status: "completed",
      date: "1 week ago",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: 'Your request "AI Quality Control System" has been updated',
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "New research opportunity in Manufacturing",
      time: "1 day ago",
    },
    {
      id: 3,
      message: 'Request "Supply Chain Optimization" assigned to Dr. Smith',
      time: "3 days ago",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here&apos;s your collaboration overview.
          </p>
        </div>
        <Link href="/dashboard/industry/submit-request">
          <Button className="group shadow-lg shadow-primary/20 px-6 rounded-2xl h-12 font-bold">
            <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
            Submit New Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value="12"
          icon={FileText}
          color="bg-primary"
        />
        <StatCard
          title="Active Requests"
          value="5"
          icon={Clock}
          color="bg-amber-500"
          trend={{ value: "2", isPositive: true }}
        />
        <StatCard
          title="Completed"
          value="7"
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          title="Success Rate"
          value="94%"
          icon={TrendingUp}
          color="bg-purple-500"
          trend={{ value: "5%", isPositive: true }}
        />
      </div>

      {/* Content Grid */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
        {/* Recent Requests Card */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="flex flex-row justify-between items-center px-8 pt-8">
            <CardTitle className="font-bold text-xl tracking-tight">
              Recent Requests
            </CardTitle>
            <Link
              href="/dashboard/industry/requests"
              className="font-bold text-primary text-sm hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                href={`/dashboard/industry/requests/${request.id}`}
                className="group flex justify-between items-center bg-accent/30 hover:bg-accent/60 p-4 border border-transparent hover:border-border/60 rounded-3xl transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {request.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {request.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={request.status} />
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <BellRing size={20} className="text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-accent/30 p-5 border border-transparent hover:border-border/40 rounded-3xl transition-colors"
              >
                <p className="font-semibold text-foreground text-sm leading-snug">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  <div className="bg-primary rounded-full w-1.5 h-1.5 animate-pulse" />
                  {notification.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
