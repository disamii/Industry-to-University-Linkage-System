"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StatusBadge,
  PriorityBadge,
} from "@/components/dashboard/reusable/badges";
import { Card, CardContent } from "@/components/ui/card";

export default function MyTasksPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const tasks = [
    {
      id: 1,
      title: "AI-Powered Quality Control System",
      industry: "TechCorp Industries",
      status: "in-progress",
      priority: "high",
      progress: 65,
      deadline: "Apr 15, 2026",
    },
    {
      id: 2,
      title: "Material Testing and Analysis",
      industry: "BuildRight Construction",
      status: "in-progress",
      priority: "medium",
      progress: 80,
      deadline: "Apr 10, 2026",
    },
    {
      id: 3,
      title: "Big Data Processing Pipeline",
      industry: "DataFlow Systems",
      status: "completed",
      priority: "low",
      progress: 100,
      deadline: "Mar 30, 2026",
    },
    {
      id: 4,
      title: "Renewable Energy Feasibility",
      industry: "GreenEnergy Co",
      status: "assigned",
      priority: "high",
      progress: 10,
      deadline: "Apr 20, 2026",
    },
    {
      id: 5,
      title: "ML Model Optimization",
      industry: "TechCorp Industries",
      status: "in-progress",
      priority: "medium",
      progress: 45,
      deadline: "Apr 18, 2026",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="font-black text-foreground text-3xl md:text-4xl tracking-tight">
            Project Pipeline
          </h1>
          <p className="font-medium text-muted-foreground italic">
            Tracking your active industry collaborations.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-accent/20 p-1.5 border border-border/40 rounded-2xl">
          <Button
            variant="ghost"
            size="sm"
            className="bg-background shadow-sm px-3 rounded-xl"
          >
            <List size={16} className="mr-2" /> List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <LayoutGrid size={16} className="mr-2" /> Board
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="shadow-sm border-border/50 rounded-[2rem] overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="relative flex-1">
              <Search
                className="top-1/2 left-4 absolute text-muted-foreground -translate-y-1/2"
                size={18}
              />
              <Input
                placeholder="Search by project or partner..."
                className="bg-accent/10 pl-12 border-border/40 rounded-2xl focus:ring-primary/20 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select>
                <SelectTrigger className="bg-background border-border/60 rounded-2xl w-35 h-12 font-bold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-background border-border/60 rounded-2xl w-35 h-12 font-bold">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="p-0 border-border/60 rounded-2xl w-12 h-12"
              >
                <SlidersHorizontal size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Data List */}
      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 mb-2 px-8 font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          <div className="col-span-5">Project Details</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-center">Execution Progress</div>
          <div className="col-span-2 text-right">Deadline</div>
        </div>

        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => router.push(`/dashboard/staff/tasks/${task.id}`)}
            className="group relative bg-card hover:shadow-primary/5 hover:shadow-xl p-6 md:p-8 border border-border/50 hover:border-primary/40 rounded-[2rem] overflow-hidden transition-all cursor-pointer"
          >
            {/* Hover Accent */}
            <div className="top-0 bottom-0 left-0 absolute bg-primary w-1.5 scale-y-0 group-hover:scale-y-100 origin-top transition-transform transform" />

            <div className="items-center gap-6 grid grid-cols-1 md:grid-cols-12">
              {/* Project Info */}
              <div className="space-y-2 col-span-1 md:col-span-5">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-foreground group-hover:text-primary text-lg leading-tight transition-colors">
                    {task.title}
                  </h3>
                  <div className="hidden md:block">
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
                  <Building2 size={14} className="text-primary" />
                  {task.industry}
                </div>
              </div>

              {/* Status */}
              <div className="flex md:justify-center col-span-1 md:col-span-2">
                <StatusBadge status={task.status} />
              </div>

              {/* Progress */}
              <div className="space-y-2 col-span-1 md:col-span-3 px-0 md:px-6">
                <div className="flex justify-between font-black text-[10px] text-muted-foreground uppercase">
                  <span>Task Velocity</span>
                  <span className="text-foreground">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="bg-accent/50 h-2" />
              </div>

              {/* Deadline & Action */}
              <div className="flex justify-between md:justify-end items-center gap-4 col-span-1 md:col-span-2">
                <div className="text-left md:text-right">
                  <div className="flex md:justify-end items-center gap-1.5 mb-1 font-bold text-foreground text-xs">
                    <Calendar size={14} className="text-primary" />
                    {task.deadline}
                  </div>
                  <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                    Target Completion
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
