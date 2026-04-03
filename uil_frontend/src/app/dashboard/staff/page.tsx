"use client";

import React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  History,
  Bell,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge, PriorityBadge } from "@/components/dashboard/badges";

export default function StaffDashboard() {
  const myTasks = [
    {
      id: 1,
      title: "AI Quality Control System",
      status: "in-progress",
      priority: "high",
      deadline: "Apr 15, 2026",
      progress: 65,
    },
    {
      id: 2,
      title: "Material Testing Analysis",
      status: "in-progress",
      priority: "medium",
      deadline: "Apr 10, 2026",
      progress: 30,
    },
    {
      id: 3,
      title: "Big Data Processing Pipeline",
      status: "completed",
      priority: "low",
      deadline: "Mar 30, 2026",
      progress: 100,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      message: "Admin approved your phase 1 documentation",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      id: 2,
      message: "New message from TechCorp Industries",
      time: "1 day ago",
      icon: Bell,
      color: "text-primary",
    },
    {
      id: 3,
      message: "System Maintenance scheduled for Friday",
      time: "2 days ago",
      icon: History,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-black text-foreground text-3xl md:text-4xl tracking-tight">
            Expert Dashboard
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            Welcome back,{" "}
            <span className="text-primary">Dr. Sarah Johnson</span>. You have 2
            pending deadlines this week.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-border/60 rounded-2xl font-bold"
          >
            My Profile
          </Button>
          <Button className="shadow-lg shadow-primary/20 rounded-2xl font-bold">
            Submit Progress
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value="5"
          icon={CheckSquare}
          color="bg-primary"
        />
        <StatCard
          title="Active Projects"
          value="2"
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="Completed"
          value="12"
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          title="Impact Score"
          value="96%"
          icon={TrendingUp}
          color="bg-indigo-500"
          trend={{ value: "4%", isPositive: true }}
        />
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Task List */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center px-8 pt-8">
              <div>
                <CardTitle className="font-bold text-xl">
                  Current Assignments
                </CardTitle>
                <CardDescription>
                  Industry projects requiring your expertise.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                className="gap-1 font-bold text-primary text-xs"
              >
                VIEW ALL <ArrowRight size={14} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 px-8 pb-8">
              {myTasks.map((task) => (
                <Link key={task.id} href={`/dashboard/staff/tasks/${task.id}`}>
                  <div className="group bg-accent/20 hover:bg-accent/30 mb-4 p-6 border border-border/40 hover:border-primary/30 rounded-[2rem] transition-all">
                    <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </h3>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                            <span>Completion</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress
                            value={task.progress}
                            className="bg-background h-1.5"
                          />
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-6 pl-6 border-border/40 border-l shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                            Deadline
                          </p>
                          <p className="font-bold text-foreground text-sm">
                            {task.deadline}
                          </p>
                        </div>
                        <StatusBadge status={task.status} />
                        <ExternalLink
                          size={18}
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Activity & Support */}
        <div className="space-y-8">
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-bold text-lg">
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`mt-1 shrink-0 ${activity.color}`}>
                    <activity.icon size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm leading-tight">
                      {activity.message}
                    </p>
                    <p className="mt-1 font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help Banner */}
          <div className="relative bg-primary shadow-primary/20 shadow-xl p-8 rounded-[2.5rem] overflow-hidden text-primary-foreground">
            <div className="z-10 relative space-y-4">
              <div className="flex justify-center items-center bg-white/20 backdrop-blur-md rounded-2xl w-12 h-12">
                <LifeBuoy size={24} />
              </div>
              <h2 className="font-bold text-xl leading-tight">
                Need administrative assistance?
              </h2>
              <p className="font-medium text-primary-foreground/80 text-sm">
                Our Linkage Office is here to help with documentation, funding,
                or industry communication.
              </p>
              <Button className="bg-white hover:bg-white/90 rounded-xl w-full font-bold text-primary">
                Contact Office
              </Button>
            </div>
            {/* Decorative background shape */}
            <div className="-right-10 -bottom-10 absolute bg-white/10 blur-3xl rounded-full w-40 h-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
