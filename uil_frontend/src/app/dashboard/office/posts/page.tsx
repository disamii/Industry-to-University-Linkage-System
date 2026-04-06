"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  SquarePen,
  Eye,
  Edit3,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
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
import { DataTable } from "@/components/dashboard/reusable/data-table";
import {
  StatusBadge,
  PriorityBadge,
} from "@/components/dashboard/reusable/badges";

export default function PostsManagement() {
  const posts = [
    {
      id: 1,
      title: "AI Research Initiative Launch",
      type: "Research Call",
      status: "published",
      createdAt: "Mar 15, 2026",
      publishedAt: "Mar 20, 2026",
    },
    {
      id: 2,
      title: "Industry Partnership Success Story",
      type: "Success Story",
      status: "published",
      createdAt: "Mar 10, 2026",
      publishedAt: "Mar 12, 2026",
    },
    {
      id: 3,
      title: "Upcoming Technology Symposium",
      type: "Event",
      status: "pending",
      createdAt: "Mar 25, 2026",
      publishedAt: null,
    },
    {
      id: 4,
      title: "Manufacturing Innovation Project",
      type: "Project",
      status: "published",
      createdAt: "Feb 28, 2026",
      publishedAt: "Mar 5, 2026",
    },
    {
      id: 5,
      title: "New Collaboration Guidelines",
      type: "Announcement",
      status: "pending",
      createdAt: "Mar 28, 2026",
      publishedAt: null,
    },
  ];

  const stats = [
    {
      label: "Total Posts",
      value: "124",
      icon: FileText,
      color: "text-primary",
    },
    { label: "Live Now", value: "86", icon: Globe, color: "text-emerald-500" },
    {
      label: "Pending Review",
      value: "12",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Avg. Engagement",
      value: "2.4k",
      icon: TrendingUp,
      color: "text-indigo-500",
    },
  ];

  const columns = [
    {
      key: "title",
      label: "Content Title",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-accent/50 border border-border/50 rounded-xl w-10 h-10 shrink-0">
            <SquarePen className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/office/posts/${row.id}`}
              className="block font-bold text-foreground hover:text-primary truncate transition-colors"
            >
              {value}
            </Link>
            <div className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
              ID: #UIL-{row.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Category",
      render: (value: string) => (
        <PriorityBadge
          priority={value === "Research Call" ? "high" : "medium"}
          // label={value}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => <StatusBadge status={value} />,
    },
    {
      key: "date",
      label: "Timeline",
      render: (_: any, row: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
            <span className="font-bold text-[9px] uppercase tracking-tighter">
              Drafted:
            </span>
            {row.createdAt}
          </div>
          {row.publishedAt && (
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-600">
              <CheckCircle2 size={12} />
              {row.publishedAt}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_: any, row: any) => (
        <div className="flex justify-end items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/10 rounded-xl hover:text-primary"
          >
            <Link href={`/dashboard/office/posts/${row.id}`}>
              <Eye size={16} />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/10 rounded-xl hover:text-primary"
          >
            <Link href={`/dashboard/office/posts/${row.id}/edit`}>
              <Edit3 size={16} />
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            Portal Content
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage announcements, research calls, and partnership success
            stories.
          </p>
        </div>
        <Button
          asChild
          className="gap-2 shadow-lg shadow-primary/20 px-6 rounded-2xl h-11 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Link href="/dashboard/office/posts/create">
            <Plus size={18} />
            Create New Post
          </Link>
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

      {/* Management Table Container */}
      <div className="bg-card shadow-sm p-4 md:p-8 border border-border/50 rounded-[2.5rem]">
        <div className="flex lg:flex-row flex-col items-center gap-4 mb-8">
          <div className="group relative flex-1 w-full">
            <Search className="top-1/2 left-4 absolute w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors -translate-y-1/2" />
            <Input
              placeholder="Search posts by title, category, or status..."
              className="bg-background pl-11 border-border/60 rounded-2xl focus:ring-2 focus:ring-primary/10 w-full h-12 transition-all"
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="bg-background border-border/60 rounded-2xl w-full sm:w-[200px] h-12 font-bold text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="research">Research Call</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="story">Success Stories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nested DataTable with its own border radius as per Industries example */}
        <div className="border border-border/40 rounded-[1.5rem] overflow-hidden">
          <DataTable columns={columns} data={posts} />
        </div>
      </div>
    </div>
  );
}
