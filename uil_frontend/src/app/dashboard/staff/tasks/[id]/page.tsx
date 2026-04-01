"use client";

import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  History,
  MessageSquare,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StaffTaskDetail() {
  const [progress, setProgress] = useState(65);
  const [updateNote, setUpdateNote] = useState("");

  const task = {
    id: 1,
    title: "AI-Powered Quality Control System",
    industry: "TechCorp Industries",
    contactPerson: "John Doe",
    contactEmail: "john.doe@techcorp.com",
    status: "in-progress",
    priority: "high",
    assignedDate: "March 27, 2026",
    deadline: "April 15, 2026",
    budget: "$75,000",
    description:
      "Develop an AI-powered quality control system for manufacturing line. The system should detect defects in real-time using computer vision and machine learning algorithms.",
    requirements: [
      "Computer vision implementation for defect detection",
      "Machine learning model training on manufacturing data",
      "Real-time processing capabilities",
      "Integration with existing production systems",
      "Comprehensive documentation and training materials",
    ],
  };

  const timeline = [
    {
      id: "1",
      title: "Task Assigned",
      description: "Assigned to you by linkage office",
      timestamp: "Mar 27, 2026",
      user: "Admin",
      type: "assignment" as const,
    },
    {
      id: "2",
      title: "Project Started",
      description: "Initial research phase started",
      timestamp: "Mar 28, 2026",
      user: "Self",
      type: "status" as const,
    },
    {
      id: "3",
      title: "CV Module Done",
      description: "Completed computer vision module (40%)",
      timestamp: "Mar 30, 2026",
      user: "Self",
      type: "comment" as const,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-6">
        <Link
          href="/dashboard/staff/tasks"
          className="group inline-flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          BACK TO ALL TASKS
        </Link>

        <div className="flex md:flex-row flex-col justify-between md:items-start gap-6">
          <div className="space-y-2">
            <h1 className="font-black text-foreground text-3xl md:text-4xl tracking-tight">
              {task.title}
            </h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-border/60 rounded-2xl h-12 font-bold"
            >
              <MessageSquare size={18} className="mr-2" /> Discussion
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 shadow-lg rounded-2xl h-12 font-bold">
              <CheckCircle2 size={18} className="mr-2" /> Mark Completed
            </Button>
          </div>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Main Info Card */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-accent/20 p-8 border-border/40 border-b">
              <CardTitle className="flex items-center gap-2 font-bold text-xl">
                <FileText size={20} className="text-primary" />
                Assignment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                        Industry Partner
                      </p>
                      <p className="font-bold text-foreground leading-tight">
                        {task.industry}
                      </p>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {task.contactPerson} • {task.contactEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                        Budget Allocation
                      </p>
                      <p className="font-bold text-foreground">{task.budget}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div className="gap-6 grid grid-cols-2">
                      <div>
                        <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                          Assigned
                        </p>
                        <p className="font-bold text-foreground text-sm">
                          {task.assignedDate}
                        </p>
                      </div>
                      <div>
                        <p className="font-black text-[10px] text-destructive uppercase tracking-widest">
                          Deadline
                        </p>
                        <p className="font-bold text-foreground text-sm">
                          {task.deadline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-border/40 border-t">
                <div>
                  <p className="mb-2 font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                    Requirement Checklist
                  </p>
                  <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
                    {task.requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 bg-accent/10 p-3 border border-border/30 rounded-xl font-medium text-foreground text-sm"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 text-primary shrink-0"
                        />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Progress Form */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <CardTitle className="font-bold text-xl">
                Post Progress Update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8 pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                    Current Completion Velocity
                  </label>
                  <span className="font-black text-primary text-2xl">
                    {progress}%
                  </span>
                </div>
                <input
                  type="range"
                  className="bg-accent rounded-lg w-full h-2 accent-primary appearance-none cursor-pointer"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                />
                <Progress value={progress} className="hidden h-1" />
              </div>

              <div className="space-y-3">
                <label className="ml-1 font-bold text-muted-foreground text-xs">
                  Update Log Message
                </label>
                <Textarea
                  placeholder="Describe your recent milestones or hurdles..."
                  className="bg-accent/10 p-4 border-border/40 rounded-2xl min-h-30"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                />
              </div>

              <div className="flex sm:flex-row flex-col gap-4">
                <div className="group relative flex-1">
                  <div className="flex justify-center items-center bg-accent/5 p-4 border-2 border-border/60 group-hover:border-primary/40 border-dashed rounded-2xl transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload
                        className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors"
                        size={24}
                      />
                      <p className="font-bold text-muted-foreground group-hover:text-foreground text-xs">
                        Upload Deliverables
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="shadow-lg shadow-primary/20 px-10 rounded-2xl h-full font-black uppercase tracking-widest">
                  Submit Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Project Health Card */}
          <Card className="bg-accent/10 shadow-sm border-border/50 rounded-[2.5rem]">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2 text-center">
                <div className="inline-flex justify-center items-center bg-background mb-2 border-4 border-emerald-500/20 rounded-full w-16 h-16 text-emerald-600">
                  <Clock size={32} />
                </div>
                <h3 className="font-black text-2xl">14 Days</h3>
                <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                  Remaining until deadline
                </p>
              </div>

              <div className="space-y-3 pt-4 border-border/40 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">
                    Project Status
                  </span>
                  <span className="font-bold text-[10px] text-emerald-600 uppercase tracking-widest">
                    On Track
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">
                    Days Elapsed
                  </span>
                  <span className="font-bold text-foreground">5 Days</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="hover:bg-destructive/5 border-border/60 rounded-xl w-full font-bold text-destructive text-xs"
              >
                <AlertCircle size={14} className="mr-2" /> Request Extension
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center gap-2 p-8 pb-4">
              <History size={18} className="text-muted-foreground" />
              <CardTitle className="font-bold text-lg">Task Log</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ActivityTimeline items={timeline} />
            </CardContent>
          </Card>

          {/* Support */}
          <div className="space-y-3 bg-indigo-500/5 p-6 border border-indigo-500/20 rounded-[2rem]">
            <div className="flex items-center gap-2 font-bold text-indigo-600 text-xs uppercase tracking-widest">
              <HelpCircle size={16} /> Need Clarification?
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              If you require more information from the industry partner, use the
              discussion board or contact the office.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto font-bold text-indigo-600 text-xs"
            >
              Contact Linkage Office &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
