"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  FileText,
  Paperclip,
  Download,
  Mail,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/badges";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export default function RequestDetailPage() {
  const request = {
    id: 1,
    title: "AI-Powered Quality Control System",
    type: "Technical Support",
    status: "in-progress" as const,
    priority: "high" as const,
    submittedDate: "March 25, 2026",
    budget: "$75,000",
    description:
      "We are seeking collaboration to develop an AI-powered quality control system for our manufacturing line. The system should be able to detect defects in real-time using computer vision and machine learning algorithms. We need expertise in deep learning, image processing, and industrial automation integration.",
    assignedTo: {
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      email: "sarah.johnson@university.edu",
    },
    attachments: [
      { name: "requirements_document.pdf", size: "2.4 MB" },
      { name: "technical_specifications.docx", size: "1.1 MB" },
    ],
  };

  const timeline = [
    {
      id: "1",
      title: "Request Submitted",
      description: "Request successfully submitted for review",
      timestamp: "Mar 25, 10:30 AM",
      user: "John Doe",
      type: "status" as const,
    },
    {
      id: "2",
      title: "Request Under Review",
      description: "Linkage office is reviewing your request",
      timestamp: "Mar 26, 09:15 AM",
      user: "Admin Office",
      type: "status" as const,
    },
    {
      id: "3",
      title: "Assigned to Expert",
      description: "Request assigned to Dr. Sarah Johnson",
      timestamp: "Mar 27, 02:45 PM",
      user: "Admin Office",
      type: "assignment" as const,
    },
    {
      id: "4",
      title: "Progress Update",
      description:
        "Initial assessment completed. Project plan being developed.",
      timestamp: "Mar 29, 11:20 AM",
      user: "Dr. Sarah Johnson",
      type: "comment" as const,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Back Action */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/industry/requests"
          className="group inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to My Requests
        </Link>

        <div className="flex md:flex-row flex-col justify-between md:items-end gap-6">
          <div className="space-y-3">
            <h1 className="font-bold text-foreground text-3xl md:text-4xl tracking-tight">
              {request.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <Badge
                variant="secondary"
                className="bg-accent/50 px-3 py-1 border-none rounded-lg text-muted-foreground"
              >
                {request.type}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2 border-border/60 rounded-2xl font-bold"
          >
            <ExternalLink size={16} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Details & Content */}
        <div className="space-y-8 lg:col-span-2">
          <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="font-bold text-xl tracking-tight">
                Request Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              {/* Meta Grid */}
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 bg-accent/30 p-6 border border-border/40 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Submission Date
                    </p>
                    <p className="font-bold text-foreground">
                      {request.submittedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-background shadow-sm p-3 border border-border/50 rounded-2xl text-emerald-500">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                      Est. Budget
                    </p>
                    <p className="font-bold text-foreground">
                      {request.budget}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                  <FileText size={18} className="text-primary" />
                  Description
                </div>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {request.description}
                </p>
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                  <Paperclip size={18} className="text-primary" />
                  Attached Documents
                </div>
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                  {request.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="group flex justify-between items-center bg-accent/20 hover:bg-accent/40 p-4 border border-border/40 rounded-2xl transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-background p-2 rounded-xl text-muted-foreground">
                          <FileText size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-foreground text-xs truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 rounded-xl hover:text-primary"
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline Card */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="font-bold text-xl tracking-tight">
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <ActivityTimeline items={timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          {/* Assignment Card */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <div className="bg-primary h-2" />
            <CardHeader className="px-8 pt-6">
              <CardTitle className="font-bold text-lg tracking-tight">
                Assigned Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="flex items-center gap-4">
                <div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-14 h-14 text-primary">
                  <User size={28} />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {request.assignedTo.name}
                  </p>
                  <p className="font-medium text-muted-foreground text-xs">
                    {request.assignedTo.department}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="gap-2 rounded-xl w-full h-11 font-bold"
                  variant="outline"
                >
                  <Mail size={16} />
                  Send Message
                </Button>
                <p className="font-bold text-[10px] text-muted-foreground text-center uppercase tracking-widest">
                  Direct Contact: {request.assignedTo.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help/Support Box */}
          <div className="space-y-4 bg-slate-900 shadow-xl p-8 rounded-[2.5rem] text-white">
            <div className="flex justify-center items-center bg-white/10 rounded-xl w-10 h-10">
              <HelpCircle size={20} className="text-white" />
            </div>
            <h3 className="font-bold text-lg">Need clarification?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              If you have questions regarding the assignment or current
              progress, our Linkage Office is here to assist you.
            </p>
            <Button className="bg-white hover:bg-slate-200 rounded-xl w-full h-11 font-bold text-slate-900">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
