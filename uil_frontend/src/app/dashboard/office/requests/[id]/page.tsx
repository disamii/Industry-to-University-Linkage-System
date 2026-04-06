"use client";

import { ActivityTimeline } from "@/components/dashboard/reusable/activity-timeline";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/dashboard/reusable/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileDown,
  Mail,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminRequestDetail() {
  const [showAssignModal, setShowAssignModal] = useState(false);

  const request = {
    id: 1,
    industry: "TechCorp Industries",
    contactPerson: "John Doe",
    contactEmail: "john.doe@techcorp.com",
    title: "AI-Powered Quality Control System",
    type: "Technical Support",
    status: "in-progress",
    priority: "high",
    submittedDate: "March 25, 2026",
    budget: "$75,000",
    description:
      "We are seeking collaboration to develop an AI-powered quality control system for our manufacturing line. The system should be able to detect defects in real-time using computer vision and machine learning algorithms.",
    assignedTo: {
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      email: "sarah.johnson@university.edu",
    },
  };

  const timeline = [
    {
      id: "1",
      title: "Request Submitted",
      description: "Received from TechCorp Industries",
      timestamp: "Mar 25, 10:30 AM",
      user: "John Doe",
      type: "status" as const,
    },
    {
      id: "2",
      title: "Under Review",
      description: "Admin started reviewing",
      timestamp: "Mar 26, 09:15 AM",
      user: "Admin Office",
      type: "status" as const,
    },
    {
      id: "3",
      title: "Assigned to Expert",
      description: "Assigned to Dr. Sarah Johnson",
      timestamp: "Mar 27, 02:45 PM",
      user: "Admin Office",
      type: "assignment" as const,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation & Actions */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
        <div className="space-y-4">
          <Link
            href="/dashboard/office/requests"
            className="group flex items-center gap-2 font-bold text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            BACK TO PIPELINE
          </Link>
          <div className="space-y-2">
            <h1 className="font-black text-foreground text-3xl md:text-4xl tracking-tight">
              {request.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <span className="bg-accent/50 px-3 py-1 rounded-full font-bold text-muted-foreground text-xs uppercase tracking-widest">
                {request.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAssignModal(true)}
            className="shadow-lg shadow-primary/20 px-6 rounded-2xl h-12 font-bold"
          >
            {request.assignedTo ? "Reassign Expert" : "Assign Staff"}
          </Button>
          <Select defaultValue={request.status}>
            <SelectTrigger className="bg-card border-border/60 rounded-2xl w-[180px] h-12 font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl font-medium">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Industry & Details Section */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-accent/20 p-8 border-border/40 border-b">
              <CardTitle className="flex items-center gap-2 font-bold text-xl">
                <Building2 size={20} className="text-primary" />
                Project Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Industry Partner
                  </p>
                  <p className="font-bold text-foreground text-lg">
                    {request.industry}
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-medium text-primary text-sm">
                    <User size={14} /> {request.contactPerson}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Financial Scope
                  </p>
                  <p className="font-bold text-emerald-600 text-lg">
                    {request.budget}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-muted-foreground text-xs">
                    <Calendar size={14} /> Received {request.submittedDate}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-border/40 border-t">
                <p className="mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                  Requirement Description
                </p>
                <p className="font-medium text-foreground text-lg italic leading-relaxed">
                  "{request.description}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="font-bold text-xl">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ActivityTimeline items={timeline} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Current Expert */}
          <Card className="bg-primary/[0.02] shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-bold text-lg">
                Assigned Expert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {request.assignedTo ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-background shadow-sm p-4 border border-border/40 rounded-[2rem]">
                    <div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-14 h-14 text-primary">
                      <User size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {request.assignedTo.name}
                      </p>
                      <p className="font-bold text-[10px] text-muted-foreground uppercase">
                        {request.assignedTo.department}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="gap-2 border-border/60 rounded-xl w-full font-bold text-xs"
                    >
                      <Mail size={14} /> Email Expert
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-xl w-full font-bold text-xs"
                    >
                      View Full Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-6 text-center">
                  <div className="flex justify-center items-center bg-accent/50 mx-auto rounded-full w-12 h-12 text-muted-foreground">
                    <User size={24} />
                  </div>
                  <p className="font-medium text-muted-foreground text-sm">
                    No expert assigned yet.
                  </p>
                  <Button
                    onClick={() => setShowAssignModal(true)}
                    variant="secondary"
                    className="rounded-xl w-full font-bold"
                  >
                    Choose Specialist
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Tools */}
          <Card className="shadow-sm border-border/50 rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-bold text-lg">
                Decision Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-8 pt-0">
              <Button
                variant="outline"
                className="justify-start gap-3 border-border/60 rounded-xl w-full h-12 font-bold"
              >
                <MessageSquare size={18} className="text-primary" />
                Contact Partner
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-3 border-border/60 rounded-xl w-full h-12 font-bold"
              >
                <FileDown size={18} className="text-blue-500" />
                Export Brief (PDF)
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-3 hover:bg-destructive/5 border-border/40 rounded-xl w-full h-12 font-bold text-destructive hover:text-destructive"
              >
                <XCircle size={18} />
                Reject Request
              </Button>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <div className="space-y-4 px-2">
            <h3 className="font-black text-muted-foreground text-xs uppercase tracking-widest">
              Internal Memo
            </h3>
            <Textarea
              placeholder="Private notes for the Linkage Office..."
              className="bg-accent/10 p-4 border-border/40 rounded-[1.5rem] focus:ring-primary/20 min-h-[150px]"
            />
            <Button className="rounded-xl w-full font-bold">Save Memo</Button>
          </div>
        </div>
      </div>

      {/* Modal Backdrop - Simulating Shadcn Dialog */}
      {showAssignModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="shadow-2xl border-border/50 rounded-[2.5rem] w-full max-w-md animate-in duration-200 fade-in zoom-in-95">
            <CardHeader className="p-8">
              <CardTitle className="font-black text-2xl">
                Assign Specialist
              </CardTitle>
              <p className="text-muted-foreground">
                Select the most qualified expert for this linkage.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-8 pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="ml-1 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger className="bg-accent/20 border-border/60 rounded-2xl h-12">
                      <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                    Academic Staff
                  </label>
                  <Select>
                    <SelectTrigger className="bg-accent/20 border-border/60 rounded-2xl h-12">
                      <SelectValue placeholder="Select Expert" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="1">
                        Dr. Sarah Johnson (3 Active)
                      </SelectItem>
                      <SelectItem value="2">
                        Dr. Michael Chen (2 Active)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 rounded-2xl h-12 font-bold"
                  onClick={() => setShowAssignModal(false)}
                >
                  Confirm Assignment
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 rounded-2xl h-12 font-bold"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
