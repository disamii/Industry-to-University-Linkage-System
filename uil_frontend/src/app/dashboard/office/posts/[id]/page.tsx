"use client";

import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/badges";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  FileText,
  Globe,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Mock data tailored to UIL Hub context
  const post = {
    id: id || "1",
    title: "AI Research Initiative Launch",
    description:
      "We are excited to announce a new AI research initiative focused on developing practical solutions for manufacturing industries. This program invites industry partners to collaborate with our leading researchers in machine learning and machine vision.\n\nThe initiative aims to bridge the gap between academic research and real-world industrial applications. We are particularly interested in projects involving predictive maintenance, quality control automation, and process optimization using artificial intelligence.",
    type: "Research Call",
    status: "completed" as const, // matching your statusStyles keys
    createdAt: "Mar 15, 2026, 10:30 AM",
    publishedAt: "Mar 20, 2026, 2:15 PM",
    author: "Dr. Emily Carter",
    views: "1,247",
    department: "Computer Science & IT",
  };

  const timelineItems = [
    {
      id: "1",
      title: "Post Published",
      description: "The research call is now live on the public portal.",
      timestamp: "2 days ago",
      user: "Admin",
      type: "status" as const,
    },
    {
      id: "2",
      title: "Final Review",
      description: "Content verified by University-Industry Liaison office.",
      timestamp: "3 days ago",
      user: "Dr. Emily Carter",
      type: "comment" as const,
    },
    {
      id: "3",
      title: "Post Created",
      description: "Initial draft submitted for review.",
      timestamp: "1 week ago",
      user: "Dr. Emily Carter",
      type: "upload" as const,
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Navigation & Actions Header */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 font-bold text-[10px] text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Content Management
          </button>
          <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
            View Post Details
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="border-border/60 rounded-xl"
          >
            <Trash2 size={18} className="text-destructive" />
          </Button>
          <Button
            asChild
            className="gap-2 shadow-lg shadow-primary/20 px-6 rounded-2xl h-11 font-bold"
          >
            <Link href={`/dashboard/office/posts/${id}/edit`}>
              <Edit3 size={18} />
              Edit Content
            </Link>
          </Button>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="bg-card shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <StatusBadge status={post.status} />
                <PriorityBadge
                  priority="high"
                  // label={post.type}
                />
                <span className="flex items-center gap-1.5 ml-auto font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  <Eye size={14} className="text-primary" /> {post.views} Views
                </span>
              </div>

              <h2 className="mb-6 font-bold text-foreground text-3xl leading-tight">
                {post.title}
              </h2>

              <div className="dark:prose-invert max-w-none prose prose-slate">
                {post.description.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="mb-6 font-medium text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Content Footer Info */}
            <div className="gap-6 grid grid-cols-2 md:grid-cols-4 bg-accent/30 p-8 border-border/50 border-t">
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Author
                </p>
                <p className="font-bold text-foreground text-sm">
                  {post.author}
                </p>
              </div>
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Dept.
                </p>
                <p className="font-bold text-foreground text-sm">
                  {post.department}
                </p>
              </div>
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Created
                </p>
                <p className="font-bold text-foreground text-sm">Mar 15</p>
              </div>
              <div>
                <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Visibility
                </p>
                <p className="flex items-center gap-1 font-bold text-emerald-600 text-sm">
                  <Globe size={14} /> Public
                </p>
              </div>
            </div>
          </Card>

          {/* Activity Section */}
          <div className="bg-card shadow-sm p-8 md:p-12 border border-border/50 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-xl tracking-tight">
                Activity History
              </h3>
            </div>
            <ActivityTimeline items={timelineItems} />
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          <Card className="bg-primary shadow-primary/20 shadow-xl p-8 border-none rounded-[2rem] text-primary-foreground">
            <ShieldCheck className="opacity-80 mb-4 w-10 h-10" />
            <h4 className="mb-2 font-bold text-xl">Publishing Status</h4>
            <p className="mb-6 text-primary-foreground/80 text-sm leading-relaxed">
              This post is currently live on the main portal. Any changes will
              be reflected immediately.
            </p>
            <Button
              variant="secondary"
              className="py-6 rounded-xl w-full font-bold"
            >
              Take Offline
            </Button>
          </Card>

          <Card className="bg-card shadow-sm p-8 border-border/50 rounded-[2rem]">
            <h4 className="mb-6 font-bold text-foreground text-sm uppercase tracking-widest">
              Quick Stats
            </h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                    <User size={16} />
                  </div>
                  <span className="font-bold text-muted-foreground text-sm">
                    Unique Views
                  </span>
                </div>
                <span className="font-bold text-foreground">842</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">
                    <FileText size={16} />
                  </div>
                  <span className="font-bold text-muted-foreground text-sm">
                    CTR
                  </span>
                </div>
                <span className="font-bold text-foreground">12.4%</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-border/50 border-t">
              <button className="flex justify-between items-center hover:gap-2 w-full font-bold text-[10px] text-primary uppercase tracking-widest transition-all">
                View Full Analytics <ChevronRight size={14} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
