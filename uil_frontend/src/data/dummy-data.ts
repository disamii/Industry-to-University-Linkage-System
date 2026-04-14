import { RequestPriority, RequestStatus, RequestType } from "@/lib/enums";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";

export const notifications = [
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

export const recentRequests: IndustryRequestResponse[] = [
  {
    id: "1",
    title: "AI Quality Control System",
    type: RequestType.INTERNSHIP,
    status: RequestStatus.ASSIGNED,
    created_at: new Date("2026-12-05"),
    priority: RequestPriority.LOW,
    industry_id: "string",
  },
  {
    id: "2",
    title: "Supply Chain Optimization",
    type: RequestType.OTHER,
    status: RequestStatus.IN_REVIEW,
    created_at: new Date("2026-12-05"),
    priority: RequestPriority.MEDIUM,
    industry_id: "string",
  },
  {
    id: "3",
    title: "Renewable Energy Analysis",
    type: RequestType.MAINTENANCE,
    status: RequestStatus.REJECTED,
    created_at: new Date("2026-12-05"),
    priority: RequestPriority.HIGH,
    industry_id: "string",
  },
] as const;

export const stats = [
  {
    title: "Total Requests",
    value: "12",
    icon: FileText,
    color: "bg-primary",
  },
  {
    title: "Active Requests",
    value: "5",
    icon: Clock,
    color: "bg-amber-500",
    trend: { value: "2", isPositive: true },
  },
  {
    title: "Completed",
    value: "7",
    icon: CheckCircle,
    color: "bg-emerald-500",
  },
  {
    title: "Success Rate",
    value: "94%",
    icon: TrendingUp,
    color: "bg-purple-500",
    trend: { value: "5%", isPositive: true },
  },
];

export const timeline = [
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
    description: "Initial assessment completed. Project plan being developed.",
    timestamp: "Mar 29, 11:20 AM",
    user: "Dr. Sarah Johnson",
    type: "comment" as const,
  },
];
